import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import ChatService from '../apis/chat';

const Chatbot = () => {
  useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Assalamu Alaikum! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const data = await ChatService.getChatHistory();
      
      if (data.success && data.data.messages.length > 0) {
        setMessages(data.data.messages);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const sendMessage = async (message) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to use the chatbot');
        return;
      }

      const data = await ChatService.sendMessage(message);
      
      if (data.success) {
        // Add AI response to messages
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: data.data.message }
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error(error.message || 'Failed to send message');
      
      // Add error message to chat
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "I apologize, but I'm having trouble responding right now. Please try again later." }
      ]);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    setInput("");
    setLoading(true);
    
    // Add user message immediately
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    
    // Send message to backend
    await sendMessage(userMessage);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'white' }}>
      <Navbar />
      {/* Image at the top */}
      <div className="w-full relative">
        <img 
          src="/images/3.webp"
          alt="Islamic Background"
          className="w-full object-cover"
          style={{ 
            height: '677px',
            filter: 'brightness(0.7)',
            marginTop: '64px' // To account for navbar height
          }}
        />
        
        {/* Left blur overlay */}
        <div className="absolute inset-y-0 left-0 w-[30%] z-[1]" 
          style={{
            background: 'linear-gradient(to right, rgba(5, 81, 96, 0.8) 0%, transparent 100%)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)'
          }}>
        </div>
        
        {/* Right blur overlay */}
        <div className="absolute inset-y-0 right-0 w-[30%] z-[1]"
          style={{
            background: 'linear-gradient(to left, rgba(5, 81, 96, 0.8) 0%, transparent 100%)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)'
          }}>
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ marginTop: '32px', zIndex: '2' }}>
          <div className="hero-badge" style={{
            display: 'inline-block',
            background: '#e0c33e',
            color: '#1a2530',
            fontSize: '0.75rem',
            fontWeight: '600',
            padding: '0.35rem 0.9rem',
            borderRadius: '20px',
            marginBottom: '1.2rem',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            boxShadow: '0 4px 12px rgba(224, 195, 62, 0.3)',
            animation: 'pulse-badge 2s infinite'
          }}>
            Islamic Knowledge
          </div>
          <h1 className="text-5xl font-extrabold drop-shadow-lg mb-6" style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #e0c33e 50%, #ffffff 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            display: 'inline-block',
            animation: 'titleGlow 4s ease-in-out infinite',
            backgroundSize: '200% auto',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            textShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
          }}>Islamic Chatbot</h1>
          <p className="text-white text-lg max-w-2xl text-center px-4">
            Ask questions about Islam and get authentic answers from our AI-powered chatbot
          </p>
        </div>
        
        {/* Scroll Indicator */}
        <div className="hero-scroll-indicator" style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          zIndex: '3',
          animation: 'bounce 2s infinite',
          cursor: 'pointer'
        }}
        onClick={() => {
          document.querySelector('main').scrollIntoView({ behavior: 'smooth' });
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRight: '3px solid #e0c33e',
            borderBottom: '3px solid #e0c33e',
            transform: 'rotate(45deg)'
          }}></div>
          <div style={{
            fontSize: '0.8rem',
            color: '#e0c33e',
            fontWeight: '500',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>Scroll</div>
        </div>

        {/* Add CSS animations */}
        <style jsx>{`
          @keyframes pulse-badge {
            0% {
              transform: scale(1);
              box-shadow: 0 5px 15px rgba(224, 195, 62, 0.3);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 5px 20px rgba(224, 195, 62, 0.5);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 5px 15px rgba(224, 195, 62, 0.3);
            }
          }
          
          @keyframes titleGlow {
            0%, 100% {
              background-position: 0% 50%;
              filter: brightness(1);
            }
            50% {
              background-position: 100% 50%;
              filter: brightness(1.1);
            }
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0) translateX(-50%);
            }
            40% {
              transform: translateY(-10px) translateX(-50%);
            }
            60% {
              transform: translateY(-5px) translateX(-50%);
            }
          }
        `}</style>
      </div>
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-16 pb-8">
        <div className="w-full max-w-6xl h-[85vh] flex flex-col shadow-lg rounded-xl overflow-hidden bg-white border border-gray-200 mx-auto mt-12" style={{ boxShadow: '0 8px 20px rgba(5, 81, 96, 0.1) ' }}>
          {/* Chat Header */}
          <div className="text-white px-6 py-4 font-semibold text-lg flex items-center gap-3" style={{ background: '#055160' }}>
            <span role="img" aria-label="Chatbot">💬</span>Islamic Chatbot
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3" style={{ background: 'rgba(5, 81, 96, 0.02)' }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2.5 rounded-lg max-w-[80%] text-base
                    ${msg.role === "user"
                      ? "text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"}
                  `}
                  style={msg.role === "user" ? { background: '#055160' } : {}}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-2.5 rounded-lg bg-white text-gray-800 border border-gray-200 rounded-bl-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Input */}
          <form onSubmit={handleSend} className="border-t border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none text-base bg-white placeholder-gray-500"
                style={{ focusRingColor: '#055160' }}
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className={`text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-300 hover:transform hover:-translate-y-0.5 ${
                  loading || !input.trim() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                style={{ 
                  background: loading || !input.trim() ? '#6b7280' : '#055160',
                  boxShadow: '0 4px 12px rgba(5, 81, 96, 0.2)'
                }}
                onMouseEnter={(e) => {
                  if (!loading && input.trim()) {
                    e.target.style.background = '#044352';
                    e.target.style.boxShadow = '0 6px 16px rgba(5, 81, 96, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && input.trim()) {
                    e.target.style.background = '#055160';
                    e.target.style.boxShadow = '0 4px 12px rgba(5, 81, 96, 0.2)';
                  }
                }}
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Chatbot;
