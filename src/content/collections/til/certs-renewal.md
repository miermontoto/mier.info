---
title: "wait, how did I use to manage certs for this service?"
tags: ["docker", "certs", "services", "nginx"]
keywords: ["certificates", "certbot", "sonarqube", "services", "docker", "nginx"]
created: 2024-08-25
---

oops, the certificates for this service are about to expire.

{% tilImg 'kuma.png', 'dashboard showing the expiration date of the certificates' %}
<br>
{% tilImg 'email.png', 'Let\'s Encrypt certification expiration notice' %}

yeah, I probably should set up alerts for that, but I'll do that later.
for now, let's just fix this quickly.
if I remember correctly, I used `certbot` to manage the certs, so it should be
a couple of commands
{% ref 'https://stackoverflow.com/questions/42591165/how-to-renew-only-one-domain-with-certbot', '1' %}
and we're done.

```sh
sudo su
certbot renew
```

{% tilImg 'success.png', 'success message from certbot' %}

alright, that was easy. now I just need to restart the nginx container and
we're good to go.

{% tilImg 'invalid.png', 'firefox warning for invalid certificates' %}

wait, the certs aren't updated yet... oh, right, I need to copy the certs to the
path mounted by the container so that it has the proper certs.

```sh
sudo su
cd /etc/letsencrypt/live/<domain>/
cp *.pem <container-certs-dir>/ # do not use mv
chown 1000:1000 <container-certs-dir>/*.pem
docker restart <container-name>
```

and that's it. the service should be up and running with the new certificates :D

{% tilImg 'fixed.png', 'certs are now fixed and the downtime is over!' %}
