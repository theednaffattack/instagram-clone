# Notes

[Typescript in a monorepo](https://valcker.medium.com/configuring-typescript-monorepo-with-eslint-prettier-and-webstorm-61a71f218104)

[Helpful TypeScript Notes](https://basarat.gitbook.io/typescript/)

## TypeScript Notes

Copying json files into build directory "/dist"
[Methods for handling json files in TS](https://stackoverflow.com/a/59419449/9448010)

## Docker Notes

docker-compose -f docker-compose.db-local.yml up

docker-compose -f docker-compose.redis-local.yml up

docker-compose -f docker-compose.dev.yml up

docker-compose -f docker-compose.dev.yml down

docker build --shm-size 1G -t theednaffattack/ic-server:production . && docker push theednaffattack/ic-server:production

from: https://stackoverflow.com/a/49615292/9448010
docker-compose up --build <your-service>.
docker-compose up -d --build <serviceX> <serviceY>

### Force recreate

from: https://stackoverflow.com/a/50059206/9448010
docker-compose up -d --force-recreate --renew-anon-volumes

### Build from a different directory

from: https://stackoverflow.com/a/34300129/9448010
`docker build -t <some tag> -f <dir/dir/Dockerfile> .`

from: https://www.digitalocean.com/community/tutorials/how-to-remove-docker-images-containers-and-volumes

### List Dangling Images???

docker images -a

docker images -f dangling=true

### Find according to a pattern

`docker images -a | grep "pattern"`

### Find and remove according to a pattern

`docker images -a | grep "pattern" | awk '{print $3}' | xargs docker rmi docker images -a | grep "ic" | awk '{print $3}' | xargs docker rmi`

## Dokku

### Deployment Strategy

Used for this project:
[Docker Image Tag Deployment](https://dokku.com/docs/deployment/methods/images/#docker-image-tag-deployment)

### Persistent Storage

[Link to Dokku Docs](https://dokku.com/docs/advanced-usage/persistent-storage/#persistent-storage)

### Environment Variables

[Setting Up Env Vars](https://dokku.com/docs/configuration/environment-variables/#environment-variables)

### Disabling VHosts

https://dokku.com/docs/configuration/domains/#disabling-vhosts

`dokku domains:disable <the_app_name>`

### Display ports used

dokku proxy:report

### List Dokku tags

`dokku tags <the_app_name>`

### Add Dokku certs & enable ports 80 and 443 forwarding

A script exists at `/root/dokku-certs/eddienaff-dot-dev/` which controls
certificate installation. A line must be added for each new domain.

First, edit the install script
`nano /root/dokku-certs/eddienaff-dot-dev/install`

Then run it using:
`/root/dokku-certs/eddienaff-dot-dev/install`

After this is added you must add a new prox.conf file to
`/home/dokku/<app_name>/nginx.proxy.d/`

Then add port forwarding for port 80 to our app port
`dokku proxy:ports-set <DOKKU_APP_NAME> http:80:<DOKKU_APP_PORT>`

Then add port forwarding for port 443 to our app port
`dokku proxy:ports-set <DOKKU_APP_NAME> https:443:<DOKKU_APP_PORT>`

And then remove the default port mapping
`dokku proxy:ports-remove <DOKKU_APP_NAME> http:<DOKKU_APP_PORT>:<DOKKU_APP_PORT>`

Finally
`dokku proxy:build-config <DOKKU_APP_NAME>`

```bash
# Adapted from: https://stackoverflow.com/a/61775633/9448010
# Additional helpful info from: https://stackoverflow.com/a/37729912/9448010
# NGINX Restart: https://stackoverflow.com/a/57428645/9448010

# Got it working by setting a reverse proxy on the client
# app's nginx config file, pointing to the server app:
#
# - Disable VHOST support on server (or api) app, since it won't
#   be reachable outside or by a domain name. This will create a
#   local listening container on a high numbered port.
#
# - Add a proxy.conf file to /home/dokku/client/nginx.conf.d/
#
# - Set up a reverse proxy on a 'location /app/' block inside that
#   file. Set the upstream to the server app's IP and PORT (from the
#   first item).
#
# These are the basic steps. Had to tweak forwarded headers a bit to
# get SSL working fine, but it works fine!


## Beg - Pass http://ic.eddienaff.dev/api to http://127.0.0.1:8080/api

location /api {
  proxy_pass_header Set-Cookie;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header Host $http_host;
  proxy_pass http://127.0.0.1:8080/api;
  # proxy_pass http://172.18.0.6:8080/api;
}


## End - Pass http://ic.eddienaff.dev/api to http://127.0.0.1:8080/api



## Beg - Add webscockets settings

location /subscriptions {
  proxy_pass_header Set-Cookie;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header Host $http_host;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_http_version 1.1;
  proxy_pass http://127.0.0.1:8080/subscriptions;
  # proxy_pass http://172.18.0.6:8080/subscriptions;
}
## End - Add webscockets settings

```

### Cookie problems

https://serverfault.com/a/797137

### Restart Nginx

`systemctl daemon-reload && systemctl restart nginx`

### Restart Dokku

dokku ps:restart <app>

### List Dokku apps

dokku apps

### Fix Dokku port issues

(where APP is your app name)

`dokku config:set APP DOKKU_PROXY_PORT=8080 DOKKU_PROXY_SSL_PORT=8443`

### Environment Variables

`dokku config:set <app_name> <KEY1>=<VALUE1> <KEY2>=<VALUE2>`

Example:
`dokku config:set some-app ENV=test PORT=9090`

See this[ Dokku Issue](https://github.com/dokku/dokku/issues/1262#issuecomment-529894982)
`/home/dokku/YOUR_APP/ENV`

```
...
PRIVATE_KEY="-----BEGIN PRIVATE KEY-----PRIVATE KEY HERE-----END PRIVATE KEY-----\n"
...
```

## AWS

### Signed Cookies

[AWS CloudFront Signed Cookies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-setting-signed-cookie-custom-policy.html)

### Configuring "Resource" for Signed Cookies

https://stackoverflow.com/a/55536083/9448010

### Test User Permissions for S3 Uploads

#### Test Put Object

`aws s3api put-object --bucket awsexamplebucket1 --key HappyFace.jpg --body HappyFace.jpg --profile UserDaveAccountA`

#### List Items in Bucket

`aws s3 ls s3://<bucket_name> --profile <profile_name_in_config>`

## JWT

### Good notes on revoking tokens: [here](https://youtu.be/25GS0MLT8JU?t=4594)
