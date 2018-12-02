FROM maven:3-jdk-11

LABEL "com.github.actions.name"="GitHub Actions for Maven"
LABEL "com.github.actions.description"="Run Maven builds"
LABEL "com.github.actions.icon"="package"
LABEL "com.github.actions.color"="red"

LABEL "repository"="http://github.com/plamentotev/sandbox"
LABEL "homepage"="http://github.com/plamentotev/sandbox"
LABEL "maintainer"="Plamen Totev <plamen.iv.totev@gmail.com>"

RUN apk --no-cache add jq

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
