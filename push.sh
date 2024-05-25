#!/bin/sh
docker save dfmsite:latest | bzip2 | pv | ssh admin@web1.toffe.site sudo podman load
