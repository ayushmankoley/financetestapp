# 🔮 Kautilya – AI-Powered Financial Planning SaaS

Kautilya is an intelligent financial planning SaaS application that offers personalized investment insights through AI-driven predictions and real-time data analytics. Built using **Next.js**, **TypeScript**, and **Flask**, it delivers tailored financial advisory and investment suggestions based on user input and market behavior.

---

## 🚀 Features

- AI-driven financial strategy using Gemini API
- Personalized input forms with structured data processing
- Tailored asset allocation and risk assessment
- LSTM-based market prediction via Python & Flask
- Real-time stock data visualization using Recharts
- Smooth routing and UI flow with Next.js + TypeScript

---

## ⚙️ Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Flask (for LSTM integration)
- **APIs**: Gemini API, Financial/Stock Data APIs
- **Visualization**: Recharts
- **Machine Learning**: LSTM (Time-series Forecasting)

---

## 📂 Project Structure (Simplified)

```
kautilya/
│
├── pages/                      # Next.js routing pages
│   ├── index.tsx              # Landing page
│   ├── planner.tsx            # Financial planner form
│   ├── advisory.tsx           # Advisory result
│   └── analysis.tsx           # Option analysis & charting
│
├── components/                # UI components
├── utils/                     # Data processing functions
├── types/                     # TypeScript types and interfaces
├── styles/                    # Tailwind/global styles
├── public/                    # Static files
├── flask-backend/             # Python LSTM Flask API
└── ...
```

---

## ⚒️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/kautilya.git
cd kautilya
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the Next.js App

```bash
npm run dev
# Open http://localhost:3000
```

---

## 🧠 System Flow

### 🔍 Financial Planner

- User inputs → Structured & validated
- Gemini API call with prompt engineering
- Data is processed and mapped to a schematic overview
- Routes to `/advisory`

### 💼 Financial Advisory

- Gemini API call (stage 2)
- Allocation options generated with weights
- Each option is clickable → navigates to `/analysis`

### 📊 Option Analysis

- LSTM-based prediction from Flask API
- Stock market API fetches live data
- Volatility + risk calculations
- Recharts for visual analysis

---

## 🌐 Environment Variables

Create a `.env.local` file and configure:

```
GEMINI_API_KEY=your_key_here
```

---

## 🧪 Flask API (LSTM Model)

Navigate to backend folder and run:

```bash
cd flask-backend
pip install -r requirements.txt
python app.py
```

Ensure it’s running at `http://localhost:5000`

---

## 🧪 Useful Scripts

- `npm run dev` – Run the app in development
- `npm run build` – Production build
- `npm run start` – Start production server
- `npm run lint` – Lint the code
- `npm run type-check` – TypeScript validation

---

## 🙌 Contribution

Contributions are welcome! Fork the repo, make changes, and submit a pull request. For major changes, open an issue first.

---

## 📄 License

MIT License © 2025 [Kautilya]

---

## 🌟 Demo & Walkthrough
 
🎥 [Watch the Full Video Walkthrough](https://youtu.be/hlO5l18EsUs)

---
