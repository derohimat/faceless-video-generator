from moviepy.editor import (
    ImageClip,
    TextClip,
    CompositeVideoClip,
    concatenate_videoclips,
    AudioFileClip
)
from audio_generator import generate_audio
from transitions import zoom
import os
from utils import create_resource_dir, load_config, create_blank_image

script_dir = os.path.dirname(os.path.abspath(__file__))
font_path = os.path.join(os.path.dirname(script_dir), "font")

def add_subtitles(output_file, output_file_subtitle):
    shortcap.add_captions(
        video_file=output_file,
        output_file=output_file_subtitle,

        font=os.path.join(font_path, "TitanOne.ttf"),
        font_size=70,
        font_color="white",
        stroke_width=3,
        stroke_color="black",
        shadow_strength=1.0,
        shadow_blur=0.1,
        highlight_current_word=True,
        word_highlight_color="yellow",
        line_count=1,
        padding=70,
        position="center",
        use_local_whisper=False,
    )


def create_video(client, storyboard_project, output_file, audio_dir, voice_name):
    clips = []
    for scene in storyboard_project['storyboards']:
        # Generate audio for the subtitle
        audio_file = scene['audio']
        generate_audio(client, scene['subtitles'], audio_file, voice_name)
        
        # Create audio clip
        audio_clip = AudioFileClip(audio_file)
        
        # Create image clip with duration matching the audio
        img_path = scene.get('image')
        if not img_path or not os.path.exists(img_path):
            print(f"Warning: Image missing for scene {scene['scene_number']}. Creating blank image.")
            # Use original story_dir for fallback image if needed
            temp_img = os.path.join(os.path.dirname(audio_dir), f"blank_scene_{scene['scene_number']}.png")
            create_blank_image(temp_img)
            img_path = temp_img
            
        image_clip = ImageClip(img_path).set_duration(audio_clip.duration)
        
        # Combine image and audio
        video_clip = image_clip.set_audio(audio_clip)
        
        # Apply transition effect
        transition_type = scene.get('transition_type', 'none')
            
        if transition_type == 'zoom-in':
            clips.append(zoom(video_clip))
        elif transition_type == 'zoom-out':
            clips.append(zoom(video_clip, mode='out'))
        else:
            clips.append(video_clip)

    final_clip = concatenate_videoclips(clips)
    final_clip.write_videofile(output_file, fps=24)

    add_subtitles(output_file, output_file.replace('.mp4', '_subtitle.mp4'))
