workflow "New workflow" {
  on = "pull_request"
  resolves = ["GitHub Action for npm"]
}

action "Hello World" {
  uses = "./hello-action"
  args = "Hello PR"
}

action "GitHub Action for npm" {
  uses = "actions/npm@6309cd9"
  needs = ["Hello World"]
  args = "install"
}
