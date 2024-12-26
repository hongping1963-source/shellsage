# Docker Workflow Examples

This document shows how ShellSage enhances your Docker workflow with intelligent suggestions and error prevention.

## 1. Basic Docker Operations

### Container Management
```bash
# List containers
$ docker ps
> docker ps                  # List running containers
> docker ps -a               # List all containers
> docker ps -q              # List container IDs only

# Start/Stop containers
$ docker
> docker start container_name
> docker stop container_name
> docker restart container_name

# Remove containers
$ docker rm
> docker rm container_name
> docker rm $(docker ps -aq)  # Remove all containers
> docker rm -f container_name # Force remove
```

## 2. Image Management

### Working with Images
```bash
# List images
$ docker images
> docker images             # List all images
> docker images -q          # List image IDs only
> docker images --digests   # Show image digests

# Pull images
$ docker pull
> docker pull ubuntu:latest
> docker pull nginx:alpine
> docker pull mysql:8.0

# Remove images
$ docker rmi
> docker rmi image_name
> docker rmi $(docker images -q)  # Remove all images
> docker rmi -f image_name        # Force remove
```

## 3. Docker Compose

### Basic Operations
```bash
# Start services
$ docker-compose up
> docker-compose up -d           # Detached mode
> docker-compose up --build      # Build images first
> docker-compose up service_name # Start specific service

# Stop services
$ docker-compose down
> docker-compose down -v         # Remove volumes
> docker-compose down --rmi all  # Remove images
```

## 4. Building Images

### Dockerfile Commands
```bash
# Build image
$ docker build
> docker build -t app:latest .
> docker build --no-cache .
> docker build -f Dockerfile.dev .

# Tag image
$ docker tag
> docker tag source:latest target:latest
> docker tag app:latest username/app:latest
```

## 5. Network Management

### Docker Networks
```bash
# List networks
$ docker network
> docker network ls
> docker network inspect bridge
> docker network prune

# Create network
$ docker network create
> docker network create mynetwork
> docker network create --driver bridge mynetwork
```

## 6. Volume Management

### Docker Volumes
```bash
# List volumes
$ docker volume
> docker volume ls
> docker volume inspect myvolume
> docker volume prune

# Create volume
$ docker volume create
> docker volume create myvolume
> docker volume create --driver local myvolume
```

## 7. Container Interaction

### Executing Commands
```bash
# Execute command in container
$ docker exec
> docker exec -it container_name bash
> docker exec container_name ls
> docker exec -u root container_name command

# View logs
$ docker logs
> docker logs container_name
> docker logs -f container_name    # Follow log output
> docker logs --tail 100 container_name
```

## 8. Docker Registry

### Registry Operations
```bash
# Login to registry
$ docker login
> docker login
> docker login registry.example.com
> docker login -u username

# Push images
$ docker push
> docker push username/app:latest
> docker push registry.example.com/app:latest
```

## 9. Resource Management

### System Commands
```bash
# System info
$ docker system
> docker system df           # Show disk usage
> docker system prune        # Clean up
> docker system info        # Show system-wide information

# Container stats
$ docker stats
> docker stats              # Show live stats
> docker stats container_name
```

## 10. Best Practices

### Security Scanning
```bash
# Scan images
$ docker scan
> docker scan myimage
> docker scan myimage:latest
> docker scan --file Dockerfile myimage
```

### Health Checks
```bash
# Check container health
$ docker inspect
> docker inspect container_name
> docker inspect --format='{{.State.Health.Status}}' container_name
```
