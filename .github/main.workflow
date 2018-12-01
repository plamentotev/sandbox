workflow "New workflow" {
  on = "pull_request"
  resolves = ["Build"]
}

action "Build" {
  uses = "./maven-action"
  args = "-B clean verify"
}
