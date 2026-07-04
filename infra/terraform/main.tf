terraform { required_version = ">= 1.6"; required_providers { aws = { source = "hashicorp/aws"; version = "~> 5.0" } } }
provider "aws" { region = var.region }
module "vpc" { source = "terraform-aws-modules/vpc/aws"; version = "5.13.0"; name = "ticketing"; cidr = "10.0.0.0/16"; azs = ["${var.region}a","${var.region}b"]; private_subnets = ["10.0.1.0/24","10.0.2.0/24"]; public_subnets = ["10.0.101.0/24","10.0.102.0/24"]; enable_nat_gateway = true }
resource "aws_elasticache_cluster" "locks" { cluster_id = "ticket-locks"; engine = "redis"; node_type = "cache.t3.micro"; num_cache_nodes = 1 }
resource "aws_db_instance" "postgres" { identifier = "ticketing"; engine = "postgres"; instance_class = "db.t3.micro"; allocated_storage = 20; username = var.db_user; password = var.db_password; skip_final_snapshot = true }
