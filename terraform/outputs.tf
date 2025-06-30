output "backend_repo_url" {
  value = aws_ecr_repository.backend.repository_url
}

output "frontend_repo_url" {
  value = aws_ecr_repository.frontend.repository_url
}


output "dynamodb_table_name" {
  value = aws_dynamodb_table.fep_model.name
}