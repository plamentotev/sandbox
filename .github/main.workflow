workflow "New workflow" {
  resolves = ["Hello World"]
  on = "pull_request"
}

action "Hello World" {
  uses = "./hello-action"
}
