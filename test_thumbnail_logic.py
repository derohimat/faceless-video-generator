import os
from unittest.mock import MagicMock, patch

def mock_get_thumbnail(story_type, story_title):
    # Simulated logic from server.py
    data_dir = "data"
    story_path = os.path.join(data_dir, story_type, story_title)
    images_dir = os.path.join(story_path, "images")
    
    if os.path.exists(images_dir):
        image_files = [f for f in os.listdir(images_dir) if f.endswith(('.png', '.jpg', '.jpeg'))]
        if image_files:
            return f"Found in images/ dir: {image_files[0]}"
    
    if os.path.exists(story_path):
        image_files = [f for f in os.listdir(story_path) if f.endswith(('.png', '.jpg', '.jpeg'))]
        if image_files:
            return f"Found in root dir: {image_files[0]}"
            
    return "Not found"

# Test cases
with patch('os.path.exists') as mock_exists, \
     patch('os.listdir') as mock_listdir:
    
    # Case 1: Image in images/ dir
    mock_exists.side_effect = lambda x: "images" in x or "data\\type\\title" == x
    mock_listdir.side_effect = lambda x: ["thumb.png"] if "images" in x else []
    print(f"Test 1 (images/ dir): {mock_get_thumbnail('type', 'title')}")
    
    # Case 2: Image in root dir
    mock_exists.side_effect = lambda x: "data\\type\\title" == x
    mock_listdir.side_effect = lambda x: ["scene_1.png"] if "data\\type\\title" == x else []
    print(f"Test 2 (root dir): {mock_get_thumbnail('type', 'title')}")

    # Case 3: Not found
    mock_exists.side_effect = lambda x: False
    print(f"Test 3 (not found): {mock_get_thumbnail('type', 'title')}")
