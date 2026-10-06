terraform {
  required_version = ">= 1.7.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  backend "azurerm" {
    resource_group_name  = "rg-ecommerce-tfstate"
    storage_account_name = "stecommercetfstate"
    container_name       = "tfstate"
    key                  = "prod.terraform.tfstate"
  }
}

