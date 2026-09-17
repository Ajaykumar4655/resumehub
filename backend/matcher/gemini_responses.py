from google.genai import Client
from decouple import config

client = Client(api_key=config("GEMINI_API_KEY"))

def load_prompt():
    with open("C:/Users/Admiin/OneDrive/Desktop/resumeAi/backend/matcher/prompts/prompts_file.txt", "r", encoding="utf-8") as f:
        return f.read()

def resume_vs_jd(resume_text,jd_text):
    base_prompt = load_prompt()

    final_prompt = base_prompt.replace("{{INSERT_RESUME_TEXT}}", resume_text)\
                              .replace("{{INSERT_JOB_DESCRIPTION}}", jd_text)

    response = client.models.generate_content(
        model="models/gemini-3.1-flash-lite",
        contents=final_prompt
    )
    return response

   


