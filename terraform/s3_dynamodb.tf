resource "aws_s3_bucket" "fep_output" {
  bucket = "fep-app-output-bucket-${var.vpc_id}"
  force_destroy = true
}

resource "aws_dynamodb_table" "fep_model" {
  name         = "fep-model-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "ModelID"

  attribute {
    name = "ModelID"
    type = "S"
  }
}