from moviepy.editor import *
import numpy as np
from PIL import Image
import math
import numpy
import cv2


def fade(clip, duration=1, type="both"):
    if type == "in":
        return clip.fadein(duration)
    elif type == "out":
        return clip.fadeout(duration)
    elif type == "both":
        return clip.fadein(duration).fadeout(duration)
    else:
        raise ValueError("type must be 'in', 'out', or 'both'")


def shake(clip, effect_duration=1, max_offset=5):
    def shake_effect(get_frame, t):
        frame = get_frame(t)

        # Only apply the effect during the specified duration
        if t < effect_duration:
            dx = np.random.randint(-max_offset, max_offset + 1)
            dy = np.random.randint(-max_offset, max_offset + 1)

            # Convert NumPy array to PIL Image
            pil_image = Image.fromarray(frame)

            # Create a new image with a black background
            result = Image.new("RGB", pil_image.size, (0, 0, 0))

            # Paste the original image with an offset
            result.paste(pil_image, (dx, dy))

            # Convert back to NumPy array
            return np.array(result)
        else:
            return frame

    return clip.fl(shake_effect)


def zoom(clip, mode="in", position="center", speed=3):
    if hasattr(clip, "fps") and clip.fps is not None:
        fps = clip.fps
    else:
        fps = 1

    duration = clip.duration
    total_frames = max(1, int(duration * fps))  # ensure at least 1 frame

    def main(getframe, t):
        frame = getframe(t)
        h, w = frame.shape[:2]
        i = t * fps
        if mode == "out":
            i = total_frames - i
        zoom = 1 + (i * ((0.1 * speed) / total_frames))
        
        # compute the extra zoom to avoid black bars
        extra_zoom = max(w / (w - 2), h / (h - 2))
        zoom *= extra_zoom

        dw = w - (w / zoom)
        dh = h - (h / zoom)

        if position == "center":
            tx, ty = dw / 2, dh / 2
        elif position == "left":
            tx, ty = 0, dh / 2
        elif position == "right":
            tx, ty = dw, dh / 2
        elif position == "top":
            tx, ty = dw / 2, 0
        elif position == "topleft":
            tx, ty = 0, 0
        elif position == "topright":
            tx, ty = dw, 0
        elif position == "bottom":
            tx, ty = dw / 2, dh
        elif position == "bottomleft":
            tx, ty = 0, dh
        elif position == "bottomright":
            tx, ty = dw, dh
        else:
            tx, ty = dw / 2, dh / 2  # default to center
        M = np.array([[zoom, 0, -tx * zoom], [0, zoom, -ty * zoom]])
        frame = cv2.warpAffine(frame, M, (w, h))
        return frame

    return clip.fl(main)
