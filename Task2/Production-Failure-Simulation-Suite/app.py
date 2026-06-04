from fastapi import FastAPI
from pydantic import BaseModel
import random
from fastapi import HTTPException
from logger import log_event
app = FastAPI()

#Home Route
@app.get("/")
def home():
    return {"message": "Server Running "}

#invalid inputs
class User(BaseModel):
    name: str
    age: int

@app.post("/user")
def create_user(user: User):
    return {
        "name": user.name,
        "age": user.age
    }

#  Disconnected
@app.get("/disconnect")
def disconnect():

    if random.random() < 0.5:
        log_event("Connection Lost")

        raise HTTPException(
            status_code=500,
            detail="Connection Lost"
        )
        
    log_event("Connection Successful")

    return {
        "status": "connected"
    }

@app.get("/unstable")
def unstable():

    if random.random() < 0.8:

        log_event("Unstable Failure")

        raise HTTPException(
            status_code=500,
            detail="Temporary Failure"
        )

    log_event("Unstable Success")

    return {
        "status": "ok"
    }