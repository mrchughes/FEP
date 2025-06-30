variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs"
  type        = list(string)
}

variable "alb_listener_arn_https" {
  description = "ALB HTTPS Listener ARN"
  type        = string
}

variable "alb_security_group_id" {
  description = "ALB Security Group ID"
  type        = string
}

variable "backend_image" {
  description = "Backend image URI"
  type        = string
}

variable "frontend_image" {
  description = "Frontend image URI"
  type        = string
}



provider "aws" {
  region = "eu-west-2"
}
