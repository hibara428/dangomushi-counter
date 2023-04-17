#!/bin/sh
# Sync files.

# Constants
BUCKET_NAME=roly-poly-counter

# Sync
aws s3 cp --recursive ./dist s3://${BUCKET_NAME}/ --exclude ".DS_Store"