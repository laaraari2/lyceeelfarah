import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage, Language } from '../types';
import { IconChat, IconX, IconSend } from './Icons';

interface ChatWidgetProps {
  language: Language;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    // Initial greeting
    if (messages.length === 0) {
      const initialText = language === 'ar'
        ? "مرحباً! أنا المساعد الذكي لثانوية الفرح. كيف يمكنني مساعدتك اليوم؟"
        : "Bonjour! Je suis l'assistant IA du Lycée El Farah. Comment puis-je vous aider aujourd'hui?";

      setMessages([{
        role: 'model',
        text: initialText,
        timestamp: new Date()
      }]);
    }
  }, [language, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini([...messages, userMsg], input);
      setMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: new Date() }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`fixed bottom-6 ${language === 'ar' ? 'left-6' : 'right-6'} z-50 flex flex-col items-end`}>
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 h-[500px] flex flex-col mb-4 border border-gray-100 overflow-hidden transform transition-all duration-300 origin-bottom-right">
          {/* Header */}
          <div className="bg-yassamine-blue text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <h3 className="font-bold text-sm">
                {language === 'ar' ? 'مساعد الفرح الذكي' : 'Assistant El Farah AI'}
              </h3>
            </div>
            <button onClick={toggleChat} className="text-white hover:text-gray-200 transition">
              <IconX className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${msg.role === 'user'
                      ? 'bg-yassamine-blue text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                    }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap" style={{ unicodeBidi: 'plaintext' }}>{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex gap-1 items-center">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border focus-within:border-yassamine-blue focus-within:ring-1 focus-within:ring-yassamine-blue transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={language === 'ar' ? 'اكتب رسالتك...' : 'Écrivez votre message...'}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm outline-none text-gray-700"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="text-yassamine-blue hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <IconSend className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="bg-yassamine-blue hover:bg-blue-800 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group relative flex items-center justify-center"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
        <IconChat className="w-7 h-7" />
        <span className={`absolute ${language === 'ar' ? 'right-full mr-3' : 'left-full ml-3'} top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none`}>
          {language === 'ar' ? 'تحدث معنا' : 'Discutez avec nous'}
        </span>
      </button>
    </div>
  );
};

export default ChatWidget;