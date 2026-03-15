import requests
import replicate
import os
from typing import Optional, Dict, Any
import time
import re
from utils import load_config
import fal_client


def submit_fal_request(prompt: str, config: dict) -> Optional[str]:
    try:
        arguments = {
            "prompt": prompt,
            "image_size": config.get("image_size", "portrait_16_9"),
            "num_images": config.get("num_images", 1),
            "num_inference_steps": config.get("num_inference_steps", 4),
            "enable_safety_checker": config.get("enable_safety_checker", False),
        }
        
        if "guidance_scale" in config:
            arguments["guidance_scale"] = config["guidance_scale"]
            
        print(f"Submitting FAL AI request for model {config['model']} with arguments: {arguments}")
        handler = fal_client.submit(
            config["model"],
            arguments=arguments,
        )

        result = handler.get()
        if result and isinstance(result, dict) and "images" in result:
            images = result["images"]
            if isinstance(images, list) and images:
                return images[0].get("url")

        return None
    except Exception as e:
        print(f"Error in FAL AI API request: {e}")
        return None


def fal_flux_api(prompt: str, max_retries: int = 3) -> Optional[bytes]:
    config = load_config()
    fal_config = config["fal_flux_api"]

    for attempt in range(max_retries):
        try:
            image_url = submit_fal_request(prompt, fal_config)
            if image_url:
                print(f"FAL AI image generated: {image_url}")
                response = requests.get(image_url)
                response.raise_for_status()
                return response.content
            else:
                print("FAL AI API returned no image URL.")
                raise ValueError("No image URL returned from FAL AI API")
        except Exception as e:
            if attempt < max_retries - 1:
                print(
                    f"Error in FAL AI API request (attempt {attempt + 1}/{max_retries}): {e}"
                )
                print("Retrying...")
                time.sleep(1)  # Wait for 1 second before retrying
            else:
                print(f"Error in FAL AI API request after {max_retries} attempts: {e}")
    return None


def replicate_flux_api(prompt: str, max_retries: int = 3) -> Optional[bytes]:
    config = load_config()
    replicate_config = config["replicate_flux_api"]

    payload = {
        "prompt": prompt,
        "aspect_ratio": replicate_config["aspect_ratio"],
        "num_inference_steps": replicate_config["num_inference_steps"],
        "disable_safety_checker": replicate_config["disable_safety_checker"],
        "guidance": replicate_config["guidance"],
        "output_quality": replicate_config["output_quality"],
    }

    for attempt in range(max_retries):
        try:
            image_urls = replicate.run(
                config["replicate_flux_api"]["model"], input=payload
            )
            if image_urls and isinstance(image_urls, list) and len(image_urls) > 0:
                image_url = image_urls[0]
                response = requests.get(image_url)
                response.raise_for_status()
                return response.content
            else:
                raise ValueError("No image URL returned from Replicate API")
        except Exception as e:
            if attempt < max_retries - 1:
                print(
                    f"Error in Flux Schnell generation (attempt {attempt + 1}/{max_retries}): {e}"
                )
                error_str = str(e)
                if "status: 402" in error_str or "Insufficient credit" in error_str:
                    print("Insufficient credit. Aborting retries.")
                    break
                
                match = re.search(r"resets in ~?(\d+)s", error_str)
                if match:
                    wait_time = int(match.group(1)) + 1
                    print(f"Rate limited. Waiting for {wait_time} seconds...")
                    time.sleep(wait_time)
                else:
                    print("Retrying...")
                    time.sleep(1)
            else:
                print(
                    f"Error in Flux Schnell generation after {max_retries} attempts: {e}"
                )
    return None

