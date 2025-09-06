import { defineConfig, loadEnv } from "vite";
import type { ViteDevServer } from "vite";
import type { IncomingMessage, ServerResponse } from "node:http";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
  server: {
    host: true,
    port: 8080,
    // Dev-only middleware to handle /api/llm to avoid 404 when not running an Edge platform locally
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: any) => {
        const url = (req.url || "").split("?")[0];
        console.log(`[dev-llm] incoming ${req.method} ${url}`);
        if (!url.startsWith("/api/llm")) return next();
        if (req.method === "GET") {
          console.log(`[dev-llm] health check`);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ status: "ok", message: "LLM dev endpoint reachable. Use POST to query." }));
          return;
        }
        if (req.method !== "POST") {
          console.warn(`[dev-llm] method not allowed: ${req.method}`);
          res.statusCode = 405;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        try {
          // Read body
          const chunks: Buffer[] = [];
          await new Promise<void>((resolve, reject) => {
            req.on("data", (c: Buffer | string) => chunks.push(Buffer.from(c)));
            req.on("end", () => resolve());
            req.on("error", (e: Error) => reject(e));
          });
          const raw = Buffer.concat(chunks).toString("utf8");
          const body = raw ? JSON.parse(raw) : {};
          const { prompt, provider = "openai", model } = body || {};

          if (!prompt || typeof prompt !== "string") {
            console.warn(`[dev-llm] invalid prompt`);
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Invalid prompt" }));
            return;
          }

          const baseURL = provider === "openrouter" ? "https://openrouter.ai/api/v1" : "https://api.openai.com/v1";
          const resolvedModel = model || (provider === "openrouter" ? "openai/gpt-4o-mini" : "gpt-4o-mini");

          const apiKey = provider === "openrouter" ? env.OPENROUTER_API_KEY : env.OPENAI_API_KEY;
          if (!apiKey) {
            console.error(`[dev-llm] missing API key for provider ${provider}`);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Server: Missing API key. Set OPENAI_API_KEY or OPENROUTER_API_KEY." }));
            return;
          }

          const headers: Record<string, string> = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          };
          if (provider === "openrouter") {
            headers["HTTP-Referer"] = "http://localhost:8080";
            headers["X-Title"] = "KisanAI";
          }

          console.log(`[dev-llm] calling ${baseURL}/chat/completions with model ${resolvedModel}`);
          const upstream = await fetch(`${baseURL}/chat/completions`, {
            method: "POST",
            headers,
            body: JSON.stringify({
              model: resolvedModel,
              messages: [
                { role: "system", content: "You are an AI assistant for agriculture. Always reply in concise JSON if asked." },
                { role: "user", content: prompt },
              ],
              temperature: 0.3,
            }),
          });

          if (!upstream.ok) {
            const errText = await upstream.text();
            console.error(`[dev-llm] upstream error ${upstream.status}: ${errText}`);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: errText || "Upstream error" }));
            return;
          }

          const data: any = await upstream.json();
          const content = data?.choices?.[0]?.message?.content ?? "";
          console.log(`[dev-llm] success, returning content length ${content?.length || 0}`);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ content }));
        } catch (e: any) {
          console.error(`[dev-llm] exception:`, e);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: e?.message || "Unknown error" }));
        }
      });
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  };
});
