#!/bin/sh
# Deploy services.

# Load .env
. ./.env

# Constants
USAGE="Usage: ${0} create|update|delete <PROFILE>"
STACK_NAME=roly-poly-counter
BUCKET_NAME=${STACK_NAME}
TEMPLATE_FILE=./infra/cfn/template.yml

# Parameters
if [ $# -lt 1 ] && [ $# -gt 2 ]; then
    echo "${USAGE}"
    exit 1
fi
action=${1}
profile_line=""
if [ $# -eq 2 ]; then
    profile_line="--profile ${2}"
fi
if [ -z "${HOSTED_ZONE_NAME}" ] || [ -z "${ACM_CERTIFICATE_ARN}" ] || [ -z "${GITHUB_ORG_NAME}" ] || [ -z "${GITHUB_REPO_NAME}" ]; then
    echo "Missing parameters. you may not setup .env."
    exit 1
fi

# CFn
if [ "${action}" = "create" ] || [ "${action}" = "update" ]; then
    aws cloudformation ${action}-stack \
        --stack-name ${STACK_NAME} \
        --template-body file://${TEMPLATE_FILE} \
        --capabilities CAPABILITY_NAMED_IAM \
        --parameters \
            ParameterKey=BucketName,ParameterValue="${BUCKET_NAME}" \
            ParameterKey=HostedZoneName,ParameterValue="${HOSTED_ZONE_NAME}" \
            ParameterKey=AcmCertificateArn,ParameterValue="${ACM_CERTIFICATE_ARN}" \
            ParameterKey=GitHubOrgName,ParameterValue="${GITHUB_ORG_NAME}" \
            ParameterKey=GitHubRepoName,ParameterValue="${GITHUB_REPO_NAME}" \
            ParameterKey=GoogleClientId,ParameterValue="${GOOGLE_CLIENT_ID}" \
            ParameterKey=GoogleClientSecret,ParameterValue="${GOOGLE_CLIENT_SECRET}" \
        ${profile_line} 
elif [ "${action}" = "delete" ]; then
    aws cloudformation delete-stack --stack-name "${STACK_NAME}" ${profile_line}
else
    echo "${USAGE}"
    exit 1
fi