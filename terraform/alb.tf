# ===============================
# ALB Target Group (new for Fargate)
# ===============================
resource "aws_lb_target_group" "fep_tg" {
  name        = "fep-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip" # 💥 IMPORTANT for Fargate

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 5
    unhealthy_threshold = 2
    matcher             = "200-399"
  }
}

# ===============================
# ALB Listener Rule for /FEP*
# ===============================
resource "aws_lb_listener_rule" "fep_rule" {
  listener_arn = var.alb_listener_arn # 💡 Use your HTTPS or HTTP ARN

  priority = 110

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.fep_tg.arn
  }

  condition {
    path_pattern {
      values = ["/FEP*"]
    }
  }
}
