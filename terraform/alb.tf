resource "aws_lb_target_group" "fep_tg" {
  name     = "fep-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = data.aws_vpc.selected.id
}

resource "aws_lb_listener_rule" "fep_rule" {
  listener_arn = var.alb_listener_arn
  priority     = 110

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