from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
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
    # --- Intelligence Layer: Semantic Search + LLM Response ---
    from sentence_transformers import SentenceTransformer, util
    import openai
    import numpy as np
    import uuid

    # Example FAQ knowledge base
    faq = [
        {"question": "What is depression?", "answer": "Depression is a mental health disorder characterized by persistent sadness and loss of interest."},
        {"question": "How can I manage anxiety?", "answer": "Managing anxiety can include therapy, mindfulness, exercise, and medication if needed."},
        {"question": "What are symptoms of stress?", "answer": "Symptoms of stress include irritability, fatigue, headaches, and difficulty sleeping."},
        {"question": "How do I find mental health support?", "answer": "You can find support through therapists, helplines, online resources, and support groups."}
    ]

    # Embed user query and FAQ questions
    model = SentenceTransformer('all-MiniLM-L6-v2')
    query_embedding = model.encode(req.message, convert_to_tensor=True)
    faq_embeddings = model.encode([item["question"] for item in faq], convert_to_tensor=True)
    scores = util.pytorch_cos_sim(query_embedding, faq_embeddings)[0].cpu().numpy()
    best_idx = int(np.argmax(scores))
    best_score = float(scores[best_idx])

    # If similarity is high, use FAQ answer; else, use OpenAI LLM
    if best_score > 0.7:
        bot_reply = faq[best_idx]["answer"]
    else:
        # OpenAI LLM fallback (requires OPENAI_API_KEY env variable)
        openai.api_key = os.getenv("OPENAI_API_KEY", "")
        if openai.api_key:
            completion = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "system", "content": "You are a helpful mental health assistant."},
                          {"role": "user", "content": req.message}]
            )
            bot_reply = completion.choices[0].message.content
        else:
            bot_reply = "I'm here to help. Can you tell me more about your concern?"

    important_data = {
        "user_id": req.user_id or "demo_user",
        "message": req.message,
        "score": best_score,
        "reply": bot_reply
    }

    # --- Qdrant: Store vectorized message ---
    if qdrant_client:
        import numpy as np
        import uuid
        collection_name = "patient_data"
        vector_size = 1536
        # Create collection if it doesn't exist
        collections = qdrant_client.get_collections().collections
        if not any(c.name == collection_name for c in collections):
            qdrant_client.create_collection(
                collection_name=collection_name,
                vectors_config={"size": vector_size, "distance": "Cosine"}
            )
        vector = np.random.rand(vector_size).tolist()  # Replace with real embedding
        qdrant_client.upsert(
            collection_name=collection_name,
            points=[{
                "id": str(uuid.uuid4()),
                "vector": vector,
                "payload": important_data
            }]
        )

    # --- Redis: Cache last 10 messages per user ---
    if redis_client:
        key = f"messages:{important_data['user_id']}"
        redis_client.lpush(key, req.message)
        redis_client.ltrim(key, 0, 9)

    # --- Neo4j: Richer graph (user, message, sentiment) ---
    if neo4j_driver:
        with neo4j_driver.session() as session:
            session.run(
                "MERGE (u:User {id: $id}) "
                "CREATE (m:Message {text: $text, score: $score}) "
                "MERGE (u)-[:SENT]->(m)",
                id=important_data['user_id'], text=req.message, score=score
            )

    reply = f"You said: {req.message}. Sentiment score: {score}. Data stored in Qdrant, Redis, Neo4j."
    return {"reply": reply}

# --- Endpoint: Get last 10 messages for a user ---
@app.get("/api/history/{user_id}")
async def get_history(user_id: str):
    if redis_client:
        key = f"messages:{user_id}"
        messages = redis_client.lrange(key, 0, 9)
        messages = [m.decode() for m in messages]
        return {"user_id": user_id, "messages": messages}
    return JSONResponse(status_code=404, content={"error": "No history found"})

# --- Endpoint: Get analytics (Neo4j: message count per user) ---
@app.get("/api/analytics/{user_id}")
async def get_analytics(user_id: str):
    if neo4j_driver:
        with neo4j_driver.session() as session:
            result = session.run(
                "MATCH (u:User {id: $id})-[:SENT]->(m:Message) RETURN count(m) as msg_count",
                id=user_id
            )
            record = result.single()
            msg_count = record["msg_count"] if record and "msg_count" in record else 0
            return {"user_id": user_id, "message_count": msg_count}
    return JSONResponse(status_code=404, content={"error": "No analytics found"})

# Add more endpoints for demo as needed
