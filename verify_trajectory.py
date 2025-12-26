import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_trajectory():
    print("Testing Revenue Trajectory API...")
    
    # Test 30 days
    resp = requests.get(f"{BASE_URL}/dashboard/revenue-trajectory", params={"days": 30})
    if resp.status_code == 200:
        data = resp.json()
        print(f"30 days check: Found {len(data)} data points. (Expected ~30)")
    else:
        print(f"30 days check FAILED: {resp.status_code}")

    # Test Year (365 days)
    resp = requests.get(f"{BASE_URL}/dashboard/revenue-trajectory", params={"days": 365})
    if resp.status_code == 200:
        data = resp.json()
        print(f"Yearly check: Found {len(data)} data points. (Expected 12)")
        if len(data) > 0:
            print(f"Sample point: {data[0]}")
    else:
        print(f"Yearly check FAILED: {resp.status_code}")

if __name__ == "__main__":
    try:
        test_trajectory()
    except Exception as e:
        print(f"Error connecting to backend: {e}")
