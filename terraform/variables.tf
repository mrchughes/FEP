variable "bucket_name" {
  description = "S3 bucket name for form uploads"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
}

variable "dynamo_table_name" {
  description = "DynamoDB table name for users"
  type        = string
}
