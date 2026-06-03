import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles, AlertCircle } from 'lucide-react';
import { UserProgress } from '../types';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface FloatingChatBotProps {
  progress: UserProgress;
}

export default function FloatingChatBot({ progress }: FloatingChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "👋 Greetings, student! I am the **Dezmils Software Academy AI Mentor**, tuned by Principal Instructor Ezra. \n\nI can answer questions regarding our curriculum, layout principles, and active portfolio milestones! How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNewMessage, setHasNewMessage] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to last message when isOpen or messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Turn off new message indicator when opened or when messages change
  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    setError(null);
    const newMsg: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (!response.ok) {
        throw new Error('Could not synchronize message. Academy server is responding with anomalies.');
      }

      const data = await response.json();
      if (data.success && data.text) {
        setMessages(prev => [...prev, { role: 'model', content: data.text }]);
      } else {
        throw new Error(data.message || 'Unknown response anomaly.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Network anomaly encountered.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectSuggestedPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  const suggestedPrompts = [
    { label: "🧠 Practice Tips", text: "What is the best way to practice coding at Dezmils Software Academy?" },
    { label: "📚 Describe Curriculum", text: "What are the levels and tracks of training at Dezmils?" },
    { label: "💡 Flexbox layout tips", text: "Explain CSS Flexbox layout principles for junior developers" },
    { label: "⚛️ React hook basics", text: "Explain useState hook in reusable components" },
    { label: "🐍 Django REST Views", text: "Explain Django routing views and JsonResponse structure" }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="dezmils-floating-bot-container">
      {/* Chat Window Panel */}
      {isOpen && (
        <div 
          className="mb-3 w-80 md:w-96 h-[500px] bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden animate-fade-in"
          id="dezmils-chat-panel"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-ping" />
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <span className="font-bold text-sm block">Principal AI Mentor</span>
                <span className="text-[10px] text-orange-100 font-mono">Tuned: Ezra Live Context</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Close Panel"
              id="close-chat-widget"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Node Panel */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700" id="chat-messages-area">
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role !== 'user' && (
                  <div className="h-7 w-7 rounded-full bg-orange-600/30 border border-orange-500/30 flex items-center justify-center shrink-0">
                    <Bot className="h-3.5 w-3.5 text-orange-400" />
                  </div>
                )}
                <div 
                  className={`max-w-[78%] rounded-xl p-3 text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-orange-600 text-white font-medium rounded-tr-none' 
                      : 'bg-slate-800 text-slate-100 rounded-tl-none font-sans whitespace-pre-line'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="h-7 w-7 rounded-full bg-orange-600/30 border border-orange-500/30 flex items-center justify-center shrink-0">
                  <Bot className="h-3.5 w-3.5 text-orange-400 animate-pulse" />
                </div>
                <div className="bg-slate-800 text-slate-400 max-w-[78%] rounded-xl p-3 text-xs flex items-center gap-2 rounded-tl-none font-mono">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[10px]">Ezra analysing training guides...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg flex items-start gap-2 text-xxs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Prompts Layout Node */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 shrink-0 select-none">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5 text-left flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-orange-400" />
                Suggested Queries
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {suggestedPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectSuggestedPrompt(p.text)}
                    className="text-[10px] bg-slate-800 hover:bg-orange-950/40 hover:border-orange-500/40 text-slate-300 border border-slate-700 rounded px-2 py-1 transition-colors text-left font-sans cursor-pointer flex-shrink-0"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form Node */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2 shrink-0"
          >
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask our Principal Mentor..."
              className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 placeholder-slate-500 font-sans leading-relaxed"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="h-9 w-9 bg-orange-600 hover:bg-orange-700 text-white rounded-lg flex items-center justify-center cursor-pointer transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Post Question"
              id="send-chat-submit"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Bubble Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group h-14 w-14 rounded-full bg-gradient-to-br from-orange-600 to-orange-500 text-white flex items-center justify-center shadow-xl hover:shadow-orange-600/20 shadow-orange-950/20 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-orange-950/20"
        title="Ask Dezmils Software Academy Bot"
        id="toggle-dezmils-chatbot"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6 group-hover:rotate-6 transition-transform" />
        )}

        {/* Dynamic New Message Indicator Dot */}
        {hasNewMessage && !isOpen && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500 border-2 border-slate-900 text-[8px] font-bold text-white items-center justify-center">
              1
            </span>
          </span>
        )}
      </button>
    </div>
  );
}
