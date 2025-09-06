# KisanAI - Smart Agriculture Platform

An AI-powered platform for crop yield prediction, smart irrigation, fertilizer recommendations, and pest control. Helping Indian farmers increase productivity through data-driven agricultural insights.

## Features

- 🌾 **Crop Yield Prediction** - AI-powered predictions for better harvest planning
- 💧 **Smart Irrigation** - Optimized water usage recommendations
- 🌱 **Fertilizer Recommendations** - Smart fertilizer suggestions based on soil and weather conditions
- 🐛 **Pest Detection & Control** - AI-powered pest identification and treatment recommendations
- 🤖 **AI Farming Assistant** - Chat with our AI assistant for instant farming advice
- 📊 **Farm Analytics & Reports** - Detailed analytics and progress tracking
- 🧪 **Soil Health Analysis** - Comprehensive soil testing and health monitoring

## Technologies Used

This project is built with:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - Modern UI library
- **shadcn/ui** - Beautiful and accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd sih-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

### Environment Variables

This project requires API keys for the AI provider used by the Edge API route at `api/llm.ts`.

1. Create a local env file by copying the example:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and set your secrets:
```
OPENAI_API_KEY=your_openai_key
OPENROUTER_API_KEY=your_openrouter_key
```

Notes:
- The Edge function does not import `dotenv`. Use your dev platform/CLI (e.g., Vercel, Netlify) to load `.env.local` automatically when running `dev`.
- Do not expose these keys in the client. Only the server-side API route should read them.

Deployment environment variables:
- Vercel: Project Settings → Environment Variables. Add `OPENAI_API_KEY` and/or `OPENROUTER_API_KEY`. For local dev, `vercel dev` loads `.env.local`.
- Netlify: Site Settings → Environment Variables. For local dev, `netlify dev` loads `.env`/`.env.local`.
- Cloudflare Workers: Use `wrangler secret put OPENAI_API_KEY` (and similarly for OpenRouter) or bindings in `wrangler.toml`. If using bindings (no `process.env`), adjust the API handler to read from the provided bindings.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Custom components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── main.tsx           # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Ministry of Agriculture & Farmers Welfare**  
*Powered by Artificial Intelligence for Indian Agriculture*