import os
import json
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env file (if exists)
load_dotenv()

# 🔑 Groq API Configuration
# Option 1: Direct key (current use)
GROQ_API_KEY = "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"

# Option 2: Environment variable (recommended for security)
# GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize Groq client (OpenAI compatible)
client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1"
)

def get_follow_up_question(user_answer: str) -> dict:
    """
    User ke technical answer ko analyze karke context-aware 
    follow-up question structured JSON me return karta hai.
    Uses Groq's free Llama 3.3 model.
    """
    
    # Handle empty or very short answers
    if not user_answer or len(user_answer.strip()) < 2:
        return {"follow_up": "Please provide a more detailed answer to get a relevant follow-up question."}
    
    # Comprehensive system instruction for Groq
    system_instruction = """You are an expert technical interviewer. Your job is to analyze the user's answer and generate a single, highly relevant, deep technical follow-up question.

CRITICAL HANDLING RULES:
1. IF the input is too short or lacks detail (e.g., 'yes', 'Redis', 'good', 'MongoDB'), ask them to elaborate on their specific implementation or architectural choices.
2. IF the input is off-topic or completely irrelevant to technical architecture/coding, politely guide them back to the topic or ask how it relates to their project.
3. IF the input mentions a specific technology (Redis, MongoDB, Docker, AWS, etc.), ask about implementation details, challenges, or optimizations.
4. Always keep the tone professional, constructive, and technical.
5. Return ONLY valid JSON in this exact format: {"follow_up": "your question here"}

Examples:
- Input: "I used Redis for caching" → Output: {"follow_up": "How do you handle cache invalidation and memory eviction policies in Redis?"}
- Input: "yes" → Output: {"follow_up": "Could you please elaborate on your implementation with more technical details?"}
- Input: "MongoDB is good" → Output: {"follow_up": "What indexing strategy did you use for optimizing MongoDB queries?"}"""
    
    try:
        # Make API call to Groq
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # Free, fast, and capable model
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": f"User's technical answer: {user_answer}"}
            ],
            temperature=0.7,  # Slight creativity for diverse questions
            max_tokens=150,   # Keep responses concise
            top_p=0.9
        )
        
        # Extract the response content
        response_content = response.choices[0].message.content
        
        # Try to parse JSON from response
        # Sometimes model might add extra text, so clean it up
        response_content = response_content.strip()
        
        # Remove markdown code blocks if present
        if response_content.startswith("```json"):
            response_content = response_content[7:]
        if response_content.startswith("```"):
            response_content = response_content[3:]
        if response_content.endswith("```"):
            response_content = response_content[:-3]
        response_content = response_content.strip()
        
        # Parse JSON
        result = json.loads(response_content)
        
        # Validate the response has the required field
        if "follow_up" not in result:
            return {"follow_up": f"Could you elaborate more on '{user_answer[:50]}'?"}
        
        return result
        
    except json.JSONDecodeError as e:
        # If JSON parsing fails, return a fallback response
        print(f"JSON Parse Error: {e}")
        return {"follow_up": f"Could you provide more technical details about '{user_answer[:50]}'?"}
        
    except Exception as e:
        # Handle API errors gracefully
        error_msg = str(e)
        
        if "invalid_api_key" in error_msg.lower():
            return {"follow_up": "API key error. Please check your Groq API key."}
        elif "rate_limit" in error_msg.lower():
            return {"follow_up": "Rate limit reached. Please wait a moment and try again."}
        elif "quota" in error_msg.lower():
            return {"follow_up": "API quota exceeded. Groq free tier has limits. Please try again later."}
        else:
            return {"follow_up": f"Error generating question: {error_msg[:100]}"}


# Optional: Test function when run directly
if __name__ == "__main__":
    print("Testing Groq Follow-Up Question Generator...")
    print("-" * 50)
    
    test_cases = [
        "I used Redis for caching user sessions",
        "We're using MongoDB as our primary database",
        "yes",
        "Docker containers for microservices",
        "AWS Lambda for serverless functions"
    ]
    
    for test in test_cases:
        print(f"\nInput: {test}")
        result = get_follow_up_question(test)
        print(f"Output: {result}")
        print("-" * 30)