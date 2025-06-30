
resource "aws_ecr_repository" "backend" {
  name = "backend"
}

resource "aws_ecr_repository" "frontend" {
  name = "frontend"
}


resource "aws_ecs_cluster" "fep_cluster" {
  name = "fep-cluster"
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "ecs_task_s3_dynamo" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

resource "aws_iam_role_policy_attachment" "ecs_task_s3" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

resource "aws_ecs_task_definition" "backend_task" {
  family                   = "fep-backend-task"
  network_mode            = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "backend"
      image     = var.backend_image
      essential = true
      portMappings = [{
        containerPort = 5000
      }]
    }
  ])
}

resource "aws_ecs_task_definition" "frontend_task" {
  family                   = "fep-frontend-task"
  network_mode            = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "frontend"
      image     = var.frontend_image
      essential = true
      portMappings = [{
        containerPort = 3000
      }]
      environment = [
        {
          name  = "REACT_APP_API_URL"
          value = "https://mrchughes.site/api"
        }
      ]
    }
  ])
}

resource "aws_lb_target_group" "frontend_tg" {
  name     = "fep-frontend-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    path = "/"
    matcher = "200-399"
  }
}

resource "aws_lb_listener_rule" "frontend_rule" {
  listener_arn = var.alb_listener_arn_https
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend_tg.arn
  }

  condition {
    path_pattern {
      values = ["/FEP/*"]
    }
  }
}

resource "aws_ecs_service" "backend_service" {
  name            = "fep-backend-service"
  cluster         = aws_ecs_cluster.fep_cluster.id
  task_definition = aws_ecs_task_definition.backend_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.subnet_ids
    security_groups = [var.alb_security_group_id]
    assign_public_ip = true
  }
}

resource "aws_ecs_service" "frontend_service" {
  name            = "fep-frontend-service"
  cluster         = aws_ecs_cluster.fep_cluster.id
  task_definition = aws_ecs_task_definition.frontend_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.subnet_ids
    security_groups = [var.alb_security_group_id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend_tg.arn
    container_name   = "frontend"
    container_port   = 3000
  }
}
