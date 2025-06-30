data "aws_vpc" "selected" {
  id = var.vpc_id
}

data "aws_subnet" "selected_1" {
  id = var.subnet_ids[0]
}

data "aws_subnet" "selected_2" {
  id = var.subnet_ids[1]
}

data "aws_security_group" "alb_sg" {
  id = var.alb_sg_id
}