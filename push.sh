#!/bin/sh
docker save dfmsite:latest | bzip2 | pv | ssh admin@dfmweb.toffe.site sudo podman load
