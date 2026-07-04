variable "region" { type=string; default="eu-west-1" }
variable "db_user" { type=string; default="ticketing" }
variable "db_password" { type=string; sensitive=true }
