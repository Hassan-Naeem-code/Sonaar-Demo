# Dockerized Mental Health Demo

## Prerequisites
- Docker and Docker Compose installed

## How to Run
1. Clone the repository and navigate to the project root.
2. Build and start all services:
   ```sh
   docker-compose up --build
   ```
3. Access the web app:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Qdrant: http://localhost:6333
   - Neo4j Browser: http://localhost:7474 (login: neo4j/password)

## Services
- **frontend**: React app for patient-bot interaction
- **backend**: FastAPI server with Qdrant, Redis, Neo4j integration
- **qdrant**: Vector database
- **redis**: Caching layer
- **neo4j**: Graph database

## Notes
- All services are networked together for demo purposes.
- Backend uses environment variables for service connections.
- You can extend the backend to use real ML/DL models and advanced analytics.

## Stopping Services
```sh
docker-compose down
```
