import unittest
from unittest.mock import MagicMock, patch
import sys
import os
import datetime

# Mock PIL before importing src.utils
sys.modules["PIL"] = MagicMock()
sys.modules["PIL.Image"] = MagicMock()

# Add src to sys.path if necessary
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))

from utils import (
    create_empty_storyboard,
    format_timedelta,
    create_resource_dir,
    convert_to_timestamped_subtitles
)

class TestUtils(unittest.TestCase):

    def test_create_empty_storyboard(self):
        title = "Test Story"
        storyboard = create_empty_storyboard(title)

        self.assertEqual(storyboard["project_info"]["title"], title)
        self.assertEqual(storyboard["project_info"]["user"], "AI Generated")
        self.assertIn("timestamp", storyboard["project_info"])
        self.assertEqual(storyboard["storyboards"], [])

        # Verify timestamp format (e.g., 2023-10-27 10:30:00 AM)
        timestamp = storyboard["project_info"]["timestamp"]
        try:
            datetime.datetime.strptime(timestamp, "%Y-%m-%d %I:%M:%S %p")
        except ValueError:
            self.fail(f"Timestamp '{timestamp}' is not in the expected format")

    def test_format_timedelta(self):
        # 0 seconds
        self.assertEqual(format_timedelta(0), "00:00:00,000")
        # 1.5 seconds
        self.assertEqual(format_timedelta(1.5), "00:00:01,500")
        # 3661.123 seconds (1 hour, 1 minute, 1 second, 123 ms)
        self.assertEqual(format_timedelta(3661.123), "01:01:01,123")

    @patch("os.makedirs")
    @patch("os.path.exists")
    def test_create_resource_dir(self, mock_exists, mock_makedirs):
        mock_exists.return_value = True

        script_dir = "/app/src"
        story_type = "Scary"
        title = ' "The Haunted House!" '

        # Should clean title to "The_Haunted_House"
        story_dir = create_resource_dir(script_dir, story_type, title)

        self.assertIn("data/Scary/The_Haunted_House", story_dir)
        self.assertTrue(mock_makedirs.called)

    def test_convert_to_timestamped_subtitles(self):
        sample_project = {
            "storyboards": [
                {
                    "subtitles": "Line 1\nLine 2",
                }
            ]
        }
        # 10 seconds total for 2 lines means 5 seconds per line
        subtitles = convert_to_timestamped_subtitles(sample_project, scene_duration=10)

        self.assertEqual(len(subtitles), 2)
        self.assertEqual(subtitles[0]["text"], "Line 1")
        self.assertEqual(subtitles[0]["start_time"], 0)
        self.assertEqual(subtitles[0]["end_time"], 5)

        self.assertEqual(subtitles[1]["text"], "Line 2")
        self.assertEqual(subtitles[1]["start_time"], 5)
        self.assertEqual(subtitles[1]["end_time"], 10)

if __name__ == "__main__":
    unittest.main()
