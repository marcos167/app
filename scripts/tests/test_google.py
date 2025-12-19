import requests

def test_google():
    url = "http://localhost:3000/api/auth/google"
    payload = {
        "id_token": "fake_token_123"
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
    test_google()
