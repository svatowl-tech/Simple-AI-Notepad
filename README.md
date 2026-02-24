# Polza AI Text Editor

A modern, responsive Progressive Web App (PWA) text editor with AI-powered text improvement capabilities. Built with React, Vite, Tailwind CSS, and Tiptap.

## ✨ Features

- **Rich Text Editing**: Full-featured editor powered by Tiptap (bold, italic, headings, lists, tables).
- **AI Integration**: Improve your text using Polza.ai models (Qwen3, Llama 4, Nova Lite, Gemini 2.0, Mistral).
- **Smart Context**: Select specific text to improve, use the `[[POLZA_MARKER]]` to improve text after the marker, or improve the entire document.
- **Offline & Local Storage**: Your document and settings are automatically saved locally in your browser.
- **Export Options**: Export your work to `.docx` or `.txt` formats.
- **Mobile-First Design**: Fully responsive UI with a mobile-optimized toolbar and sidebar.
- **Dark Mode**: Built-in dark and light themes for comfortable writing.

## 🚀 Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS v4
- **Editor**: Tiptap (ProseMirror)
- **Icons**: Lucide React
- **Export**: docx.js, file-saver

## 🛠️ Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/polza-editor.git
   cd polza-editor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## 🌐 Deployment to Vercel

This project is fully configured for seamless deployment on Vercel.

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/polza-editor)

### Option 2: Vercel CLI

1. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Run the deploy command from the project root:
   ```bash
   vercel
   ```
3. Follow the prompts to link your project and deploy.

### Option 3: GitHub Integration

1. Push your code to a GitHub repository.
2. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
3. Click **Add New...** > **Project**.
4. Import your GitHub repository.
5. Vercel will automatically detect the Vite framework.
6. Click **Deploy**.

*Note: The `vercel.json` file is already included to handle Single Page Application (SPA) routing.*

## ⌨️ Keyboard Shortcuts

- `Alt + Enter`: Trigger AI text improvement.
- Standard text editor shortcuts (`Ctrl+B`, `Ctrl+I`, `Ctrl+Z`, etc.) are supported.

## 📝 License

MIT
