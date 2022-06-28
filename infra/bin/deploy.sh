#!/bin/sh
# Deploy services.

# Constants
USAGE="Usage: ${0} create|update|delete HOSTED_ZONE_NAME ACM_CERTIFICATE_ARN"
STACK_NAME=roly-poly-counter
TEMPLATE_FILE=./infra/cfn/template.yml

# Parameters
if [ $# -lt 1 ] && [ $# -gt 3 ]; then
    echo "${USAGE}"
    exit 1
fi
action=${1}
hosted_zone_name=${2}
acm_certificate_arn=${3}

# CFn
if [ "${action}" = "create" ] || [ "${action}" = "update" ]; then
    aws cloudformation ${action}-stack \
        --stack-name ${STACK_NAME} \
        --template-body file://${TEMPLATE_FILE} \
        --capabilities CAPABILITY_NAMED_IAM \
        --parameters \
            ParameterKey=BucketName,ParameterValue="${STACK_NAME}" \
            ParameterKey=HostedZoneName,ParameterValue="${hosted_zone_name}" \
            ParameterKey=AcmCertificateArn,ParameterValue="${acm_certificate_arn}"
    # Sync
    aws s3 cp --recursive ./public s3://${STACK_NAME}/ --exclude ".DS_Store" --exclude "data/data.json"
elif [ "${action}" = "delete" ]; then
    aws cloudformation delete-stack --stack-name "${STACK_NAME}"
else
    echo "${USAGE}"
    exit 1
fi