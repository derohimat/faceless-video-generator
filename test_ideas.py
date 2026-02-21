import requests
import json

url = "http://localhost:8000/api/ideas"
payload = {
    "prompt": "Kehidupan di Romawi Kuno",
    "language": "Bahasa Indonesia",
    "tone": "Educational"
}
headers = {"Content-Type": "application/json"}

try:
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print("Generated Ideas:")
        for i, idea in enumerate(data['ideas'], 1):
            print(f"{i}. {idea}")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Exception: {e}")
