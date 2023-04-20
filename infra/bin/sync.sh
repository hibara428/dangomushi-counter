#!/bin/sh
# Sync files.

# Constants
BUCKET_NAME=roly-poly-counter

# Parameters
profile_line=""
if [ $# -ge 1 ]; then
    profile_line="--profile ${1}"
fi

# Sync
aws s3 sync ${profile_line} ./dist s3://${BUCKET_NAME}/ --exclude ".DS_Store" --exclude "assets/*"
aws s3 sync ${profile_line} ./dist/assets s3://${BUCKET_NAME}/assets/ --exclude ".DS_Store" --delete