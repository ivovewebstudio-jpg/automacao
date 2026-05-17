/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  CheckCircle2, 
  MessageCircle, 
  Instagram, 
  Send, 
  Zap, 
  BarChart3, 
  Users, 
  ArrowRight,
  Menu,
  X,
  PlayCircle,
  ShieldCheck,
  Globe
} from "lucide-react";
import { useState } from "react";
import React from "react";
import { useAuth } from "./lib/AuthContext";
import { LeadService } from "./lib/leadService";
import ChatWidget from "./components/ChatWidget";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, login, logout, loading } = useAuth();
  
  // Lead form state
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleCaptureLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      login();
      return;
    }

    setIsSubmitting(true);
    try {
      await LeadService.captureLead({
        name: leadName,
        email: leadEmail,
        source: "Website Contact Form"
      });
      setSubmitStatus("success");
      setLeadName("");
      setLeadEmail("");
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="text-white w-5 h-5 fill-current" />
              </div>
              <span className="text-xl font-bold font-display tracking-tight text-slate-900">
                I9<span className="text-primary">webstudio</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Funcionalidades</a>
              <a href="#solutions" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Soluções</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Preços</a>
              <a href="#resources" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Recursos</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-slate-600">Olá, {user.displayName?.split(' ')[0]}</span>
                  <button onClick={logout} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-500 transition-colors">Sair</button>
                </div>
              ) : (
                <button onClick={login} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Entrar</button>
              )}
              {!user && (
                <button onClick={login} className="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-full hover:bg-blue-600 transition-all shadow-lg shadow-blue-200">
                  Começar Grátis
                </button>
              )}
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary rounded-md">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-b border-slate-100 px-4 py-6"
          >
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-base font-medium text-slate-600">Funcionalidades</a>
              <a href="#solutions" className="text-base font-medium text-slate-600">Soluções</a>
              <a href="#pricing" className="text-base font-medium text-slate-600">Preços</a>
              <button className="w-full px-5 py-3 text-sm font-semibold text-white bg-primary rounded-xl">
                Começar Grátis
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-6 border border-blue-100 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Plataforma nº 1 de Chat Marketing
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-slate-900 mb-6 md:mb-8 leading-[1.1] tracking-tight">
                Engaje seus clientes <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">instantaneamente e automaticamente.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed font-sans px-4 sm:px-0">
                Aumente suas vendas e construa relacionamentos mais fortes usando automação baseada em IA para Instagram, WhatsApp e Facebook.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0">
                <button 
                  onClick={user ? () => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }) : login}
                  className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 text-base md:text-lg font-bold text-white bg-primary rounded-full hover:bg-blue-600 transition-all shadow-xl shadow-blue-200 hover:-translate-y-1 active:scale-95"
                >
                  {user ? "Gerenciar Leads" : "Começar Grátis"}
                </button>
                <button className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 text-base md:text-lg font-bold text-slate-900 bg-white border-2 border-slate-100 rounded-full hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                  <PlayCircle className="w-6 h-6 text-primary" />
                  Ver Demo
                </button>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/50 bg-slate-50">
               <img 
                src="./assets/images/i9webstudio_dashboard_hero_1778974385926.png" 
                alt="I9webstudio Dashboard" 
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none"></div>
            </div>
            
            {/* Floating elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -right-6 hidden lg:block bg-white p-5 rounded-2xl shadow-2xl border border-slate-100 max-w-[240px]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center">
                  <Users className="text-accent w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Novos Leads</div>
                  <div className="text-2xl font-bold text-slate-900 tracking-tight">+1.429</div>
                </div>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 2, delay: 1 }}
                  className="h-full bg-accent"
                />
              </div>
              <div className="mt-3 text-[10px] text-slate-400 font-medium">Atualizado há 2 min</div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 hidden lg:block bg-white p-6 rounded-2xl shadow-2xl border border-slate-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="text-primary w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Conversa iniciada</div>
                  <div className="text-xs text-slate-500">João: "Quero atualizar meu plano"</div>
                </div>
                <div className="ml-4 px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded">AO VIVO</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Confiado por marcas modernas</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 opacity-40 grayscale items-center justify-items-center">
            <div className="text-2xl font-black italic tracking-tighter">NIKE</div>
            <div className="text-2xl font-bold flex items-center gap-1">
              <div className="w-6 h-6 bg-slate-900 rounded-sm"></div> SHOPY
            </div>
            <div className="text-3xl font-serif font-bold">VOGUE</div>
            <div className="text-2xl font-mono font-black">VOLVO</div>
            <div className="text-2xl font-sans font-extrabold tracking-widest uppercase">Sony</div>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section id="solutions" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6 md:mb-8 leading-[1.1]">
                Onde seus clientes <br /> já estão conversando.
              </h2>
              <p className="text-base md:text-lg text-slate-600 mb-8 md:mb-10 leading-relaxed">
                A I9webstudio integra-se diretamente com os aplicativos de mensagens mais populares do mundo, para você alcançar seu público onde quer que ele esteja.
              </p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4 md:space-y-6"
              >
                {[
                  { icon: <Instagram className="text-pink-600 w-5 h-5 md:w-6 md:h-6" />, title: "Automação de Direct no Instagram", desc: "Transforme comentários em clientes automaticamente." },
                  { icon: <MessageCircle className="text-green-600 w-5 h-5 md:w-6 md:h-6" />, title: "Marketing no WhatsApp", desc: "Escale conversas de vendas personalizadas instantaneamente." },
                  { icon: <Send className="text-blue-600 w-5 h-5 md:w-6 md:h-6" />, title: "Facebook Messenger", desc: "Automação clássica do FB para geração de leads moderna." },
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
                    className="group p-4 md:p-6 rounded-xl md:rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-4 md:gap-5">
                      <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base md:text-lg mb-1">{item.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative mt-8 md:mt-12 lg:mt-0"
            >
              <div className="grid grid-cols-2 gap-4 md:gap-6 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  className="aspect-[4/5] rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-purple-600 to-pink-500 p-6 md:p-8 flex flex-col justify-end shadow-2xl shadow-purple-200"
                >
                  <Instagram className="text-white w-8 h-8 md:w-10 md:h-10 mb-4 md:mb-6" />
                  <h3 className="text-lg md:text-2xl font-bold text-white leading-tight">Crescimento <br />no Instagram</h3>
                </motion.div>
                <div className="space-y-4 md:space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    className="aspect-square rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-green-500 to-emerald-600 p-6 md:p-8 flex flex-col justify-end shadow-2xl shadow-green-200"
                  >
                    <MessageCircle className="text-white w-8 h-8 md:w-10 md:h-10 mb-3 md:mb-4" />
                    <h3 className="text-base md:text-xl font-bold text-white">Vendas no WhatsApp</h3>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    className="aspect-square rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-blue-500 to-cyan-500 p-6 md:p-8 flex flex-col justify-end shadow-2xl shadow-blue-200"
                  >
                    <Send className="text-white w-8 h-8 md:w-10 md:h-10 mb-3 md:mb-4" />
                    <h3 className="text-base md:text-xl font-bold text-white">Facebook Messenger</h3>
                  </motion.div>
                </div>
              </div>
              {/* Decorative circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50 rounded-full -z-10 blur-3xl opacity-50"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/3"></div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-display font-bold mb-8 tracking-tight"
            >
              Tudo o que você precisa para <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent italic">crescer e escalar.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed"
            >
              Nós fornecemos as ferramentas. Você fornece a visão. Juntos, construímos automação que parece humana.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Zap className="text-primary" />, title: "Construtor de Fluxo Visual", desc: "Construa caminhos visualmente com lógica condicional, tempos de espera e tags dinâmicas." },
              { icon: <BarChart3 className="text-accent" />, title: "Análise de Conversão", desc: "Mergulhe profundamente em seu churn, retenção e ROI exato de cada chat automatizado." },
              { icon: <Users className="text-highlight" />, title: "CRM Inteligente", desc: "Automatize a segmentação de usuários com base no comportamento, histórico de compras e intenção." },
              { icon: <ShieldCheck className="text-blue-400" />, title: "Conformidade com LGPD", desc: "Seus dados e os dados de seus clientes são gerenciados com segurança de nível institucional." },
              { icon: <Globe className="text-indigo-400" />, title: "Suporte Multi-idioma", desc: "Alcance clientes em seu idioma nativo com fluxos de tradução integrados com IA." },
              { icon: <CheckCircle2 className="text-emerald-400" />, title: "Testes A/B", desc: "Compare diferentes estratégias de mensagens diretamente dentro da plataforma." },
            ].map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feat.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture Form Section */}
      <section id="contact-form" className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Deseja uma consultoria?</h2>
              <p className="text-slate-500">Deixe seus dados e nossa equipe de especialistas entrará em contato.</p>
            </div>

            <form onSubmit={handleCaptureLead} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nome Completo</label>
                  <input 
                    type="text" 
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">E-mail Corporativo</label>
                  <input 
                    type="email" 
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="email@empresa.com"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : user ? "Enviar Dados" : "Entrar com Google para Enviar"}
              </button>

              {submitStatus === "success" && (
                <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Lead capturado com sucesso! Entraremos em contato.</span>
                </div>
              )}
              {submitStatus === "error" && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="font-medium">Erro ao salvar. Verifique se você está logado.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary via-blue-600 to-indigo-700 rounded-[2rem] md:rounded-[3.5rem] p-10 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-blue-200"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-32 md:w-80 h-32 md:h-80 border-2 md:border-4 border-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 md:w-60 h-24 md:h-60 border-2 md:border-4 border-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-7xl font-display font-bold text-white mb-6 md:mb-10 leading-tight">
                Pronto para dobrar <br /> seu negócio?
              </h2>
              <p className="text-blue-50 text-base md:text-xl mb-8 md:mb-12 max-w-2xl mx-auto opacity-90 leading-relaxed font-medium">
                Comece hoje e veja por que milhões de empreendedores <br className="hidden md:block" /> confiam na I9webstudio para suas necessidades de automação.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
                <button className="w-full sm:w-auto px-10 md:px-12 py-5 md:py-6 text-xl md:text-2xl font-bold text-primary bg-white rounded-full hover:bg-slate-50 transition-all shadow-2xl transform hover:scale-105 active:scale-95">
                  Comece Grátis
                </button>
                <div className="flex items-center gap-2 md:gap-3 text-white/90 text-sm md:text-base">
                  <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="font-semibold">Sem cartão necessário • LGPD</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-16 mb-24">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Zap className="text-white w-6 h-6 fill-current" />
                </div>
                <span className="text-2xl font-bold font-display tracking-tight text-slate-900">
                  I9<span className="text-primary">webstudio</span>
                </span>
              </div>
              <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-sm">
                Capacitando empresas a construir relacionamentos profundos com clientes em escala por meio da automação de chat marketing.
              </p>
              <div className="flex gap-4">
                {[Instagram, MessageCircle, Send, Globe].map((Icon, i) => (
                  <div key={i} className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all cursor-pointer">
                    <Icon className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold text-slate-900 mb-8 uppercase tracking-widest text-xs">Produto</h4>
              <ul className="space-y-5 text-slate-500 font-medium">
                <li className="hover:text-primary cursor-pointer transition-colors">Instagram DM</li>
                <li className="hover:text-primary cursor-pointer transition-colors">WhatsApp</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Messenger</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Construtor de Automação</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Planos de Preços</li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold text-slate-900 mb-8 uppercase tracking-widest text-xs">Recursos</h4>
              <ul className="space-y-5 text-slate-500 font-medium">
                <li className="hover:text-primary cursor-pointer transition-colors">Histórias de Sucesso</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Blog de Marketing</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Academia de Vídeo</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Centro de Suporte</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Docs da API</li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold text-slate-900 mb-8 uppercase tracking-widest text-xs">Empresa</h4>
              <ul className="space-y-5 text-slate-500 font-medium">
                <li className="hover:text-primary cursor-pointer transition-colors">Sobre Nós</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Carreiras</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Parceiros</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Kit de Mídia</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Contato</li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-slate-100 gap-8">
            <p className="text-slate-400 font-medium italic">Feito com cuidado pela equipe I9webstudio</p>
            <div className="flex flex-wrap justify-center items-center gap-10 text-sm text-slate-400 font-medium">
              <span className="hover:text-slate-900 cursor-pointer transition-colors">Política de Privacidade</span>
              <span className="hover:text-slate-900 cursor-pointer transition-colors">Termos de Serviço</span>
              <span className="hover:text-slate-900 cursor-pointer transition-colors flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Português (Brasil)
              </span>
            </div>
          </div>
        </div>
      </footer>
      <ChatWidget />
    </div>
  );
}
