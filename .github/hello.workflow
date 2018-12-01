workflow "Example Workflow" {
  on = "push"
  resolves = ["Hello World"]
}

action "Hello World" {
  uses = "./hello-action"
  args = "hello Patso"
}
