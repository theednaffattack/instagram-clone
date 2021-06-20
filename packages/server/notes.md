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

## Package warnings

warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/core@0.8.0" has unmet peer dependency "@emotion/core@10.x".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/core@0.8.0" has unmet peer dependency "@emotion/styled@10.x".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/core@0.8.0" has unmet peer dependency "emotion-theming@10.x".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/icons@1.0.13" has unmet peer dependency "@chakra-ui/system@>=1.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/theme@1.9.1" has unmet peer dependency "@chakra-ui/system@>=1.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > next-seo@4.24.0" has incorrect peer dependency "next@^8.1.1-canary.54 || ^9.0.0 || ^10.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli@1.21.5" has unmet peer dependency "graphql@^0.8.0 || ^0.9.0 || ^0.10.0 || ^0.11.0 || ^0.12.0 || ^0.13.0 || ^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/typescript@1.22.2" has unmet peer dependency "graphql@^0.12.0 || ^0.13.0 || ^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/typescript-operations@1.18.1" has unmet peer dependency "graphql@^0.8.0 || ^0.9.0 || ^0.10.0 || ^0.11.0 || ^0.12.0 || ^0.13.0 || ^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/typescript-react-apollo@2.2.6" has unmet peer dependency "graphql@^0.8.0 || ^0.9.0 || ^0.10.0 || ^0.11.0 || ^0.12.0 || ^0.13.0 || ^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/typescript-react-apollo@2.2.6" has unmet peer dependency "graphql-tag@^2.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/server > class-validator@0.12.0" has unmet peer dependency "tslib@>=1.9.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/server > zapatos@4.0.1" has unmet peer dependency "@types/pg@>=7.14.3".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/core > @reach/auto-id@0.10.2" has incorrect peer dependency "react@^16.8.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/core > @reach/auto-id@0.10.2" has incorrect peer dependency "react-dom@^16.8.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/core > toasted-notes@3.2.0" has incorrect peer dependency "react@^16.8.4".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/core > toasted-notes@3.2.0" has incorrect peer dependency "react-dom@^16.8.4".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/core > use-dark-mode@2.3.1" has incorrect peer dependency "react@^16.8.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/icons > @chakra-ui/icon@1.1.9" has unmet peer dependency "@chakra-ui/system@>=1.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/theme > @chakra-ui/theme-tools@1.1.7" has unmet peer dependency "@chakra-ui/system@>=1.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @zeit/next-css > css-loader@1.0.0" has unmet peer dependency "webpack@^4.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @zeit/next-css > mini-css-extract-plugin@0.4.3" has unmet peer dependency "webpack@^4.4.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-codegen/core@1.17.10" has unmet peer dependency "graphql@^0.8.0 || ^0.9.0 || ^0.10.0 || ^0.11.0 || ^0.12.0 || ^0.13.0 || ^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-codegen/plugin-helpers@1.18.7" has unmet peer dependency "graphql@^0.8.0 || ^0.9.0 || ^0.10.0 || ^0.11.0 || ^0.12.0 || ^0.13.0 || ^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/apollo-engine-loader@6.2.5" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/code-file-loader@6.3.1" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/git-loader@6.2.6" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/github-loader@6.2.5" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/graphql-file-loader@6.2.7" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/json-file-loader@6.2.6" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/load@6.2.8" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/prisma-loader@6.3.0" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/url-loader@6.10.1" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/utils@7.10.0" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > graphql-config@3.3.0" has unmet peer dependency "graphql@^0.11.0 || ^0.12.0 || ^0.13.0 || ^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/typescript > @graphql-codegen/visitor-plugin-common@1.21.1" has unmet peer dependency "graphql@^0.8.0 || ^0.9.0 || ^0.10.0 || ^0.11.0 || ^0.12.0 || ^0.13.0 || ^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @linaria/webpack-loader > @linaria/webpack5-loader@3.0.0-beta.6" has unmet peer dependency "webpack@>=5".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/core > @reach/auto-id > @reach/utils@0.10.5" has incorrect peer dependency "react@^16.8.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/core > @reach/auto-id > @reach/utils@0.10.5" has incorrect peer dependency "react-dom@^16.8.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/core > toasted-notes > @reach/alert@0.1.5" has incorrect peer dependency "react@^16.8.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/core > toasted-notes > @reach/alert@0.1.5" has incorrect peer dependency "react-dom@^16.8.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/core > use-dark-mode > @use-it/event-listener@0.1.6" has incorrect peer dependency "react@^16.8.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-codegen/core > @graphql-tools/merge@6.2.14" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/code-file-loader > @graphql-tools/graphql-tag-pluck@6.5.1" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/graphql-file-loader > @graphql-tools/import@6.3.1" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/prisma-loader > graphql-request@3.4.0" has unmet peer dependency "graphql@14.x || 15.x".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/url-loader > @graphql-tools/delegate@7.1.5" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/url-loader > @graphql-tools/wrap@7.0.8" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/url-loader > graphql-ws@4.9.0" has unmet peer dependency "graphql@>=0.11 <=15".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/url-loader > subscriptions-transport-ws@0.9.19" has unmet peer dependency "graphql@>=0.10.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/typescript > @graphql-codegen/visitor-plugin-common > @graphql-tools/optimize@1.0.1" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/typescript > @graphql-codegen/visitor-plugin-common > @graphql-tools/relay-operation-optimizer@6.3.0" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/typescript > @graphql-codegen/visitor-plugin-common > graphql-tag@2.12.4" has unmet peer dependency "graphql@^0.9.0 || ^0.10.0 || ^0.11.0 || ^0.12.0 || ^0.13.0 || ^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/core > toasted-notes > @reach/alert > @reach/component-component@0.1.3" has unmet peer dependency "prop-types@^15.6.2".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/core > toasted-notes > @reach/alert > @reach/component-component@0.1.3" has incorrect peer dependency "react@^16.4.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/core > toasted-notes > @reach/alert > @reach/component-component@0.1.3" has incorrect peer dependency "react-dom@^16.4.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/core > toasted-notes > @reach/alert > @reach/visually-hidden@0.1.4" has incorrect peer dependency "react@^16.8.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/core > toasted-notes > @reach/alert > @reach/visually-hidden@0.1.4" has incorrect peer dependency "react-dom@^16.8.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-codegen/core > @graphql-tools/merge > @graphql-tools/schema@7.1.5" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/url-loader > @graphql-tools/delegate > @graphql-tools/batch-execute@7.1.2" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/typescript > @graphql-codegen/visitor-plugin-common > @graphql-tools/relay-operation-optimizer > relay-compiler@10.1.0" has unmet peer dependency "graphql@^15.0.0".
