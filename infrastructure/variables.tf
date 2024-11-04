// Build variables
variable "workspace_iam_role" {}
variable "environment" {}
variable "branch" {}
variable "domain_name" {}
variable "github_token" {}
variable "gsap_npm_token" {}
variable "enable_performance_mode" {
  default = false
}
