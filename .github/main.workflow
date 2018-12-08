workflow "New workflow" {
  on = "push"
  resolves = ["Build"]
}

action "Build" {
  uses = "./report-action"
  secrets = ["GITHUB_TOKEN"]
}
