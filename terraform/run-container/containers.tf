variable "otus-frontend-name"{
  default = "otus-frontend"
}

variable "otus-frontend-port"{
  default = 51008
}

variable "otus-frontend-apiurl"{
  default = "http://localhost:51002"
}

variable "otus-frontend-playerurl"{
  default = "http://localhost:51001"
}
variable "otus-api-network" {
  default = "otus-api-network"
}
variable "otus-frontend-version"{
  default = "otus-frontend:latest"
}

resource "docker_container" "otus-frontend" {
  name = "otus-frontend"
  image = "${var.otus-frontend-version}"
  env = [
    "API_URL=${var.otus-frontend-apiurl}",
    "PLAYER_URL=${var.otus-frontend-playerurl}"
  ]
  ports {
	internal = 80
	external = "${var.otus-frontend-port}"
  }
    networks_advanced {
    name    = "${var.otus-api-network}"
  }
}
