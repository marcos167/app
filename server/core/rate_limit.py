"""
Rate Limiting Middleware for Chefex API
Prevents abuse on critical endpoints like login, signup, and payments
"""
from fastapi import Request, HTTPException
from datetime import datetime, timedelta
from collections import defaultdict
from typing import Dict, List, Tuple
import logging

logger = logging.getLogger(__name__)


class RateLimiter:
    """In-memory rate limiter with configurable limits per action type"""
    
    def __init__(self):
        # Store requests as {key: [timestamp1, timestamp2, ...]}
        self.requests: Dict[str, List[datetime]] = defaultdict(list)
        
        # Limits: (max_requests, window_seconds)
        self.limits: Dict[str, Tuple[int, int]] = {
            "login": (5, 60),           # 5 tentativas por minuto
            "signup": (3, 60),          # 3 por minuto  
            "password_reset": (3, 300), # 3 por 5 minutos
            "payment": (5, 60),         # 5 por minuto
            "post": (10, 60),           # 10 posts por minuto
            "comment": (20, 60),        # 20 comentários por minuto
            "report": (5, 300),         # 5 denúncias por 5 minutos
            "like": (60, 60),           # 60 likes por minuto
            "follow": (30, 60),         # 30 follows por minuto
            "default": (100, 60)        # 100 requests por minuto
        }
    
    def _get_key(self, identifier: str, action: str) -> str:
        """Generate unique key for rate limiting"""
        return f"{action}:{identifier}"
    
    def _cleanup_old_requests(self, key: str, window_seconds: int) -> None:
        """Remove requests older than the time window"""
        cutoff = datetime.utcnow() - timedelta(seconds=window_seconds)
        self.requests[key] = [t for t in self.requests[key] if t > cutoff]
    
    def check(self, identifier: str, action: str = "default") -> bool:
        """
        Check if request is allowed and record it.
        
        Args:
            identifier: User email, IP, or other unique identifier
            action: Type of action (login, signup, payment, etc)
            
        Raises:
            HTTPException: If rate limit exceeded
            
        Returns:
            True if request is allowed
        """
        limit, window = self.limits.get(action, self.limits["default"])
        key = self._get_key(identifier, action)
        
        # Clean up old requests
        self._cleanup_old_requests(key, window)
        
        # Check if limit exceeded
        if len(self.requests[key]) >= limit:
            remaining_seconds = window - (datetime.utcnow() - self.requests[key][0]).seconds
            logger.warning(f"Rate limit exceeded: {key} - {len(self.requests[key])}/{limit}")
            raise HTTPException(
                status_code=429,
                detail={
                    "error": "rate_limit_exceeded",
                    "message": f"Muitas tentativas. Aguarde {remaining_seconds} segundos.",
                    "retry_after": remaining_seconds
                }
            )
        
        # Record this request
        self.requests[key].append(datetime.utcnow())
        return True
    
    def get_remaining(self, identifier: str, action: str = "default") -> int:
        """Get remaining requests for an identifier"""
        limit, window = self.limits.get(action, self.limits["default"])
        key = self._get_key(identifier, action)
        self._cleanup_old_requests(key, window)
        return max(0, limit - len(self.requests[key]))
    
    def reset(self, identifier: str, action: str = "default") -> None:
        """Reset rate limit for an identifier (e.g., after successful login)"""
        key = self._get_key(identifier, action)
        self.requests[key] = []


# Singleton instance
rate_limiter = RateLimiter()


def get_client_ip(request: Request) -> str:
    """Extract client IP from request, handling proxies"""
    # Check for forwarded headers (common in production)
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip
    
    # Fallback to direct client
    return request.client.host if request.client else "unknown"
