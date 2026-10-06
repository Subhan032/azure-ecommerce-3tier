output "resource_group_name" {
  description = "The name of the resource group."
  value       = azurerm_resource_group.main.name
}

output "resource_group_id" {
  description = "The ID of the resource group."
  value       = azurerm_resource_group.main.id
}

output "log_analytics_workspace_name" {
  description = "The name of the Log Analytics Workspace."
  value       = azurerm_log_analytics_workspace.main.name
}

output "log_analytics_workspace_id" {
  description = "The ID of the Log Analytics Workspace."
  value       = azurerm_log_analytics_workspace.main.id
}

output "log_analytics_workspace_workspace_id" {
  description = "The Workspace (Customer) ID for the Log Analytics Workspace."
  value       = azurerm_log_analytics_workspace.main.workspace_id
}

output "db_server_name" {
  description = "The name of the MySQL Flexible Server."
  value       = azurerm_mysql_flexible_server.mysql.name
}

output "db_server_fqdn" {
  description = "The fully qualified domain name (FQDN) of the MySQL Flexible Server."
  value       = azurerm_mysql_flexible_server.mysql.fqdn
}

output "db_database_name" {
  description = "The name of the ecommerce MySQL database."
  value       = azurerm_mysql_flexible_database.ecommerce_db.name
}

output "db_admin_username" {
  description = "The administrator username for MySQL Flexible Server."
  value       = azurerm_mysql_flexible_server.mysql.administrator_login
}

output "db_admin_password" {
  description = "The administrator password for MySQL Flexible Server."
  value       = local.db_admin_password
  sensitive   = true
}

output "database_url" {
  description = "Connection string for the MySQL database (Prisma format)."
  value       = "mysql://${azurerm_mysql_flexible_server.mysql.administrator_login}:${local.db_admin_password}@${azurerm_mysql_flexible_server.mysql.fqdn}:3306/${azurerm_mysql_flexible_database.ecommerce_db.name}?ssl-mode=REQUIRED"
  sensitive   = true
}

output "acr_name" {
  description = "The name of the Azure Container Registry."
  value       = azurerm_container_registry.acr.name
}

output "acr_login_server" {
  description = "The login server for the Azure Container Registry."
  value       = azurerm_container_registry.acr.login_server
}

output "container_app_url" {
  description = "The public URL of the backend Container App."
  value       = "https://${azurerm_container_app.backend.ingress[0].fqdn}"
}

output "static_web_app_url" {
  description = "The public URL of the frontend Static Web App."
  value       = "https://${azurerm_static_web_app.frontend.default_host_name}"
}

output "static_web_app_api_key" {
  description = "The deployment API key for the Static Web App."
  value       = azurerm_static_web_app.frontend.api_key
  sensitive   = true
}

