import os
import sys
import json
import requests
import urllib3
import certifi

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Patch requests
old_request = requests.Session.request
def new_request(self, method, url, *args, **kwargs):
    kwargs['verify'] = False
    return old_request(self, method, url, *args, **kwargs)
requests.Session.request = new_request

# Get Key
# Add parent to path to load dotenv via base potentially, or just load .env manually
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), 'backend', '.env'))
api_key = os.getenv("GOOGLE_API_KEY")

print(f"Key loaded: {bool(api_key)}")

url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
headers = {'Content-Type': 'application/json'}
data = {
    "contents": [{
        "parts": [{"text": "Hello, world!"}]
    }]
}

try:
    response = requests.post(url, headers=headers, json=data, verify=False)
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {response.headers}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
