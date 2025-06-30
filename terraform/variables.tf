variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "vpc_id" {
  description = "Existing VPC ID"
  type        = string
}

variable "subnet_ids" {
  description = "List of existing subnet IDs"
  type        = list(string)
}

variable "alb_sg_id" {
  description = "Existing ALB security group ID"
  type        = string
}

variable "alb_listener_arn" {
  description = "Existing ALB listener ARN (HTTPS)"
  type        = string
}

variable "backend_repo_name" {
  description = "Backend ECR repository name"
  type        = string
}

variable "frontend_repo_name" {
  description = "Frontend ECR repository name"
  type        = string
}

