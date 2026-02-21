import os
from dotenv import load_dotenv
from openai import OpenAI
import json

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))
# Load the .env file from the current directory
load_dotenv(os.path.join(script_dir, ".env"))

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL"),
)

def load_config():
    config_path = os.path.join(script_dir, 'config.json')
    with open(config_path, 'r') as f:
        return json.load(f)

config = load_config()
voices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]
output_dir = os.path.join(script_dir, "webui", "src", "assets", "voices")
os.makedirs(output_dir, exist_ok=True)

sample_text = "Hello! This is a preview of my voice style for your faceless video."

for voice in voices:
    output_file = os.path.join(output_dir, f"{voice}.mp3")
    print(f"Generating sample for {voice}...")
    try:
        result = client.audio.speech.create(
            model="tts-1",
            voice=voice,
            input=sample_text,
            speed=config['tts']['speech_rate'],
            response_format="mp3"
        )
        with open(output_file, "wb") as f:
            f.write(result.content)
        print(f"Saved to {output_file}")
    except Exception as e:
        print(f"Error for {voice}: {e}")
