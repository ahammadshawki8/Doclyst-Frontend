# 🏥 Doclyst - Medical Report Simplified

> Doclyst turns complex medical reports into clear, human-readable explanations with safety alerts in under 30 seconds.

## 🎯 What is Doclyst?

Doclyst helps patients understand their medical reports without panic. It translates complex medical jargon into simple, friendly language and flags when a doctor consultation is needed.

**This Is NOT:**
- A diagnosis app
- A health tracker
- A hospital system

**This Is:**
- A report simplifier
- A clarity tool
- A bridge to better doctor conversations

## ✨ Features

- **Multi-file Upload** — Upload multiple pages of your medical report (PDF, JPG, PNG)
- **AI-Powered Analysis** — Powered by Google Gemini for accurate medical term extraction
- **Plain English Explanations** — Complex results explained at a 5th-grade reading level
- **Safety Flagging** — Clear visual indicators (🟢 Normal, 🟡 Attention, 🔴 Urgent)
- **PDF Export** — Download a professional summary for offline reference
- **Mobile Responsive** — Works seamlessly on all devices
- **Privacy First** — Files are processed securely and not stored

## 🔁 User Flow

```
Landing → Upload → Processing → Results → Done
```

Simple. Linear. No accounts. No dashboards.

## 🛠️ Tech Stack

- **React 18** — UI framework
- **TypeScript** — Type safety
- **Vite** — Build tool & dev server
- **Tailwind CSS** — Styling (via CDN)
- **Lucide React** — Icons
- **Google Generative AI** — Medical report analysis
- **jsPDF** — PDF generation

## 📁 Project Structure

```
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   └── FeatureCard.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── Mascot.tsx
├── pages/
│   ├── LandingPage.tsx
│   ├── UploadPage.tsx
│   ├── ProcessingPage.tsx
│   └── ResultsPage.tsx
├── services/
│   ├── geminiService.ts
│   └── pdfGenerator.ts
├── App.tsx
├── index.tsx
├── types.ts
└── index.html
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/doclyst.git
cd doclyst

# Install dependencies
npm install

# Set up environment variables
# Create a .env file with your Gemini API key
GEMINI_API_KEY=your_api_key_here

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## 🖥️ Pages Overview

### 1. Landing Page
- App introduction with friendly mascot
- Clear value proposition
- Single CTA: "Upload Medical Report"

### 2. Upload Page
- Drag & drop or click to upload
- Multi-file support
- File list with remove option
- Accepted formats: PDF, JPG, PNG

### 3. Processing Page
- Animated loading states
- Progress messages:
  - "Reading your report..."
  - "Understanding medical terms..."
  - "Translating to plain English..."

### 4. Results Page
- **Status Banner** — Overall health status with color coding
- **Simple Summary** — Plain English explanation
- **Test Breakdown** — Individual test results with:
  - Test name
  - Value (color-coded)
  - Normal range
  - Simple explanation
- **Disclaimer** — Always visible legal notice
- **Download PDF** — Export summary for offline use

## 🎨 Design System

### Colors
- **Mint** — Primary brand color (#14b8a6)
- **Cream** — Background (#fdfbf7)
- **Lavender** — Accent (#a78bfa)
- **Slate** — Text colors

### Typography
- **Quicksand** — Headings
- **Nunito** — Body text

## ⚠️ Important Disclaimers

Doclyst does **NOT** provide medical advice. All explanations are for informational purposes only. Users should always consult healthcare professionals for medical decisions.


## 📄 License

MIT License — See [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

---

Built with ❤️ for ERNIE AI Developer Challenge - Making healthcare information accessible to everyone.
