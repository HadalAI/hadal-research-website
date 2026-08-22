#!/usr/bin/env python3
import os, time, uuid, subprocess

class Worker:
    def __init__(self):
        self.id = os.environ.get("HADAL_WORKER_ID", str(uuid.uuid4()))[:8]
    def detect(self):
        try:
            r = subprocess.run(["nvidia-smi","--query-gpu=name,memory.total","--format=csv,noheader"],capture_output=True,text=True,timeout=5)
            if r.returncode == 0:
                parts = r.stdout.strip().split(", ")
                return {"gpu": parts[0], "vram": float(parts[1].replace(" MiB",""))/1024}
        except: pass
        return {"gpu": "CPU", "vram": 0.0}
    def run(self):
        info = self.detect()
        print(f"Hadal Worker {self.id} | GPU: {info['gpu']} ({info['vram']:.1f} GB)")
        while True:
            time.sleep(30)

if __name__ == "__main__":
    Worker().run()
