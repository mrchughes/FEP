provider "aws" {
  region = var.aws_region
}



terraform {
  required_version = ">= 1.3.0"

  backend "s3" {
    bucket         = "mrchughes-terraform-state"
    key            = "fep-app/terraform.tfstate"
    region         = "eu-west-2"
    dynamodb_table = "mrchughes-terraform-lock"
    encrypt        = true
  }
}
