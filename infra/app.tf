# --- Azure Container Registry ---
resource "random_string" "acr_suffix" {
  length  = 6
  special = false
  upper   = false
}

locals {
  acr_name      = var.acr_name != null ? var.acr_name : "acrecommerce${var.environment}${random_string.acr_suffix.result}"
  backend_image = var.backend_image != null ? var.backend_image : "${azurerm_container_registry.acr.login_server}/backend:latest"
}

resource "azurerm_container_registry" "acr" {
  name                = local.acr_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = true

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# --- Azure Container Apps Environment ---
resource "azurerm_container_app_environment" "env" {
  name                       = "cae-ecommerce-${var.environment}"
  resource_group_name        = azurerm_resource_group.main.name
  location                   = azurerm_resource_group.main.location
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# --- Azure Container App (Backend) ---
resource "azurerm_container_app" "backend" {
  name                         = "ca-backend-${var.environment}"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  secret {
    name  = "acr-password"
    value = azurerm_container_registry.acr.admin_password
  }

  secret {
    name  = "db-password"
    value = random_password.db_password.result
  }

  secret {
    name  = "database-url"
    value = "postgresql://${azurerm_postgresql_flexible_server.db.administrator_login}:${random_password.db_password.result}@${azurerm_postgresql_flexible_server.db.fqdn}:5432/${azurerm_postgresql_flexible_server_database.ecommerce_db.name}?sslmode=require"
  }

  registry {
    server               = azurerm_container_registry.acr.login_server
    username             = azurerm_container_registry.acr.admin_username
    password_secret_name = "acr-password"
  }

  ingress {
    external_enabled = true
    target_port      = var.backend_port
    transport        = "auto"

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  template {
    min_replicas = 0
    max_replicas = 2

    container {
      name   = "backend"
      image  = local.backend_image
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name  = "PORT"
        value = tostring(var.backend_port)
      }
      env {
        name  = "NODE_ENV"
        value = "production"
      }
      env {
        name  = "CORS_ORIGIN"
        value = "*"
      }
      env {
        name  = "DB_HOST"
        value = azurerm_postgresql_flexible_server.db.fqdn
      }
      env {
        name  = "DB_USER"
        value = azurerm_postgresql_flexible_server.db.administrator_login
      }
      env {
        name  = "DB_PORT"
        value = "5432"
      }
      env {
        name  = "DB_NAME"
        value = azurerm_postgresql_flexible_server_database.ecommerce_db.name
      }
      env {
        name        = "DB_PASSWORD"
        secret_name = "db-password"
      }
      env {
        name        = "DATABASE_URL"
        secret_name = "database-url"
      }
    }
  }

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# --- Azure Static Web App (Frontend) ---
resource "azurerm_static_web_app" "frontend" {
  name                = "swa-ecommerce-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.static_web_app_location
  sku_tier            = "Free"
  sku_size            = "Free"

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

