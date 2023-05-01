#!/bin/sh
# Sync files.

# Constants
USAGE="Usage: $(basename ${0}) BUCKET_NAME <AWS_PROFILE>"

# Parameters
if [ $# -lt 1 ] || [ $# -gt 2 ]; then
  echo "${USAGE}"
  exit 1
fi
profile=""
if [ $# -ge 2 ]; then
    profile="--profile ${2}"
fi
bucket_name=${1}

# Sync
aws s3 sync ${profile} ./dist "s3://${bucket_name}/" --exclude ".DS_Store" --exclude "assets/*"
aws s3 sync ${profile} ./dist/assets "s3://${bucket_name}/assets/" --exclude ".DS_Store" --delete