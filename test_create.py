import requests
import json

url = "http://localhost:8000/api/campaigns"
payload = {
    "name": "Backend Test Campaign",
    "budget": 5000,
    "objective": "Sales",
    "platforms": ["Instagram", "Google Ads"]
}

try:
    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
