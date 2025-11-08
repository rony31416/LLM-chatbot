

# Multi-Model Chatbot

A React Vite chatbot that allows users to interact with two different AI models: Ollama's Llama3.2 (running locally) and Google's Gemini API (using the free version). The chatbot maintains conversation history and features a clean, minimalist black and white design with borders.

## Features

- Switch between Ollama's Llama3.2 and Google's Gemini models
- Maintain conversation history across multiple messages
- Clean, minimalist black and white interface with borders
- Responsive design that works on desktop and mobile devices
- Real-time chat with loading indicators

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- Ollama installed on your local machine with Llama3.2 model
- Google Gemini API key (free tier available)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/rony31416/LLM-chatbot.git
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory and add your Gemini API key:

   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

   To get a free Gemini API key:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy and paste it into your `.env.local` file

4. **Set up Ollama on Windows**

   Follow these steps to install and configure Ollama on your Windows machine:

   ### ✅ 1. **Install Ollama**
   Open **PowerShell as Administrator** and run:

   ```powershell
   Invoke-WebRequest https://ollama.com/download/OllamaSetup.exe -OutFile "$env:TEMP\OllamaSetup.exe"
   Start-Process "$env:TEMP\OllamaSetup.exe"
   ```

   > This downloads and launches the installer. Follow the GUI prompts to complete.

   ### 📦 2. **Verify Installation**
   After install, check version:
   ```bash
   ollama --version
   ```

   ### 📥 3. **Pull Required Models**
   If you want the same models as your home PC:

   ```bash
   ollama pull llama3.2
   ollama pull mxbai-embed-large
   ```

   You can also list available models:
   ```bash
   ollama list
   ```

   ### 🧠 4. **Run a Model**
   To start using a model:
   ```bash
   ollama run llama3.2
   ```

   You'll get an interactive prompt. Type your queries directly.

   ### 🔄 5. **Optional: Export from Home PC**
   If your university PC has limited internet, you can copy models from your home PC:

   - Models are stored in:
     ```
     C:\Users\<YourUser>\.ollama\models
     ```
   - Copy the entire `.ollama\models` folder to the same location on the lab PC.

   Then restart Ollama service:
   ```bash
   ollama run llama3.2
   ```

5. **Start Ollama service**

   Make sure Ollama is running before starting the chatbot:

   ```bash
   ollama serve
   ```

   This command starts the Ollama service in the background. Keep this terminal window open while using the chatbot.

## Running the Application

1. **Start the development server**

   ```bash
   npm run dev
   ```

2. **Open your browser**

   Navigate to `http://localhost:5173` to use the chatbot.

## How to Use

1. **Select a model**

   Use the dropdown menu at the top to choose between:
   - Llama 3.2 (Ollama) - Runs locally on your machine
   - Gemini (Google AI) - Uses Google's cloud API

2. **Start chatting**

   Type your message in the input field at the bottom and press Enter or click the Send button.

3. **View responses**

   The chatbot will respond based on the selected model. Each response shows which model generated it.

4. **Continue the conversation**

   The chatbot maintains the entire conversation history, so you can ask follow-up questions.

## Troubleshooting

### Model Selector Shows Only White

If the model selector dropdown appears white without text:

1. Ensure you've properly installed all dependencies with `npm install`
2. Check that your browser isn't blocking any scripts
3. Try refreshing the page

### Ollama Connection Issues

If you encounter errors when using the Llama3.2 model:

1. Verify Ollama is running: `ollama serve`
2. Check that the Llama3.2 model is installed: `ollama list`
3. Ensure no firewall is blocking port 11434

### Gemini API Issues

If you encounter errors when using the Gemini model:

1. Verify your API key is correctly set in `.env.local`
2. Check that you haven't exceeded the free tier quota
3. Ensure your API key is valid and active

### Build Issues

If you encounter any build issues:

1. Delete the `node_modules` folder and `package-lock.json`
2. Run `npm install` again
3. Try running `npm run dev` once more
## License

This project is licensed under the MIT License.