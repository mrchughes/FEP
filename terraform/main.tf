provider "aws" {
  region = var.region
}

resource "aws_s3_bucket" "forms_bucket" {
  bucket = var.bucket_name

  versioning {
    enabled = true
  }
}

resource "aws_dynamodb_table" "users" {
  name           = var.dynamo_table_name
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "email"

  attribute {
    name = "email"
    type = "S"
  }

  tags = {
    Environment = "production"
  }
}
