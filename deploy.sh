#!/bin/bash

echo 'Old image name?'
read oldVersion
echo 'New image name?'
read newVersion
docker build -t $newVersion .
docker stop $(docker ps -a -q --filter ancestor=$oldVersion --format="{{.ID}}")
docker run -d -p 3000:3000 --restart always --name $newVersion $newVersion

