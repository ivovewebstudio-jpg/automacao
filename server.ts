import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini Setup
  const genAI = process.env.GEMINI_API_KEY 
    ? new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      }) 
    : null;

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", backend: "I9webstudio Express Server" });
  });

  // Example: AI Message Analysis (Backend Secret Logic)
  app.post("/api/analyze-message", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) return res.status(400).json({ error: "Mensagem é obrigatória" });

      if (!genAI) {
        return res.status(503).json({ error: "IA não configurada no servidor" });
      }

      const response = await genAI.models.generateContent({ 
        model: "gemini-3-flash-preview",
        contents: `Analise a seguinte mensagem de um cliente em potencial e sugira uma categoria (venda, suporte, elogio, crítica) e um tom de resposta adequado: "${message}"`
      });
      
      res.json({ analysis: response.text });
    } catch (error: any) {
      console.error("AI Analysis Error:", error);
      res.status(500).json({ error: "Falha na análise da mensagem" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted (Development Mode)");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static production build from /dist");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
