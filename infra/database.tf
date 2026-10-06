resource "random_password" "db_password" {
  length           = 24
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "random_string" "db_suffix" {
  length  = 6
  special = false
  upper   = false
}

locals {
  db_server_name = var.db_server_name != null ? var.db_server_name : "psql-ecommerce-${var.environment}-${random_string.db_suffix.result}"
}

resource "azurerm_postgresql_flexible_server" "db" {
  name                   = local.db_server_name
  resource_group_name    = azurerm_resource_group.main.name
  location               = azurerm_resource_group.main.location
  version                = "15"
  sku_name               = "GP_Standard_D2s_v3"
  storage_mb             = 32768
  auto_grow_enabled      = false
  administrator_login    = var.db_admin_username
  administrator_password = random_password.db_password.result

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "azurerm_postgresql_flexible_server_database" "ecommerce_db" {
  name      = "ecommerce"
  server_id = azurerm_postgresql_flexible_server.db.id
  collation = "en_US.utf8"
  charset   = "UTF8"
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_azure_services" {
  name             = "allow_azure_services"
  server_id        = azurerm_postgresql_flexible_server.db.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

