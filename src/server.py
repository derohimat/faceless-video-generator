import os
import imageio_ffmpeg
# Add ffmpeg to PATH
ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
os.environ["PATH"] += os.pathsep + os.path.dirname(ffmpeg_path)
# Configure ImageMagick for MoviePy
os.environ["IMAGEMAGICK_BINARY"] = r"C:\Program Files\ImageMagick-7.1.2-Q16-HDRI\magick.exe"

import json
import uuid
import threading
import traceback
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI

from utils import STORY_TYPES
from story_generator import (
    generate_story_and_title,
    generate_general_storyboard,
    generate_life_pro_tips_storyboard,
    generate_characters,
    generate_philosophy_storyboard,
    generate_fun_facts_storyboard,
)
from image_generator import generate_and_download_images
from video_creator import create_video
from utils import create_resource_dir, load_config
from api import replicate_flux_api, fal_flux_api

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))
# Construct the path to the .env file
dotenv_path = os.path.join(os.path.dirname(script_dir), ".env")
# Load the .env file
load_dotenv(dotenv_path)

config = load_config()
# Initialize the OpenAI client
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL"),
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]
IMAGE_STYLES = ["photorealistic", "cinematic", "anime", "comic-book", "pixar-art"]

jobs = {}

class GenerateRequest(BaseModel):
    story_type: str
    image_style: str
    voice_name: str

class ScriptRequest(BaseModel):
    story_type: str

class VideoFromScriptRequest(BaseModel):
    storyboard_project: dict
    image_style: str
    voice_name: str
    story_type: str

def update_job_status(job_id: str, status: str, step: str = None, error: str = None):
    jobs[job_id]["status"] = status
    if step:
        jobs[job_id]["step"] = step
    if error:
        jobs[job_id]["error"] = error

def run_generation_job(job_id: str, request: GenerateRequest):
    story_type = request.story_type
    image_style = request.image_style
    voice_name = request.voice_name

    try:
        update_job_status(job_id, "running", step="Generating story and title...")
        title, description, story = generate_story_and_title(client, story_type)
        if story is None or title is None:
             update_job_status(job_id, "error", error="Failed to generate a story and title. Please try again later.")
             return

        story_dir = create_resource_dir(script_dir, story_type, title)

        characters = []
        if story_type.lower() not in ["life pro tips", "fun facts"]:
            update_job_status(job_id, "running", step="Generating character descriptions...")
            characters = generate_characters(client, story)
            if characters is None:
                update_job_status(job_id, "error", error="Failed to generate characters. Please try again later.")
                return

        character_names = [character["name"] for character in characters] if characters else []

        update_job_status(job_id, "running", step="Generating storyboard...")
        if story_type.lower() == "life pro tips":
            storyboard_project = generate_life_pro_tips_storyboard(client, title, story)
        elif story_type.lower() == "philosophy":
            storyboard_project = generate_philosophy_storyboard(client, title, story, character_names)
        elif story_type.lower() == "fun facts":
            storyboard_project = generate_fun_facts_storyboard(client, title, story)
        else:
            storyboard_project = generate_general_storyboard(client, title, story, character_names)

        if len(storyboard_project.get("storyboards", [])) == 0:
            update_job_status(job_id, "error", error="Failed to generate storyboard. Please try again later.")
            return

        storyboard_project["storyboards"] = [
            scene for scene in storyboard_project["storyboards"] if scene["subtitles"].strip()
        ]
        storyboard_project["characters"] = characters

        with open(os.path.join(script_dir, story_dir, "story_english.txt"), "w", encoding="utf-8") as f:
            f.write(f"{title}\n\n{description}\n\n{story}")

        update_job_status(job_id, "running", step="Generating images for each scene...")
        image_files = generate_and_download_images(
            storyboard_project,
            story_dir,
            image_style,
            replicate_flux_api,
        )

        for i, storyboard in enumerate(storyboard_project['storyboards']):
            storyboard['image'] = image_files[i] if i < len(image_files) else None
            storyboard['audio'] = os.path.join(story_dir, "audio", f"scene_{storyboard['scene_number']}.mp3")

        with open(os.path.join(script_dir, story_dir, "storyboard_project.json"), "w", encoding="utf-8") as f:
            json.dump(storyboard_project, f, ensure_ascii=False, indent=4)

        if image_files:
            update_job_status(job_id, "running", step="Creating video from images...")
            audio_dir = os.path.join(story_dir, "audio")
            os.makedirs(audio_dir, exist_ok=True)
            video_path = os.path.join(story_dir, "story_video.mp4")
            create_video(client, storyboard_project, video_path, audio_dir, voice_name)
            
            jobs[job_id]["video_path"] = video_path
            jobs[job_id]["story_dir"] = story_dir
            update_job_status(job_id, "completed", step="Video created successfully!")
        else:
            update_job_status(job_id, "error", error="No images were generated. Cannot create video.")

    except Exception as e:
        error_msg = f"{str(e)}\n\nTraceback:\n{traceback.format_exc()}"
        print(f"Error in job {job_id}: {error_msg}")
        update_job_status(job_id, "error", error=error_msg)

