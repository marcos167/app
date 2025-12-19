"""
Hardcore Monetization - Eligibility Service
Calculates and validates user eligibility for monetization application
"""

from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Dict, Any, List

from server.models.monetization_hardcore import (
    MonetizationEligibilityCriteria,
    MonetizationApplication,
    ApplicationStatus,
    ChallengeType,
    ELIGIBILITY_REQUIREMENTS
)
from server.models.user import User


class EligibilityChecker:
    """Service for checking monetization eligibility"""
    
    def __init__(self, db: Session, user_id: int):
        self.db = db
        self.user_id = user_id
        self.user = db.query(User).filter(User.id == user_id).first()
        self.criteria = self._get_or_create_criteria()
    
    def _get_or_create_criteria(self) -> MonetizationEligibilityCriteria:
        """Get or create eligibility criteria record"""
        criteria = self.db.query(MonetizationEligibilityCriteria).filter(
            MonetizationEligibilityCriteria.user_id == self.user_id
        ).first()
        
        if not criteria:
            criteria = MonetizationEligibilityCriteria(
                user_id=self.user_id,
                account_created_at=self.user.created_at if self.user else datetime.utcnow()
            )
            self.db.add(criteria)
            self.db.commit()
            self.db.refresh(criteria)
        
        return criteria
    
    def update_criteria(self) -> None:
        """Update all criteria from current user data"""
        if not self.user:
            return
        
        # TIME BARRIERS
        self.criteria.account_age_days = (datetime.utcnow() - self.criteria.account_created_at).days
        self.criteria.posts_distributed = self._check_posts_distributed()
        
        # CONTENT BARRIERS
        self.criteria.original_recipes_count = self._count_original_recipes()
        self.criteria.videos_count = self._count_videos()
        self.criteria.moderation_violations = self._count_violations()
        
        # COMMUNITY BARRIERS
        self.criteria.real_followers_count = self._count_real_followers()
        self.criteria.engagement_rate = self._calculate_engagement_rate()
        self.criteria.validated_helpful_comments = self._count_helpful_comments()
        
        # IMPACT BARRIERS
        self.criteria.recipe_executions_by_others = self._count_recipe_executions()
        self.criteria.average_rating = self._calculate_average_rating()
        self.criteria.accessible_content_ratio = self._calculate_accessible_ratio()
        
        # TRUST BARRIERS
        self.criteria.fraud_score = self._calculate_fraud_score()
        if self.criteria.last_suspicious_event:
            self.criteria.days_since_suspicious = (
                datetime.utcnow() - self.criteria.last_suspicious_event
            ).days
        
        # CHALLENGES
        self.criteria.challenges_completed = self._get_completed_challenges()
        
        # UPDATE ELIGIBILITY STATUS
        self.criteria.is_eligible = self._check_all_criteria()
        self.criteria.eligibility_checked_at = datetime.utcnow()
        self.criteria.updated_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(self.criteria)
    
    def get_detailed_status(self) -> Dict[str, Any]:
        """Get detailed eligibility status with progress on each criterion"""
        self.update_criteria()
        
        reqs = ELIGIBILITY_REQUIREMENTS
        
        # TIME
        time_met = (
            self.criteria.account_age_days >= reqs["time"]["min_account_age_days"] and
            self.criteria.posts_distributed
        )
        
        # CONTENT
        content_met = (
            self.criteria.original_recipes_count >= reqs["content"]["min_recipes"] and
            self.criteria.videos_count >= reqs["content"]["min_videos"] and
            self.criteria.moderation_violations <= reqs["content"]["max_violations"]
        )
        
        # COMMUNITY
        community_met = (
            self.criteria.real_followers_count >= reqs["community"]["min_followers"] and
            self.criteria.engagement_rate >= reqs["community"]["min_engagement_rate"] and
            self.criteria.validated_helpful_comments >= reqs["community"]["min_helpful_comments"]
        )
        
        # IMPACT
        impact_met = (
            self.criteria.recipe_executions_by_others >= reqs["impact"]["min_executions"] and
            self.criteria.average_rating >= reqs["impact"]["min_avg_rating"] and
            self.criteria.accessible_content_ratio >= reqs["impact"]["min_accessible_ratio"]
        )
        
        # TRUST
        trust_met = (
            self.criteria.fraud_score <= reqs["trust"]["max_fraud_score"] and
            self.criteria.days_since_suspicious >= reqs["trust"]["min_clean_days"]
        )
        
        # CHALLENGES
        required_challenges = [c.value for c in reqs["challenges"]["required_challenges"]]
        challenges_met = all(c in self.criteria.challenges_completed for c in required_challenges)
        
        return {
            "is_eligible": self.criteria.is_eligible,
            "criteria": {
                "time": {
                    "account_age_days": self.criteria.account_age_days,
                    "required": reqs["time"]["min_account_age_days"],
                    "posts_distributed": self.criteria.posts_distributed,
                    "met": time_met
                },
                "content": {
                    "recipes": self.criteria.original_recipes_count,
                    "required_recipes": reqs["content"]["min_recipes"],
                    "videos": self.criteria.videos_count,
                    "required_videos": reqs["content"]["min_videos"],
                    "violations": self.criteria.moderation_violations,
                    "max_violations": reqs["content"]["max_violations"],
                    "met": content_met
                },
                "community": {
                    "followers": self.criteria.real_followers_count,
                    "required_followers": reqs["community"]["min_followers"],
                    "engagement_rate": round(self.criteria.engagement_rate, 3),
                    "required_engagement": reqs["community"]["min_engagement_rate"],
                    "helpful_comments": self.criteria.validated_helpful_comments,
                    "required_comments": reqs["community"]["min_helpful_comments"],
                    "met": community_met
                },
                "impact": {
                    "executions": self.criteria.recipe_executions_by_others,
                    "required_executions": reqs["impact"]["min_executions"],
                    "avg_rating": round(self.criteria.average_rating, 2),
                    "required_rating": reqs["impact"]["min_avg_rating"],
                    "accessible_ratio": round(self.criteria.accessible_content_ratio, 2),
                    "required_ratio": reqs["impact"]["min_accessible_ratio"],
                    "met": impact_met
                },
                "trust": {
                    "fraud_score": round(self.criteria.fraud_score, 1),
                    "max_fraud_score": reqs["trust"]["max_fraud_score"],
                    "days_since_suspicious": self.criteria.days_since_suspicious,
                    "required_clean_days": reqs["trust"]["min_clean_days"],
                    "met": trust_met
                },
                "challenges": {
                    "completed": self.criteria.challenges_completed,
                    "required": required_challenges,
                    "met": challenges_met
                }
            },
            "can_apply": self.criteria.is_eligible and not self._has_pending_application(),
            "next_milestone": self._get_next_milestone()
        }
    
    def _check_all_criteria(self) -> bool:
        """Check if ALL criteria are met"""
        reqs = ELIGIBILITY_REQUIREMENTS
        
        time_ok = (
            self.criteria.account_age_days >= reqs["time"]["min_account_age_days"] and
            self.criteria.posts_distributed
        )
        
        content_ok = (
            self.criteria.original_recipes_count >= reqs["content"]["min_recipes"] and
            self.criteria.videos_count >= reqs["content"]["min_videos"] and
            self.criteria.moderation_violations <= reqs["content"]["max_violations"]
        )
        
        community_ok = (
            self.criteria.real_followers_count >= reqs["community"]["min_followers"] and
            self.criteria.engagement_rate >= reqs["community"]["min_engagement_rate"] and
            self.criteria.validated_helpful_comments >= reqs["community"]["min_helpful_comments"]
        )
        
        impact_ok = (
            self.criteria.recipe_executions_by_others >= reqs["impact"]["min_executions"] and
            self.criteria.average_rating >= reqs["impact"]["min_avg_rating"] and
            self.criteria.accessible_content_ratio >= reqs["impact"]["min_accessible_ratio"]
        )
        
        trust_ok = (
            self.criteria.fraud_score <= reqs["trust"]["max_fraud_score"] and
            self.criteria.days_since_suspicious >= reqs["trust"]["min_clean_days"]
        )
        
        required_challenges = [c.value for c in reqs["challenges"]["required_challenges"]]
        challenges_ok = all(c in self.criteria.challenges_completed for c in required_challenges)
        
        return all([time_ok, content_ok, community_ok, impact_ok, trust_ok, challenges_ok])
    
    def _has_pending_application(self) -> bool:
        """Check if user has a pending or approved application"""
        app = self.db.query(MonetizationApplication).filter(
            MonetizationApplication.user_id == self.user_id,
            MonetizationApplication.status.in_([
                ApplicationStatus.PENDING,
                ApplicationStatus.UNDER_REVIEW,
                ApplicationStatus.APPROVED
            ])
        ).first()
        return app is not None
    
    def _get_next_milestone(self) -> str:
        """Get the next milestone user should work toward"""
        reqs = ELIGIBILITY_REQUIREMENTS
        
        # Check each category and return first unmet requirement
        if self.criteria.account_age_days < reqs["time"]["min_account_age_days"]:
            days_left = reqs["time"]["min_account_age_days"] - self.criteria.account_age_days
            return f"Aguarde mais {days_left} dias de conta ativa"
        
        if self.criteria.original_recipes_count < reqs["content"]["min_recipes"]:
            needed = reqs["content"]["min_recipes"] - self.criteria.original_recipes_count
            return f"Publique mais {needed} receitas originais"
        
        if self.criteria.videos_count < reqs["content"]["min_videos"]:
            needed = reqs["content"]["min_videos"] - self.criteria.videos_count
            return f"Publique mais {needed} vídeos"
        
        if self.criteria.real_followers_count < reqs["community"]["min_followers"]:
            needed = reqs["community"]["min_followers"] - self.criteria.real_followers_count
            return f"Ganhe mais {needed} seguidores reais"
        
        if self.criteria.recipe_executions_by_others < reqs["impact"]["min_executions"]:
            needed = reqs["impact"]["min_executions"] - self.criteria.recipe_executions_by_others
            return f"Suas receitas precisam ser feitas por mais {needed} pessoas"
        
        if self.criteria.average_rating < reqs["impact"]["min_avg_rating"]:
            return f"Melhore sua avaliação média para {reqs['impact']['min_avg_rating']}"
        
        required_challenges = [c.value for c in reqs["challenges"]["required_challenges"]]
        incomplete = [c for c in required_challenges if c not in self.criteria.challenges_completed]
        if incomplete:
            return f"Complete o desafio: {incomplete[0]}"
        
        return "Todos os critérios atendidos! Você pode aplicar."
    
    # ========================================================================
    # CALCULATION METHODS (Real Implementation)
    # ========================================================================
    
    def _check_posts_distributed(self) -> bool:
        """Check if posts are distributed over time (anti-spike)"""
        from server.models.user import Recipe
        from datetime import timedelta
        
        # Get user's recipes
        recipes = self.db.query(Recipe).filter(Recipe.author == str(self.user_id)).all()
        
        if len(recipes) < 10:
            return True  # Not enough data to detect spike
        
        # Check if recipes are spread across at least 4 different weeks
        if not recipes:
            return False
        
        weeks = set()
        for recipe in recipes:
            week = recipe.created_at.isocalendar()[1]  # Get week number
            weeks.add(week)
        
        return len(weeks) >= 4
    
    def _count_original_recipes(self) -> int:
        """Count original recipes by user"""
        from server.models.user import Recipe
        
        count = self.db.query(Recipe).filter(
            Recipe.author == str(self.user_id),
            Recipe.status == "published"
        ).count()
        
        return count
    
    def _count_videos(self) -> int:
        """Count videos posted by user"""
        from server.models.user import Recipe
        
        # Count recipes with video_url
        count = self.db.query(Recipe).filter(
            Recipe.author == str(self.user_id),
            Recipe.video_url.isnot(None),
            Recipe.video_url != ""
        ).count()
        
        return count
    
    def _count_violations(self) -> int:
        """Count moderation violations"""
        # TODO: Implement when moderation system is ready
        # For now, check if user has any rejected recipes
        from server.models.user import Recipe
        
        count = self.db.query(Recipe).filter(
            Recipe.author == str(self.user_id),
            Recipe.status == "rejected"
        ).count()
        
        return count
    
    def _count_real_followers(self) -> int:
        """Count real followers (excluding bots)"""
        from server.models.user import Follower
        
        # Count followers
        count = self.db.query(Follower).filter(
            Follower.following_id == self.user_id
        ).count()
        
        # TODO: Add bot detection logic
        # For now, return raw count
        return count
    
    def _calculate_engagement_rate(self) -> float:
        """Calculate engagement rate"""
        from server.models.user import Recipe, Follower
        
        followers = self._count_real_followers()
        if followers == 0:
            return 0.0
        
        # Get total reactions on user's recipes
        recipes = self.db.query(Recipe).filter(Recipe.author == str(self.user_id)).all()
        
        total_reactions = sum(
            r.reactions_love + r.reactions_like + r.reviews
            for r in recipes
        )
        
        # Engagement rate = total reactions / followers
        return total_reactions / followers if followers > 0 else 0.0
    
    def _count_helpful_comments(self) -> int:
        """Count validated helpful comments"""
        # TODO: Implement when comment system is ready
        # For now, return 0
        return 0
    
    def _count_recipe_executions(self) -> int:
        """Count times others made user's recipes"""
        # TODO: Implement when recipe execution tracking is ready
        # For now, use reactions as proxy
        from server.models.user import Recipe
        
        recipes = self.db.query(Recipe).filter(Recipe.author == str(self.user_id)).all()
        
        # Use "love" reactions as proxy for executions
        total_executions = sum(r.reactions_love for r in recipes)
        
        return total_executions
    
    def _calculate_average_rating(self) -> float:
        """Calculate average rating across all recipes"""
        from server.models.user import Recipe
        from sqlalchemy import func
        
        avg_rating = self.db.query(func.avg(Recipe.rating)).filter(
            Recipe.author == str(self.user_id),
            Recipe.reviews > 0  # Only count recipes with reviews
        ).scalar()
        
        return float(avg_rating) if avg_rating else 0.0
    
    def _calculate_accessible_ratio(self) -> float:
        """Calculate % of recipes under R$20"""
        from server.models.user import Recipe
        import json
        
        recipes = self.db.query(Recipe).filter(Recipe.author == str(self.user_id)).all()
        
        if not recipes:
            return 0.0
        
        affordable_count = 0
        total_count = 0
        
        for recipe in recipes:
            try:
                # Parse ingredients to estimate cost
                ingredients = json.loads(recipe.ingredients)
                # Simple heuristic: recipes with <= 10 ingredients are likely affordable
                if len(ingredients) <= 10:
                    affordable_count += 1
                total_count += 1
            except:
                total_count += 1
        
        return affordable_count / total_count if total_count > 0 else 0.0
    
    def _calculate_fraud_score(self) -> float:
        """Calculate fraud score (0-100)"""
        # Simple fraud detection based on suspicious patterns
        score = 0.0
        
        # Check for rapid recipe creation (spike)
        if not self._check_posts_distributed():
            score += 30
        
        # Check for low engagement despite high follower count
        engagement = self._calculate_engagement_rate()
        followers = self._count_real_followers()
        
        if followers > 100 and engagement < 0.01:
            score += 20  # Suspicious: many followers but no engagement
        
        # Check for violations
        violations = self._count_violations()
        score += violations * 10
        
        return min(score, 100.0)
    
    def _get_completed_challenges(self) -> List[str]:
        """Get list of completed challenge types"""
        from server.models.monetization_hardcore import UserChallengeProgress
        
        completed = self.db.query(UserChallengeProgress).filter(
            UserChallengeProgress.user_id == self.user_id,
            UserChallengeProgress.completed == True
        ).all()
        
        return [progress.challenge_id for progress in completed]
