#!/usr/bin/env python3
"""Decode and check the exact Gemini Hub media served by the candidate page."""
import json
import subprocess
from pathlib import Path

VIDEO=Path("assets/portal-hub-gemini-softloop.mp4")
POSTER=Path("assets/portal-hub-gemini-poster.jpg")
def run(*args):
    return subprocess.run(args,check=True,capture_output=True).stdout
def probe(path):
    return json.loads(run("ffprobe","-v","error","-show_entries",
        "stream=codec_type,codec_name,width,height,r_frame_rate,pix_fmt:format=duration,size",
        "-of","json",str(path)))
def decoded_frame(n):
    out=run("ffmpeg","-hide_banner","-loglevel","error","-i",str(VIDEO),
        "-vf",f"select=eq(n\\,{n}),scale=256:455",
        "-frames:v","1","-vsync","0","-f","rawvideo","-pix_fmt","rgb24","-")
    assert len(out)==256*455*3, f"Missing decoded frame {n}: {len(out)} bytes"
    return out
def mae(a,b):
    return sum(abs(x-y) for x,y in zip(a,b))/len(a)
def verify():
    assert VIDEO.exists() and POSTER.exists(), "Missing candidate video/poster"
    vp=probe(VIDEO);pp=probe(POSTER)
    vstreams=[s for s in vp["streams"] if s["codec_type"]=="video"]
    assert len(vstreams)==1, "Expected exactly one video stream"
    v=vstreams[0]
    assert (v["width"],v["height"])==(512,910), f"Incorrect video geometry {v}"
    assert v["codec_name"]=="h264", "Expected browser-compatible H.264 video"
    assert v["pix_fmt"]=="yuv420p", "Expected broad browser-compatible pixel format"
    assert v["r_frame_rate"]=="30/1", "Expected 30fps media"
    assert not any(s["codec_type"]=="audio" for s in vp["streams"]), "Must remain silent"
    duration=float(vp["format"]["duration"])
    assert 9.90<=duration<=10.10, f"Video duration unexpected: {duration}"
    assert int(vp["format"]["size"])<=5_000_000, "Oversized homepage animation"
    p=[s for s in pp["streams"] if s["codec_type"]=="video"][0]
    assert (p["width"],p["height"])==(512,910), "Poster mismatch"
    first,last,penultimate,middle=map(decoded_frame,(0,299,298,150))
    seam=mae(first,last);adjacent=mae(penultimate,last);motion=mae(first,middle)
    print(json.dumps({"video":str(VIDEO),"poster":str(POSTER),
        "codec":v["codec_name"],"pixel_format":v["pix_fmt"],"frames_per_second":30,
        "dimensions":[v["width"],v["height"]],"seconds":duration,
        "video_bytes":int(vp["format"]["size"]),
        "loop_frame_299_to_0_MAE":round(seam,3),
        "penultimate_to_last_MAE":round(adjacent,3),
        "frame_0_to_150_MAE":round(motion,3)},indent=2))
    assert seam<3.6, f"Visible first-to-last loop mismatch {seam:.2f}"
    assert adjacent<4.5, f"Unstable final transition {adjacent:.2f}"
    assert motion>0.4, f"Animation appears static {motion:.2f}"
if __name__=="__main__":
    verify()
