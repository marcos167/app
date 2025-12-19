import requests
import json

def test_signup():
    url = "http://localhost:3000/api/auth/signup"
    payload = {
        "name": "Test User Python",
        "email": "testpython@example.com",
        "password": "password123",
        "profile": "chef"
    }
    
    print(f"POST {url}")
    try:
        response = requests.post(url, json=payload)
        print(f"Status: {response.status_code}")
        try:
            print(f"Body: {response.json()}")
        except:
            print(f"Body: {response.text}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_signup()
