#!/bin/bash

# Clean all exited containers
docker ps -qaf status=exited | xargs docker rm

# Remove all unused images
docker images -f dangling=true -q | xargs docker rmi