@app.get("/api/config")
def get_config():
    return {
        "storyTypes": STORY_TYPES,
        "imageStyles": IMAGE_STYLES,
        "voices": VOICES
    }

@app.post("/api/generate")
def generate_video(request: GenerateRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    jobs[job_id] = {
        "id": job_id,
        "status": "pending",
        "step": "Initializing job...",
        "error": None,
        "video_path": None,
        "story_dir": None
    }
    background_tasks.add_task(run_generation_job, job_id, request)
    return {"job_id": job_id}

@app.post("/api/script")
def generate_script(request: ScriptRequest):
    try:
        title, description, story = generate_story_and_title(client, request.story_type)
        if story is None or title is None:
            raise HTTPException(status_code=500, detail="Failed to generate story")
        
        characters = []
        if request.story_type.lower() not in ["life pro tips", "fun facts"]:
             characters = generate_characters(client, story)
        
        character_names = [char["name"] for char in characters] if characters else []
        
        if request.story_type.lower() == "life pro tips":
            storyboard_project = generate_life_pro_tips_storyboard(client, title, story)
        elif request.story_type.lower() == "philosophy":
            storyboard_project = generate_philosophy_storyboard(client, title, story, character_names)
        elif request.story_type.lower() == "fun facts":
            storyboard_project = generate_fun_facts_storyboard(client, title, story)
        else:
            storyboard_project = generate_general_storyboard(client, title, story, character_names)
        
        storyboard_project["characters"] = characters
        storyboard_project["description"] = description
        
        return storyboard_project
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

def run_video_from_script_job(job_id: str, request: VideoFromScriptRequest):
    try:
        storyboard_project = request.storyboard_project
        image_style = request.image_style
        voice_name = request.voice_name
        story_type = request.story_type
        title = storyboard_project["project_info"]["title"]

        story_dir = create_resource_dir(script_dir, story_type, title)
        
        update_job_status(job_id, "running", step="Generating images for each scene...")
        image_files = generate_and_download_images(
            storyboard_project,
            story_dir,
            image_style,
            replicate_flux_api,
        )

        for i, storyboard in enumerate(storyboard_project['storyboards']):
            storyboard['image'] = image_files[i] if i < len(image_files) else None
            storyboard['audio'] = os.path.join(story_dir, "audio", f"scene_{storyboard['scene_number']}.mp3")

        update_job_status(job_id, "running", step="Creating video from images...")
        audio_dir = os.path.join(story_dir, "audio")
        os.makedirs(audio_dir, exist_ok=True)
        video_path = os.path.join(story_dir, "story_video.mp4")
        create_video(client, storyboard_project, video_path, audio_dir, voice_name)
        
        jobs[job_id]["video_path"] = video_path
        jobs[job_id]["story_dir"] = story_dir
        update_job_status(job_id, "completed", step="Video created successfully!")
    except Exception as e:
        error_msg = f"{str(e)}\n\nTraceback:\n{traceback.format_exc()}"
        update_job_status(job_id, "error", error=error_msg)

@app.post("/api/generate_from_script")
def generate_from_script(request: VideoFromScriptRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    jobs[job_id] = {
        "id": job_id,
        "status": "pending",
        "step": "Initializing job...",
        "error": None,
        "video_path": None,
        "story_dir": None
    }
    background_tasks.add_task(run_video_from_script_job, job_id, request)
    return {"job_id": job_id}

@app.get("/api/status/{job_id}")
def get_status(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[job_id]

@app.get("/api/video/{job_id}")
def get_video(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    video_path = jobs[job_id].get("video_path")
    if not video_path or not os.path.exists(video_path):
        raise HTTPException(status_code=404, detail="Video not ready or not found")
    return FileResponse(video_path, media_type="video/mp4")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
