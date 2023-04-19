#!/bin/sh
# Sync files.

# Constants
BUCKET_NAME=roly-poly-counter

# Sync
aws s3 sync ./dist s3://${BUCKET_NAME}/ --exclude ".DS_Store" --exclude "assets/*"
aws s3 sync ./dist/assets s3://${BUCKET_NAME}/assets/ --exclude ".DS_Store" --delete