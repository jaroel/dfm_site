#!/bin/sh
./build.sh
./push.sh
ssh admin@web1.toffe.site sudo systemctl restart dfmsite
