#!/bin/sh
# Sync files.

# Constants
BUCKET_NAME=dangomushi-counter

# Sync
aws s3 cp --recursive ./public s3://${BUCKET_NAME}/