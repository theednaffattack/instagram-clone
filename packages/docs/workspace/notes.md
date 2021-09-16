# Notes

https://github.com/varsis/generate-lockfile
To generate lockfile per package, run the code below IN the package root (or where `package.json` is found):
`generate-lockfile --lockfile ../../yarn.lock --package package.json --write yarn.lock --force`

## Build Docker Images (from Yarn Workspace root)

### client

`docker build --no-cache --shm-size 1G -t theednaffattack/ic-client:production -f packages/client/Dockerfile .`

### server

`docker build --no-cache --shm-size 1G -t theednaffattack/ic-server:production -f packages/server/Dockerfile .`

## Push Docker Images to DockerHub

### client

`docker push theednaffattack/ic-client:production`

### server

`docker push theednaffattack/ic-server:production`

## Combined Docker build with Push to DockerHub

### client

`docker build --no-cache --shm-size 1G -t theednaffattack/ic-client:production -f packages/client/Dockerfile . && docker push theednaffattack/ic-client:production`

### server

`docker build --no-cache --shm-size 1G -t theednaffattack/ic-server:production -f packages/server/Dockerfile . && docker push theednaffattack/ic-server:production`
