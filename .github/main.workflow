workflow "New workflow" {
  on = "pull_request"
  resolves = ["GitHub Action for npm"]
}

action "GitHub Action for npm" {
  uses = "actions/npm@6309cd9"
  args = "install"
}
