import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))
from src.server import run_generation_job, GenerateRequest, jobs

req = GenerateRequest(story_type="Fun Facts", image_style="anime", voice_name="alloy")
jobs["test-job"] = {"status": "pending"}

print("Starting generation...")
run_generation_job("test-job", req)

print("\n=== FINAL JOB STATUS ===")
print(jobs["test-job"])
if "error" in jobs["test-job"] and jobs["test-job"]["error"]:
    print("\nEXPECTED ERROR CAUGHT:")
    print(jobs["test-job"]["error"])
