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

from: https://stackoverflow.com/a/50059206/9448010
docker-compose up -d --force-recreate --renew-anon-volumes

from: https://stackoverflow.com/a/34300129/9448010
docker build -t <some tag> -f <dir/dir/Dockerfile> .

from: https://www.digitalocean.com/community/tutorials/how-to-remove-docker-images-containers-and-volumes

List Dangling Images???
docker images -a

docker images -f dangling=true

docker images -a | grep "pattern"

docker images -a | grep "pattern" | awk '{print $3}' | xargs docker rmi
docker images -a | grep "ic" | awk '{print $3}' | xargs docker rmi
