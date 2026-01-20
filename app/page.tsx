// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }
import Link from 'next/link'
import { ArrowRight, Database, Zap, BarChart3 } from 'lucide-react'
import { getStats } from '@/lib/kv'

export default async function HomePage() {
  const stats = await getStats()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome to ChainHub Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <Database className="w-8 h-8 text-primary-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.totalApps}</div>
          <div className="text-sm text-slate-400">Total Dapps</div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-primary-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.totalChains}</div>
          <div className="text-sm text-slate-400">Blockchains</div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 text-primary-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.totalCategories}</div>
          <div className="text-sm text-slate-400">Categories</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin"
            className="flex items-center justify-between p-4 glass-card hover:bg-slate-800/50 transition-colors group"
          >
            <div>
              <h3 className="font-semibold text-white mb-1">Manage Dapps</h3>
              <p className="text-sm text-slate-400">Create, edit, or delete dapps</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary-400 transition-colors" />
          </Link>

          <a
            href={process.env.FRONTEND_URL || 'http://localhost:3000'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 glass-card hover:bg-slate-800/50 transition-colors group"
          >
            <div>
              <h3 className="font-semibold text-white mb-1">View Frontend</h3>
              <p className="text-sm text-slate-400">See your changes live</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary-400 transition-colors" />
          </a>
        </div>
      </div>

      {/* API Info */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">API Endpoints</h2>
        <div className="space-y-2 text-sm font-mono">
          <div className="flex items-center space-x-3">
            <span className="text-green-400">GET</span>
            <span className="text-slate-300">/api/apps</span>
            <span className="text-slate-500">- List all dapps</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-400">GET</span>
            <span className="text-slate-300">/api/apps/[slug]</span>
            <span className="text-slate-500">- Get single dapp</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-blue-400">POST</span>
            <span className="text-slate-300">/api/apps</span>
            <span className="text-slate-500">- Create/update dapp</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-red-400">DELETE</span>
            <span className="text-slate-300">/api/apps/[slug]</span>
            <span className="text-slate-500">- Delete dapp</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-400">GET</span>
            <span className="text-slate-300">/api/stats</span>
            <span className="text-slate-500">- Platform statistics</span>
          </div>
        </div>
      </div>
    </div>
  )
}