from flask import Flask, request, jsonify
from openai import OpenAI  
from dummy import response  
from config import OPEN_API_KEY

client = OpenAI(api_key=OPEN_API_KEY)
app = Flask(__name__)

def enhance_prompt(user_message):
    """Formats the user query into a structured programming-related prompt."""
    base_prompt = f"""You are an AI-powered code tutor that generates, explains, and evaluates code snippets.  
        Your response must be formatted in **Markdown** with the following structure:  

        # Code Snippet  
        ```  
        <Generated Code>  
        ```  

        ## Explanation  
        Provide a clear and structured breakdown of the code, covering:

        - The purpose and functionality of the code.
        - Step-by-step explanation of key components and logic.
        - Important concepts and programming paradigms involved. 

        Ensure all **headings**, **lists**, and **code blocks** follow proper Markdown syntax.  
        Respond in **valid Markdown format** to maintain consistent rendering.  

        User Query:  
        {user_message}
    """
    

    return base_prompt

@app.route("/api/chat", methods=["POST"])
def chat():
    """Handles chat requests."""
    try:
        data = request.get_json()
        user_message = data.get("message", "").strip()

        if not user_message:
            return jsonify({"error": "Message is required"}), 400

        refined_prompt = enhance_prompt(user_message)

        # completion = client.chat.completions.create(
        #     model="gpt-3.5-turbo-0125",
        #     messages=[{"role": "user", "content": refined_prompt}]
        # )

        # raw_response = completion.choices[0].message.content  
        raw_response = response  # Use mock response for testing
        print(raw_response)

        return jsonify({"botreply": raw_response})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
