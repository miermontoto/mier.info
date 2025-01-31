---
title: "how I update my sonarqube instance with very little space left"
tags: ["sonarqube", "docker", "update"]
keywords: ["sonarqube", "docker", "update", "space", "disk", "disk space", "disk usage", "disk usage sonarqube"]
created: 2025-01-30
---

the sonarqube instance that I maintain for my company is a t4g.medium EC2
instance with very little space assigned to it (8GB). I have already mounted
a separate EBS volume that allows me to store all the important data, but the
instance itself has very little space left, not enough to even run a simple
update.

technically, the process should be straightforward:

1. stop the sonarqube instance
2. pull the latest version of the sonarqube image
3. run the sonarqube instance

BUT I usually run into some messages like this:

```
write /var/lib/docker/tmp/GetImageBlob339603890: no space left on device
# ... or ...
failed to register layer: write /opt/sonarqube/lib/extensions/sonar-iac-plugin-1.40.0.13983.jar: no space left on device
```

this has happened every single time that I get a prompt asking me to update the
version of the sonarqube instance, which happens every 3 months or so. my
mental process is usually something like this:

1. okay, let's quickly prune docker caches/images/layers/etc.
2. that wasn't enough, let's see what's taking up space (I use `ncdu` for this)
3. let's delete some old logs, maybe that'll free up some space
4. ???
5. profit?

this time, I decided to actually document the process, so I can do it again in
the future.

### you have to stop the instances!!!
yes! and there should be nothing wrong with that, I'm already saving all the
data in volumes, right? well yes, but I'm always afraid of losing information,
so I recheck that the `docker-compose.yml` file is correctly configured to use
the volumes.

after checking, I stop the instances and prune all caches and images:

```sh
docker compose down
yes | docker system prune -a; yes | docker builder prune -a
```

{% tilImg 'clear-docker.png', 'result of the docker system prune command' %}

this is much of the space that I'm looking for, but I'm not done yet.

### delete journal logs

the next step is to *vacuum* the journal logs, as they take up more than 500MB
of space (in my case).

{% tilImg 'journal-size.png', 'journal dir size in ncdu' %}

to delete the journal logs, I use the following command:

```sh
journalctl --vacuum-size=10M
```

### delete unused kernel versions

the last step is to delete the unused kernel versions. in AL2023, the system
usually keeps the last 3 kernel versions, so we can delete the unused ones
using the following command:

```sh
sudo dnf remove --oldinstallonly
```

this will remove the unused kernel versions as well as other packages that are
no longer "active" (usually only kernel packages).

## summary

this is the summary of the process:

1. stop the sonarqube instance
2. prune docker caches/images/layers/etc.
3. delete journal logs
4. delete unused kernel versions
5. start the sonarqube instance

single command:

```sh
docker compose down; yes | docker system prune -a; yes | docker builder prune -a; journalctl --vacuum-size=10M; sudo dnf remove --oldinstallonly; docker compose up -d
```
