variable "location" {
  type        = string
  description = "The Azure region where resources will be deployed."
  default     = "eastus"
}

variable "environment" {
  type        = string
  description = "The deployment environment (e.g., dev, staging, prod)."
  default     = "prod"
}

variable "resource_group_name" {
  type        = string
  description = "The name of the Azure Resource Group."
  default     = "rg-ecommerce-3tier-prod"
}

variable "db_admin_username" {
  type        = string
  description = "The administrator login username for PostgreSQL Flexible Server."
  default     = "pgadmin"
}

variable "db_server_name" {
  type        = string
  description = "Optional custom name for PostgreSQL Flexible Server. If null, a name with a random suffix will be generated."
  default     = null
}

variable "acr_name" {
  type        = string
  description = "Optional custom name for Azure Container Registry (alphanumeric only). If null, a name with a random suffix will be generated."
  default     = null
}

variable "backend_port" {
  type        = number
  description = "Target port for backend container ingress."
  default     = 5000
}

variable "backend_image" {
  type        = string
  description = "Container image for the backend Container App. If null, defaults to ACR backend:latest."
  default     = null
}

variable "static_web_app_location" {
  type        = string
  description = "Azure region for Static Web App (e.g., eastus2, centralus)."
  default     = "eastus2"
}

