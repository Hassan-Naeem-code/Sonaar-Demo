# Sonaar-Demo: Complete System Information

## Overview
This project is a Dockerized demo for a mental health web application. It demonstrates:
- Patient-bot interaction via a React frontend
- FastAPI backend with connections to Qdrant (vector DB), Redis (cache), and Neo4j (graph DB)
- Placeholder for intelligence layer (ML/DL/neural network)

## Services
- **frontend**: React app (port 3000)
- **backend**: FastAPI server (port 8000)
- **qdrant**: Vector database (port 6333)
- **redis**: Caching layer (port 6379)
- **neo4j**: Graph database (ports 7687, 7474)

## How to Run
1. Install Docker and Docker Compose.
2. In the project root, run:
   ```sh
   docker-compose up --build
   ```
3. Access services:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
   - Qdrant: http://localhost:6333
   - Neo4j Browser: http://localhost:7474 (login: neo4j/password)

## Stopping Services
```sh
docker-compose down
```

## Extending the Demo
- Add real ML/DL models to backend for advanced analytics.
- Customize frontend for more features or improved UI.
- Use Qdrant, Redis, and Neo4j for real data flows.

## Files
- `docker-compose.yml`: Orchestrates all services
- `frontend/Dockerfile`: React build
- `backend/Dockerfile`: FastAPI build
- `backend/main.py`: Backend logic
- `README-docker.md`: Docker instructions
- `README.md`: General overview

For further details or code samples, see the respective files or ask for more info.
