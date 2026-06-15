# C9. Follow-Up Question Generator

A smart, context-aware interview/tutoring assistant built with Python, Streamlit, and OpenAI. This system accepts a user's technical response, analyzes it, and dynamically generates a deep technical follow-up question in a strict JSON format while seamlessly handling edge cases like short answers and off-topic conversations.

---

## 🚀 Features

* **Contextual Follow-Ups:** Generates relevant engineering questions based on the technical depth of the user's input.
* **Strict JSON Outputs:** Leverages Pydantic and OpenAI Structured Outputs to consistently match the schema `{"follow_up": "..."}`.
* **Edge Case Resilience:**
  * Detects and prompts for more detail on **Short Answers** (e.g., "MongoDB", "Yes").
  * Gently redirects the conversation on **Off-Topic Responses** (e.g., "I like eating pizza").
* **Clean UI:** A minimal, user-friendly frontend built with Streamlit.

---

## 📂 Project Structure

```text
followup_generator/
│
├── .env                  # API keys and environment variables (Secret)
├── requirements.txt      # Project dependencies and libraries
├── app.py                # Frontend UI layer (Streamlit)
└── generator.py          # Backend engine and LLM core logic