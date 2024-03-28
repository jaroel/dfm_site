#!/bin/sh
./build.sh
./push.sh
ssh admin@dfmweb.toffe.site sudo systemctl restart dfmsite nginx
