import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ModelSelector from './ModelSelector';
import './Chatbot.css';

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
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="chatbot-title">Multi-Model Chatbot</h1>
            <p className="chatbot-subtitle">Powered by Ollama & Google AI</p>
          </div>
          <div className="mt-4 md:mt-0">
            <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
          </div>
        </div>
      </div>
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="empty-state-title">Start a conversation!</p>
            <p className="empty-state-subtitle">Select a model and send a message</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message-wrapper ${msg.sender === 'user' ? 'user' : 'bot'}`}
            >
              <div className={`message-bubble ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                {msg.text}
                {msg.sender === 'bot' && (
                  <div className="model-tag">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    {msg.model === 'llama3.2' ? 'Llama 3.2' : 'Gemini'}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="message-wrapper bot">
            <div className="loading-bubble">
              <div className="loading-dots">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="message-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="send-button"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;