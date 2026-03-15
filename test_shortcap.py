import sys
import os

# Add src to path
sys.path.append(os.path.join(os.getcwd(), 'src'))

try:
    import shortcap
    print("SUCCESS: shortcap imported successfully.")
    print(f"shortcap location: {shortcap.__file__}")
except ImportError as e:
    print(f"FAILURE: Could not import shortcap: {e}")
except Exception as e:
    print(f"FAILURE: An error occurred: {e}")
