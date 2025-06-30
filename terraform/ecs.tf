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
