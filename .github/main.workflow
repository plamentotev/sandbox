workflow "New workflow" {
  on = "pull_request"
  resolves = ["Build"]
}

action "Build" {
  uses = "./maven-action"
  secrets = ["GITHUB_TOKEN"]
}
