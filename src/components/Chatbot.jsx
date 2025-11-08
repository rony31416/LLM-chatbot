import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ModelSelector from './ModelSelector';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('llama3.2');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let responseText = '';
      
      if (selectedModel === 'llama3.2') {
        // Format conversation history for Ollama
        const conversationHistory = messages.map(msg => 
          `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`
        ).join('\n');

        const prompt = `${conversationHistory}\nUser: ${input}\nAssistant:`;

        const response = await axios.post('http://localhost:11434/api/generate', {
          model: 'llama3.2',
          prompt: prompt,
          stream: false
        });

        responseText = response.data.response;
      } else {
        // Use Gemini API
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        // Format conversation history for Gemini
        const history = messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));
        
        const chat = model.startChat({ history });
        const result = await chat.sendMessage(input);
        responseText = result.response.text();
      }

      const botMessage = { 
        text: responseText, 
        sender: 'bot',
        model: selectedModel
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: `Sorry, I'm having trouble responding right now. (${selectedModel === 'llama3.2' ? 'Ollama' : 'Gemini'} error)`, 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <div className="border border-gray-300 bg-white p-4 rounded-t-xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">Multi-Model Chatbot</h1>
            <p className="text-gray-600">Powered by Ollama & Google AI</p>
          </div>
          <div className="mt-2 md:mt-0">
            <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-white p-4 shadow-inner border border-gray-300">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-lg">Start a conversation!</p>
            <p className="mt-2">Select a model and send a message</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-xl border ${
                  msg.sender === 'user' 
                    ? 'border-black bg-white text-black rounded-br-none' 
                    : 'border-gray-300 bg-white text-black rounded-bl-none'
                }`}
              >
                {msg.text}
                {msg.sender === 'bot' && (
                  <div className="text-xs text-gray-500 mt-1">
                    {msg.model === 'llama3.2' ? 'Llama 3.2' : 'Gemini'}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="border border-gray-300 bg-white px-4 py-2 rounded-xl rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="border border-gray-300 bg-white p-4 rounded-b-xl shadow-sm">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:ring-1 focus:ring-gray-300"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="border border-gray-300 bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;