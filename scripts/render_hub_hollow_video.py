"""Build a matching corrected Hub video without modifying source art or source video."""
import json,subprocess
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter
ROOT=Path(__file__).resolve().parents[1]
STILL=ROOT/'assets/portal-hub-hollow-final.jpg'
SOURCE=ROOT/'assets/portal-hub-final-fairy.mp4'
DEST=ROOT/'assets/portal-hub-hollow-fairy.mp4'
PREVIEW=ROOT/'assets/portal-hub-hollow-video-frame.jpg'
def cmd(a):
    return subprocess.run([str(x) for x in a],check=True,capture_output=True,text=True)
def main():
    if not STILL.is_file() or not SOURCE.is_file():
        raise SystemExit('Founder-approved source media or edited still missing')
    probe=json.loads(cmd(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height,codec_name','-of','json',SOURCE]).stdout)
    v=probe['streams'][0];w,h=int(v['width']),int(v['height'])
    if w<400 or h<600 or abs(w/h-2/3)>.04:
        raise SystemExit('Refusing mismatched source video geometry: '+str((w,h)))
    artwork=Image.open(STILL).convert('RGBA')
    if artwork.size!=(1024,1536):
        raise SystemExit('Refusing changed source still geometry: '+str(artwork.size))
    mask=Image.new('L',artwork.size,0)
    ImageDraw.Draw(mask).rectangle((729,441,912,511),fill=255)
    artwork.putalpha(mask.filter(ImageFilter.GaussianBlur(3)))
    overlay=ROOT/'assets/.hub-hollow-text-overlay.png'
    artwork.resize((w,h),Image.Resampling.LANCZOS).save(overlay)
    try:
        cmd(['ffmpeg','-hide_banner','-loglevel','error','-y',
            '-i',SOURCE,'-loop','1','-i',overlay,
            '-filter_complex','[0:v][1:v]overlay=x=0:y=0:format=auto:shortest=1[v]',
            '-map','[v]','-map','0:a?','-c:v','libx264','-preset','medium','-crf','18',
            '-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart','-shortest',DEST])
        if not DEST.exists() or DEST.stat().st_size<1000:
            raise SystemExit('No rendered output')
        cmd(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss','0.5','-i',DEST,'-frames:v','1','-q:v','2',PREVIEW])
        print(json.dumps({'source_size':[w,h],'source_codec':v.get('codec_name'),'video_bytes':DEST.stat().st_size},indent=2))
    finally:
        overlay.unlink(missing_ok=True)
if __name__=='__main__': main()
