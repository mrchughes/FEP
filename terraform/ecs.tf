# ==============================
# ECS Cluster
# ==============================
resource "aws_ecs_cluster" "fep_cluster" {
  name = "fep-cluster"
}

# ==============================
# ECS Task Definition
# ==============================
resource "aws_ecs_task_definition" "fep_task" {
  family                   = "fep-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "frontend"
      image     = "357402308721.dkr.ecr.eu-west-2.amazonaws.com/frontend:latest"
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ],
      environment = [
        {
          name  = "S3_BUCKET_NAME"
          value = var.s3_bucket_name
        },
        {
          name  = "DYNAMO_TABLE_NAME"
          value = var.dynamo_table_name
        }
      ]
    },
    {
      name      = "backend"
      image     = "357402308721.dkr.ecr.eu-west-2.amazonaws.com/backend:latest"
      essential = true
      portMappings = [
        {
          containerPort = 5000
          hostPort      = 5000
        }
      ]
    }
  ])
}

# ==============================
# ECS Service
# ==============================
resource "aws_ecs_service" "fep_service" {
  name            = "fep-service"
  cluster         = aws_ecs_cluster.fep_cluster.id
  task_definition = aws_ecs_task_definition.fep_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [var.alb_sg_id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.fep_tg.arn
    container_name   = "frontend"
    container_port   = 3000
  }

  depends_on = [
    aws_lb_listener_rule.fep_rule
  ]
}

