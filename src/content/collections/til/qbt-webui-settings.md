---
title: "qbittorrent-nox webui doesn't save settings"
tags: ["services", "linux", "home-server", "torrent"]
keywords:
  ["services", "linux", "server", "qbittorrent", "qbittorrent-nox", "root"]
created: 2025-08-26
---

recently I've moved all my hosted projects and services to a new powerful
Hetzner server and I'm in the process of setting everything up again. in the
process, I've encountered some issues with certain services, which don't seem to
like that I'm using root for everything (sorry!)

one of those services is `qbittorrent-nox`, which is a headless version of the
popular torrent client `qbittorrent`. it has a webui, which is great for remote
access, but for some reason, it just refused to save any settings no matter what,
meaning that I wasn't able to set up any torrents, change paths or even setup
proper authentication to protect the webui.

no google searches helped, meaning that this was probably something either very
obvious to everybody else, or something very specific to my setup. after coming
empty-handed from journalctl, the webui logs and the config files, I decided to
try something else: executing the service specifying root as the user:

```sh
systemctl disable --now qbittorrent-nox
systemctl enable --now qbittorrent-nox@root
```

and that did the trick! now the webui is working as expected and I can finally
set up my torrents again :D
