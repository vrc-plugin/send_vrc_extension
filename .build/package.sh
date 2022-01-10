#!/bin/bash

# run by project root

rm -rf ./dist/*
zip -jr ./dist/send_vrc.zip ./* -x'*.git*'
