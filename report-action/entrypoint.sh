#!/bin/sh

set -e

COMPLETED_AT=$(date --iso-8601=seconds -u)
sed -i "s/HEAD_SHA/${GITHUB_SHA}/" data.json
sed -i "s/COMPLETED_AT/${COMPLETED_AT}/" data.json

CHECKS_URL="https://api.github.com/repos/${GITHUB_REPOSITORY}/check-runs"
curl --request POST \
     --header "Authorization: token ${GITHUB_TOKEN}" --header "Content-Type: application/json" --header "Accept: application/vnd.github.antiope-preview+json" \
     --data "@data.json" "${CHECKS_URL}"
