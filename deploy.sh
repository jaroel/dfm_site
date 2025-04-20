#!/bin/sh
./build.sh
./push.sh
ssh admin@web1.jaroel.nl sudo systemctl restart dfmsite
