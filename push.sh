#!/bin/sh
docker save dfmsite:latest | bzip2 | pv | ssh admin@web1.jaroel.nl sudo podman load
