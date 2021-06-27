#! /bin/bash
# yarn build:server
echo $PWD
docker build --shm-size 1G -t <docker_hub_account_name>/<docker_project_name>:<docker_tag> -f packages/client/Dockerfile .
docker push <docker_hub_account_name>/<docker_project_name>:<docker_tag>
ssh root@<THE_IP_ADDRESS> "docker pull <docker_hub_account_name>/<docker_project_name>:<docker_tag> && docker tag <docker_hub_account_name>/<docker_project_name>:<docker_tag> dokku/<dokku_app_name>:<dokku_tag> && dokku tags <dokku_app_name> && dokku tags:deploy <dokku_app_name> <dokku_tag>"
