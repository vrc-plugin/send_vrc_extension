#!/bin/bash

# run by project root

mkdir dist
zip -jr ./dist/send_vrc.zip ./* -x'*.git*'
