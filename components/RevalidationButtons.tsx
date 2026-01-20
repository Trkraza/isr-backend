'use client'

import { useState } from 'react'
import { Zap, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { triggerFrontendRevalidation } from '@/lib/utils'

interface RevalidationButtonsProps {
  slug?: string
}

export default function RevalidationButtons({ slug }: RevalidationButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [envVars, setEnvVars] = useState<any>(null)

  const handleRevalidate = async (type: 'path' | 'tag', value: string, label: string) => {
    setLoading(label)
    setResult(null)

    const response = await triggerFrontendRevalidation(type, value)

    setLoading(null)
    setResult({
      type: response.success ? 'success' : 'error',
      message: response.message || (response.success ? 'Success' : 'Failed'),
    })

    // Clear result after 3 seconds
    setTimeout(() => setResult(null), 3000)
  }

  const handleCheckEnv = async () => {
    setLoading('env')
    setEnvVars(null)
    try {
      const res = await fetch('/api/check-env')
      const data = await res.json()
      setEnvVars(data)
    } catch (error) {
      setEnvVars({ error: 'Failed to fetch env vars' })
    }
    setLoading(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3">
          <Zap className="w-4 h-4 inline mr-2" />
          Spot Update (On-Demand Revalidation)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Trigger instant cache update on the frontend without waiting for time-based revalidation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Revalidate specific app page */}
        {slug && (
          <button
            onClick={() => handleRevalidate('path', `/apps/${slug}`, 'page')}
            disabled={loading !== null}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            {loading === 'page' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <span>Revalidate This Page</span>
          </button>
        )}

        {/* Revalidate all apps list */}
        <button
          onClick={() => handleRevalidate('path', '/apps', 'list')}
          disabled={loading !== null}
          className="btn-secondary flex items-center justify-center space-x-2"
        >
          {loading === 'list' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          <span>Revalidate Apps List</span>
        </button>

        {/* Revalidate homepage */}
        <button
          onClick={() => handleRevalidate('path', '/', 'home')}
          disabled={loading !== null}
          className="btn-secondary flex items-center justify-center space-x-2"
        >
          {loading === 'home' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          <span>Revalidate Homepage</span>
        </button>

        {/* Revalidate featured tag */}
        <button
          onClick={() => handleRevalidate('tag', 'featured-apps', 'featured')}
          disabled={loading !== null}
          className="btn-secondary flex items-center justify-center space-x-2"
        >
          {loading === 'featured' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          <span>Revalidate Featured</span>
        </button>
      </div>

      {/* Result Message */}
      {result && (
        <div
          className={`flex items-center space-x-2 p-3 rounded-lg ${
            result.type === 'success'
              ? 'bg-green-500/20 border border-green-500/50 text-green-400'
              : 'bg-red-500/20 border border-red-500/50 text-red-400'
          }`}
        >
          {result.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">{result.message}</span>
        </div>
      )}

      {/* Env Vars Check */}
      <div className="space-y-2">
        <button
          onClick={handleCheckEnv}
          disabled={loading !== null}
          className="btn-secondary flex items-center justify-center space-x-2"
        >
          {loading === 'env' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          <span>Check Env Vars</span>
        </button>
        {envVars && (
          <pre className="p-4 bg-slate-800 rounded-lg text-xs text-slate-300">
            {JSON.stringify(envVars, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}