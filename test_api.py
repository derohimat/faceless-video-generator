import requests
import json

url = "http://localhost:8000/api/script"
payload = {
    "story_type": "Sejarah Danau Bandung Purba",
    "language": "Bahasa Indonesia",
    "tone": "Educational"
}
headers = {"Content-Type": "application/json"}

try:
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Title: {data['project_info']['title']}")
        print(f"Description: {data['description']}")
        if data['storyboards']:
            print(f"First Scene Subtitles: {data['storyboards'][0]['subtitles']}")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Exception: {e}")
