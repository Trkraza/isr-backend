'use client'

import { useState } from 'react'
import { Dapp } from '@/lib/types'
import { formatRelativeTime } from '@/lib/utils'
import { Edit, Trash2, ExternalLink } from 'lucide-react'

interface DappListProps {
  dapps: Dapp[]
  onEdit: (dapp: Dapp) => void
  onDelete: (slug: string) => Promise<void>
}

export default function DappList({ dapps, onEdit, onDelete }: DappListProps) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete "${slug}"?`)) return

    setDeleting(slug)
    try {
      await onDelete(slug)
    } catch (error) {
      alert('Failed to delete dapp')
    } finally {
      setDeleting(null)
    }
  }

  if (dapps.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-slate-400">No dapps yet. Create your first one!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {dapps.map((dapp) => (
        <div key={dapp.slug} className="glass-card p-6 hover:bg-slate-800/30 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              {/* Logo */}
              <div className="w-16 h-16 rounded-lg bg-slate-800 p-2 flex-shrink-0">
                <img
                  src={dapp.logo}
                  alt={dapp.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = 'https://via.placeholder.com/64'
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-white">{dapp.name}</h3>
                  {dapp.isFeatured && (
                    <span className="px-2 py-1 text-xs bg-primary-500/20 text-primary-400 border border-primary-500/30 rounded">
                      Featured
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                  {dapp.description.split('\n')[0].replace(/^#+ /, '')}
                </p>

                <div className="flex flex-wrap gap-2 mb-2">
                  {dapp.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-slate-800 text-slate-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center space-x-4 text-xs text-slate-500">
                  <span>Slug: {dapp.slug}</span>
                  <span>•</span>
                  <span>Updated {formatRelativeTime(dapp.updatedAt)}</span>
                  <span>•</span>
                  <span>{dapp.chains.length} chains</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              <a
                href={dapp.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 glass-card hover:bg-slate-800/50 text-slate-400 hover:text-primary-400 transition-colors"
                title="Visit website"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => onEdit(dapp)}
                className="p-2 glass-card hover:bg-slate-800/50 text-slate-400 hover:text-primary-400 transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(dapp.slug)}
                disabled={deleting === dapp.slug}
                className="p-2 glass-card hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}