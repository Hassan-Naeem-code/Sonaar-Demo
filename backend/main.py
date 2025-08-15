from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from typing import Optional
import os
try:
    from qdrant_client import QdrantClient
except ImportError:
    QdrantClient = None
try:
    import redis
except ImportError:
    redis = None
try:
    from neo4j import GraphDatabase
except ImportError:
    GraphDatabase = None

# Initialize clients using environment variables for Docker
qdrant_url = os.getenv("QDRANT_URL", "http://localhost:6333")
redis_host = os.getenv("REDIS_HOST", "localhost")
redis_port = int(os.getenv("REDIS_PORT", "6379"))
neo4j_uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
neo4j_user = os.getenv("NEO4J_USER", "neo4j")
neo4j_password = os.getenv("NEO4J_PASSWORD", "password")

qdrant_client = QdrantClient(qdrant_url) if QdrantClient else None
redis_client = redis.Redis(host=redis_host, port=redis_port, db=0) if redis else None
neo4j_driver = GraphDatabase.driver(neo4j_uri, auth=(neo4j_user, neo4j_password)) if GraphDatabase else None

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None


@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    # Intelligence layer placeholder
    # Extract and rank patient data (mocked)
    important_data = {
        "user_id": req.user_id or "demo_user",
        "message": req.message,
        "score": 0.95  # Pretend ML model output
    }

    # Store in Qdrant (mocked)
    if qdrant_client:
        # qdrant_client.upsert(collection_name="patient_data", points=[...])
        pass

    # Cache in Redis (mocked)
    if redis_client:
        redis_client.set(f"last_message:{important_data['user_id']}", req.message)

    # Store in Neo4j (mocked)
    if neo4j_driver:
        with neo4j_driver.session() as session:
            session.run("MERGE (u:User {id: $id})-[:SENT]->(m:Message {text: $text})", id=important_data['user_id'], text=req.message)

    reply = f"You said: {req.message}. How are you feeling today? (Data processed with ML, stored in Qdrant, Redis, Neo4j)"
    return {"reply": reply}

# Add more endpoints for demo as needed
