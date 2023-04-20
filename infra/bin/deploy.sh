#!/bin/sh
# Deploy services.

# Constants
USAGE="Usage: ${0} create|update|delete HOSTED_ZONE_NAME ACM_CERTIFICATE_ARN <PROFILE>"
STACK_NAME=roly-poly-counter
BUCKET_NAME=${STACK_NAME}
GITHUB_ORG_NAME=hibara428
GITHUB_REPO_NAME=${STACK_NAME}
TEMPLATE_FILE=./infra/cfn/template.yml

# Parameters
if [ $# -lt 1 ] && [ $# -gt 3 ]; then
    echo "${USAGE}"
    exit 1
fi
action=${1}
hosted_zone_name=${2}
acm_certificate_arn=${3}
profile_line=""
if [ $# -eq 4 ]; then
    profile_line="--profile ${4}"
fi

# CFn
if [ "${action}" = "create" ] || [ "${action}" = "update" ]; then
    aws cloudformation ${action}-stack ${profile_line} \
        --stack-name ${STACK_NAME} \
        --template-body file://${TEMPLATE_FILE} \
        --capabilities CAPABILITY_NAMED_IAM \
        --parameters \
            ParameterKey=BucketName,ParameterValue="${BUCKET_NAME}" \
            ParameterKey=HostedZoneName,ParameterValue="${hosted_zone_name}" \
            ParameterKey=AcmCertificateArn,ParameterValue="${acm_certificate_arn}" \
            ParameterKey=GitHubOrgName,ParameterValue="${GITHUB_ORG_NAME}" \
            ParameterKey=GitHubRepoName,ParameterValue="${GITHUB_REPO_NAME}"
elif [ "${action}" = "delete" ]; then
    aws cloudformation delete-stack ${profile_line} --stack-name "${STACK_NAME}"
else
    echo "${USAGE}"
    exit 1
fi