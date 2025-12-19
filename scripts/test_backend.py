"""
Test script for backend configuration
Run this to verify backend is production-ready
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def test_imports():
    """Test that all modules can be imported"""
    print("Testing imports...")
    try:
        from server.core.config import get_settings
        from server.core.logging import setup_logging
        from server.core.security import create_access_token, verify_password
        from server.main import app
        print("✅ All imports successful")
        return True
    except Exception as e:
        print(f"❌ Import failed: {e}")
        return False

def test_configuration():
    """Test configuration loading"""
    print("\nTesting configuration...")
    try:
        from server.core.config import get_settings
        settings = get_settings()
        
        # Check required settings
        required = ['APP_NAME', 'APP_VERSION', 'DATABASE_URL', 'SECRET_KEY']
        for key in required:
            if not hasattr(settings, key):
                print(f"❌ Missing setting: {key}")
                return False
        
        print(f"✅ Configuration loaded")
        print(f"   App: {settings.APP_NAME} v{settings.APP_VERSION}")
        print(f"   Debug: {settings.DEBUG}")
        print(f"   Log Level: {settings.LOG_LEVEL}")
        return True
    except Exception as e:
        print(f"❌ Configuration test failed: {e}")
        return False

def test_security():
    """Test security utilities"""
    print("\nTesting security...")
    try:
        from server.core.security import get_password_hash, verify_password, create_access_token
        
        # Test password hashing
        password = "test123"
        hashed = get_password_hash(password)
        if not verify_password(password, hashed):
            print("❌ Password hashing failed")
            return False
        
        # Test token creation
        token = create_access_token({"sub": "test_user"})
        if not token:
            print("❌ Token creation failed")
            return False
        
        print("✅ Security utilities working")
        return True
    except Exception as e:
        print(f"❌ Security test failed: {e}")
        return False

def test_health_endpoint():
    """Test health check endpoint"""
    print("\nTesting health endpoint...")
    try:
        from fastapi.testclient import TestClient
        from server.main import app
        
        client = TestClient(app)
        response = client.get("/health")
        
        if response.status_code != 200:
            print(f"❌ Health check failed: {response.status_code}")
            return False
        
        data = response.json()
        if data.get("status") != "healthy":
            print(f"❌ Health check returned unhealthy status")
            return False
        
        print(f"✅ Health endpoint working")
        print(f"   Status: {data.get('status')}")
        print(f"   Version: {data.get('version')}")
        return True
    except Exception as e:
        print(f"❌ Health endpoint test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("=" * 50)
    print("Backend Production Readiness Test")
    print("=" * 50)
    
    tests = [
        test_imports,
        test_configuration,
        test_security,
        test_health_endpoint,
    ]
    
    results = []
    for test in tests:
        results.append(test())
    
    print("\n" + "=" * 50)
    print(f"Results: {sum(results)}/{len(results)} tests passed")
    print("=" * 50)
    
    if all(results):
        print("\n✅ Backend is production-ready!")
        return 0
    else:
        print("\n❌ Backend has issues that need to be fixed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
