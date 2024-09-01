---
title: "how I compress the background videos for my website"
tags: ["ffmpeg", "video"]
eleventyNavigation:
  key: "video-compression"
keywords: ["ffmpeg", "video", "background", "website", "compression", "bitrate", "av1", "quality"]
created: 2024-08-31
---

when I first started working on this website, the main background used to be
plain black with some info about the browser on the top, as seen in
[Aphex Twin's website](https://aphextwin.warp.net/).

{% tilImg 'background.png', 'old background of this website, version 0.7.0' %}

surpisingly, the listeners needed for the info text to be displayed were
very heavy on the browser, so I decided to drop them and add background videos
instead. the videos are a nice touch and make the website feel more alive, but
they come with a cost: **the download size**.

the first videos that I added were downloading using `yt-dlp`
(a [youtube-dl clone](https://github.com/yt-dlp/yt-dlp)) using the flag
`-f bestvideo+bestaudio` - as I had always done - to get the best quality
available. the videos were really nice, but the whole idea had a big downside:
the size of the videos was huge, the loading time was unbeareable in slow
connections and the lighthouse score plummeted.

I quickly realized that I needed to compress the videos, but I had no idea how
and how much I could compress them without losing too much quality. after some
research, I found out about the new codec `av1` and how it was *supposed* to be
the new standard for video compression. I spun up `ffmpeg` and decided to give
it a try.

let's take a look at the commands that I ended up using:

```sh
yt-dlp --list-formats '<url>' # list the available formats
yt-dlp -f <format> '<url>' # download ONLY the video
ffmpeg -i <input> -filter:v scale=-1:720 -c:v libsvtav1 -crf 40 <output> # downscale → reencode → compress
```

quick breakdown of the commands:

1. first, we list all the available formats for the video that we want to
   download. here, we want to select the best video quality **BUT** without
   the audio, as the website plays the videos on mute.
2. then, we download the video using the selected format.
3. finally, we compress the video using the `av1` codec, a constant rate
   factor of 40 (the higher the number, the lower the quality [0-63]) and
   scaling the video to a height of 720 pixels.

in some cases, `av1` will be included in the list of available formats when
downloading the video, in which case we can skip the compression step and just
download the video using the `av1` format and the desired resolution.

using `av1` isn't a silver bullet, though. the codec is still relatively new
and not all browsers support it. in those cases, the browser will fail to play
the video and the good old black background will be shown instead. something
that I can live with, as the website is still usable and the lighthouse score
is much better now.
