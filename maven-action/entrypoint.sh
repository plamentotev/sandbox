#!/bin/sh

set -e

sh -c "mvn $*"

cat /github/workflow/event.json
COMMENTS_URL=$(cat /github/workflow/event.json | jq -r .pull_request.comments_url)
curl --request POST --header "Authorization: token $GITHUB_TOKEN" --header "Content-Type: application/json" --data "{ \"body\": \"Build result: success\"  }" "${COMMENTS_URL}"
