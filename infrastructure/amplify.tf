resource "aws_amplify_app" "app" {
  name         = "demo-dapp-starknet-${var.environment}"
  repository   = "https://github.com/argentlabs/demo-dapp-starknet"
  access_token = var.github_token
  platform     = "WEB_COMPUTE"

  build_spec = <<-EOT
    version: 1
    frontend:
      phases:
        preBuild:
          commands:
            - nvm install $VERSION_NODE_20
            - nvm use $VERSION_NODE_20
            - corepack enable && corepack enable pnpm
            - pnpm config set //npm.greensock.com/:_authToken=$GSAP_NPM_TOKEN
            - pnpm install
            - pnpm config delete //npm.greensock.com/:_authToken=$GSAP_NPM_TOKEN
        build:
          commands:
            - pnpm build:${var.environment}
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
          - .next/cache/**/*
  EOT


  enable_auto_branch_creation = false

  environment_variables = merge({
    for k, v in {
      _CUSTOM_IMAGE = "amplify:al2023",
      GSAP_NPM_TOKEN = var.gsap_npm_token,
    } : k => v if v != null
  })
}

resource "aws_amplify_branch" "branch" {
  app_id      = aws_amplify_app.app.id
  branch_name = var.branch

  display_name = terraform.workspace
  framework    = "Next.js - SSR"

  enable_auto_build       = true
  enable_performance_mode = var.enable_performance_mode
}

resource "aws_amplify_domain_association" "domain_association" {
  app_id      = aws_amplify_app.app.id
  domain_name = "${var.domain_name}"

  sub_domain {
    branch_name = aws_amplify_branch.branch.branch_name
    prefix      = "gift"
  }
}
