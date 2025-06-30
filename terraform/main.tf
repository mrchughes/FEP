provider "aws" {
  region = var.aws_region
}

terraform {
  required_version = ">= 1.3.0"

  backend "s3" {
    bucket         = var.bucket_name
    key            = "fep-app/terraform.tfstate"
    region         = var.aws_region
    dynamodb_table = var.lock_table_name
    encrypt        = true
  }
}