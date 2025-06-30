output "bucket_name" {
  value = aws_s3_bucket.forms_bucket.id
}

output "dynamo_table_name" {
  value = aws_dynamodb_table.users.name
}
