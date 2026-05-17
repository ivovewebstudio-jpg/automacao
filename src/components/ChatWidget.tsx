import { useState } from "react";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, User } from "lucide-react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ text: string; isUser: boolean; isTyping?: boolean }[]>([
    { text: "Olá! Como podemos ajudar você hoje?", isUser: false }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isTyping) return;

    const userMsg = message.trim();
    setMessage("");
    
    // Add user message
    setChat(prev => [...prev, { text: userMsg, isUser: true }]);
    setIsTyping(true);
    
    try {
      const response = await fetch("/api/analyze-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });

      if (!response.ok) throw new Error("Falha na análise");

      const data = await response.json();
      
      setChat(prev => [...prev, { 
        text: `Nossa IA analisou sua mensagem: ${data.analysis}. Um especialista entrará em contato em breve para continuar o atendimento.`, 
        isUser: false 
      }]);
    } catch (error) {
      setChat(prev => [...prev, { 
        text: "Obrigado pelo contato! Estamos processando sua mensagem e retornaremos em breve.", 
        isUser: false 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="bg-primary p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold">IA I9webstudio</h4>
                  <div className="flex items-center gap-1.5 text-[10px] opacity-80 uppercase tracking-wider font-bold">
                    <span className={`w-1.5 h-1.5 rounded-full ${isTyping ? "bg-amber-400 animate-pulse" : "bg-green-400"}`}></span>
                    {isTyping ? "IA Analisando..." : "Online"}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {chat.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.isUser 
                      ? "bg-primary text-white rounded-tr-none shadow-md shadow-blue-100" 
                      : "bg-white text-slate-700 rounded-tl-none shadow-sm border border-slate-100"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex gap-1 items-center">
                    <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
              <input 
                type="text" 
                value={message}
                disabled={isTyping}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isTyping ? "Aguarde..." : "Como nossa IA pode ajudar?"}
                className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={isTyping}
                className="w-11 h-11 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-md shadow-blue-100 active:scale-95 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-300 hover:bg-blue-600 transition-all relative overflow-hidden group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-8 h-8" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <MessageCircle className="w-8 h-8" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-primary"></span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
