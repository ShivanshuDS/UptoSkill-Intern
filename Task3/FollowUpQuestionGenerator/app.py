import streamlit as tf  # Custom name custom CSS properties ke liye
import streamlit as st
from generator import get_follow_up_question

# Page configuration aur Styling
st.set_page_config(page_title="C9. Follow-Up Question Generator", page_icon="⚙️", layout="centered")

# Custom Premium CSS (Aapke UI preferences ke mutabik Glassmorphism Touch)
st.markdown("""
    <style>
    .main-title {
        font-size: 24pt;
        font-weight: bold;
        color: #1E293B;
        margin-bottom: 5px;
    }
    .sub-title {
        font-size: 14pt;
        color: #475569;
        margin-bottom: 25px;
    }
    .json-box {
        background-color: #F8FAFC;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        padding: 15px;
    }
    </style>
""", unsafe_allow_html=True)

# UI Header Sections
st.markdown('<div class="main-title">C9. Follow-Up Question Generator</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-title">Objective: Generate contextual follow-up questions in strict JSON format.</div>', unsafe_allow_html=True)

# Main input text area
user_input = st.text_area(
    "Input Answer:", 
    placeholder='Example: "I used Redis for caching." or enter any short/off-topic response to test.',
    height=120
)

# Generate Button
if st.button("Generate Follow-Up", type="primary"):
    if user_input:
        with st.spinner("Analyzing input and generating next question..."):
            # Backend function ko call karein
            result = get_follow_up_question(user_input)
            
            st.write("### Output")
            # Strict format output display karne ke liye standard st.json
            st.json(result)
    else:
        st.warning("Please enter some text before generating.")
        