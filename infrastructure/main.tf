terraform {
  required_version = ">= 1.9"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.58"
    }
  }

  backend "s3" {
    bucket               = "terraform.infra.eu-west-1.argent47.net"
    workspace_key_prefix = "workspace-demo-dapp-starknet"
    key                  = "tfstate.json"
    dynamodb_table       = "argent-infra-terraform"
    region               = "eu-west-1"
  }
}

data "terraform_remote_state" "main" {
  backend = "s3"

  workspace = terraform.workspace

  config = {
    bucket               = "terraform.infra.eu-west-1.argent47.net"
    workspace_key_prefix = "workspace"
    key                  = "tfstate.json"
    region               = "eu-west-1"
  }
}

locals {
  environment = terraform.workspace
  role        = var.workspace_iam_role
}

provider "aws" {
  region = "eu-west-1"

  assume_role {
    role_arn = local.role
  }
}

data "aws_vpc" "vpc" {
  id = data.terraform_remote_state.main.outputs.vpc_id
}

data "aws_caller_identity" "current" {}
