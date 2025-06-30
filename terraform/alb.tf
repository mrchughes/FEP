# ===============================
# ALB Target Group (existing)
# ===============================
data "aws_lb_target_group" "fep_tg" {
  arn = "arn:aws:elasticloadbalancing:eu-west-2:357402308721:targetgroup/fep-tg/0d661dd93c3b7ce0"
}

# ===============================
# ALB Listener Rule for /FEP*
# ===============================
resource "aws_lb_listener_rule" "fep_rule" {
  # Choose HTTPS or HTTP listener ARN
  listener_arn = "arn:aws:elasticloadbalancing:eu-west-2:357402308721:listener/app/Chris-Agent-LB/edabc91bfe9420a2/87c89b115afc486c" # <-- HTTPS listener

  priority = 110

  action {
    type             = "forward"
    target_group_arn = data.aws_lb_target_group.fep_tg.arn
  }

  condition {
    path_pattern {
      values = ["/FEP*"]
    }
  }
}
