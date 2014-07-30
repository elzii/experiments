#!/bin/bash

# scp -rp ./ root@104.131.135.165:/var/www/

rsync -ru ./* root@d104.131.135.165:/var/www/