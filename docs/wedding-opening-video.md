# Wedding opening video

The homepage plays a short, silent clip of the doors opening. **Open invitation** plays the clip from its first frame. It pauses at about four seconds, or earlier if the guest starts scrolling. Scroll position then controls the rest of the clip in either direction.

## Encode a replacement

Use an eight-second portrait clip from the source master. Use MP4 with H.264, 8-bit YUV 4:2:0 pixels, and no audio. The current encode is 648 × 1152 at 30 fps and about 3.85 MB. A keyframe every three frames (0.1 seconds) keeps the amount of video the browser must decode on each seek small. Fast start puts the MP4 index ahead of the media data.

From the repository root, generate and inspect a candidate before replacing the committed asset:

```bash
ffmpeg -i door-master.mp4 -t 8 -an \
  -vf "fps=30,scale=648:1152" \
  -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p \
  -g 3 -sc_threshold 0 -movflags +faststart door-candidate.mp4

ffprobe -v error -show_entries stream=codec_type,codec_name,width,height,avg_frame_rate,pix_fmt,duration \
  -of compact door-candidate.mp4
wc -c door-candidate.mp4
```

Use source footage with the same 9:16 aspect ratio to avoid stretching. Check the image quality and seek response, and aim for 2–4 MB. Replace [wedding-doors.mp4](../src/main/resources/static/video/wedding-doors.mp4) once the candidate is ready. If the artwork changes, update the [closed-door still](../src/main/resources/static/images/wedding/garden/doors.jpg) and the [open-aisle still](../src/main/resources/static/images/wedding/garden/aisle.jpg) to match. If the frame rate or clip length changes, update the frame rate and time limits in [wedding-site.js](../src/main/resources/static/js/wedding-site.js) as well.

## Wide and compact layouts

Phones and portrait tablets use the compact clip. A viewport at least 800 CSS pixels wide with an aspect ratio of 5:4 or wider selects [wedding-doors-hd.mp4](../src/main/resources/static/video/wedding-doors-hd.mp4) before playback. Keep this query aligned in `wedding-site.js` and [wedding-responsive.css](../src/main/resources/static/css/wedding-responsive.css). The wide layout places text beside the full portrait scene, so the footage is never blown up to fill a landscape screen. Portrait tablets and phones use the original edge-to-edge scene, keeping the artwork centered and avoiding side panels. The wide layout uses bandhani and gold details in the outer margins and leaves the text area clear. The opening prompt fades fully before the names enter. If the skip button has keyboard focus, move focus to the opening region and then to the invitation once it becomes interactive.

The wide file is 1080 × 1920 at 30 fps and 9.75 MB. Use the same master and timing, with `-vf "fps=30,setsar=1"`, `-crf 25`, and `-g 4` for the wide encode. Verify both clips start and end at the same point, and check the laptop, landscape tablet, portrait tablet, and narrow phone layouts. The 2–4 MB budget applies to the compact clip.

## Keep iPhone startup and scrolling working

- Keep `muted` and `playsinline` on the [video element](../src/main/resources/templates/wedding/home.html). Call `video.play()` directly from the invitation tap, before any timer or awaited work. A previous build sought into a paused clip as its first action. The physical iPhone trace logged `seeking` without `seeked`, leaving subsequent scroll seeks blocked.
- Keep the still behind the video while media starts or if it fails. Reveal the video as soon as playback is ready. Let it play naturally before handing off to scrolling, and use the current video time as the start of the scroll-controlled portion. Keep the skip and reduced motion paths usable with the stills.
- Process scroll updates once per animation frame. Seek to actual video frame times and keep only the latest scroll position while a seek is in flight. When the seek finishes, use that latest position.

## Verify before release

1. Run `./mvnw test` and open the wedding preview with `?intro=1` in a fresh tab.
2. On a physical iPhone in Safari, tap **Open invitation** and wait. Check that the clip plays from the beginning and pauses near halfway. Reload and swipe immediately after tapping. Check that fast scrolling and reversing update the doors, and that **Skip opening** still lands on the invitation. Repeat on cellular and in the affected in-app browser if applicable. Desktop device emulation checks layout only.
3. Check a byte-range response from the preview server. It should return `206 Partial Content`, `Content-Range`, and `Content-Type: video/mp4`:

   ```bash
   curl -fsS -r 1000000-1001023 -D - -o /dev/null \
     https://test-wedding.poojanthumar.in/video/wedding-doors.mp4
   ```

4. If the doors remain still, try playing and seeking in the MP4 URL directly on the same phone. Then attach [Safari Web Inspector](https://developer.apple.com/documentation/safari-developer-tools/inspecting-ios) to the invitation tab from a Mac and record the **Media & Animations** timeline from before the tap. Look for `playing`, `pause`, `seeking`, and `seeked`. Check the Network tab for failed range requests. A direct MP4 that scrubs correctly narrows the problem to the invitation's media startup, seek handling, or rendering.
