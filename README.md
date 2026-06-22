# Episode Status Checker

Search any show or anime and instantly find out if the latest episode has aired yet.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Add your Anthropic API key**
   ```bash
   cp .env.example .env
   ```
   Then open `.env` and replace `your_api_key_here` with your key from https://console.anthropic.com

3. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173

## Build for production

```bash
npm run build
npm run preview
```
