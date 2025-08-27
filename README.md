# Perla Jacinto Investor Portal

A professional investment management portal built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Professional Dashboard**: Clean, modern interface optimized for financial data
- **Payment Management**: Comprehensive fee tracking and payment status system
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark Mode Support**: Professional dark theme for extended use
- **Type Safety**: Built with TypeScript for robust development

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: Radix UI primitives with shadcn/ui
- **Icons**: Lucide React
- **Fonts**: Inter (sans-serif) and JetBrains Mono (monospace)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/your-username/perla-jacinto-investor-portal.git
cd perla-jacinto-investor-portal
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and design tokens
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── investor-portal.tsx # Main portal component
│   └── theme-provider.tsx # Dark mode provider
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── public/               # Static assets
\`\`\`

## Key Components

- **InvestorPortal**: Main dashboard component with payment tracking
- **Payment Status**: Real-time fee management and status tracking
- **Professional UI**: Financial-grade interface components

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy with zero configuration

### Other Platforms

Build the application:
\`\`\`bash
npm run build
npm start
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary to Perla Jacinto.

## Contact

For questions or support, please contact the development team.
\`\`\`

\`\`\`gitignore file="" isHidden
