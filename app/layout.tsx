import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { Database, Home, Settings } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChainHub Admin - Content Management',
  description: 'Admin panel for managing ChainHub dapps directory',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex">
          {/* Sidebar */}
          <aside className="w-64 glass-card border-r border-slate-800/50 p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                ChainHub Admin
              </h1>
              <p className="text-sm text-slate-400 mt-1">Content Management</p>
            </div>

            <nav className="space-y-2">
              <Link
                href="/"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800/50 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/admin"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800/50 transition-colors"
              >
                <Database className="w-5 h-5" />
                <span>Manage Dapps</span>
              </Link>
            </nav>

            <div className="mt-8 p-4 glass-card">
              <p className="text-xs text-slate-500">
                Backend API running on port 3001
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Frontend: <span className="text-primary-400">localhost:3000</span>
              </p>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}