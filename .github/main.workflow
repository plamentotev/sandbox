workflow "New workflow" {
  on = "pull_request"
  resolves = ["Build"]
}

action "Build" {
  uses = "./report-action"
  secrets = ["GITHUB_TOKEN"]
}
