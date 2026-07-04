# Terraform example
Run `terraform init`, `terraform plan -var db_password=...`, then `terraform apply`.
This instructional baseline provisions a multi-AZ VPC, PostgreSQL, and Redis; production
would add EKS, MQ, encrypted storage, private security groups, backups, and secret manager.
