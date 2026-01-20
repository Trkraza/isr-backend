'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Loader2, Save, X } from 'lucide-react'
import { Dapp } from '@/lib/types'
import { generateSlug } from '@/lib/utils'

// Dynamic import for Markdown editor (client-side only)
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface AdminFormProps {
  initialData?: Dapp
  onSave: (data: any) => Promise<void>
  onCancel: () => void
}

const CHAINS = ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base', 'Avalanche', 'BSC', 'Solana']
const CATEGORIES = ['DeFi', 'NFT', 'Gaming', 'DEX', 'Lending', 'Bridge', 'Wallet', 'Analytics', 'Infrastructure', 'DAO', 'Social', 'Marketplace']

export default function AdminForm({ initialData, onSave, onCancel }: AdminFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '# App Name\n\nDescription here...',
    logo: initialData?.logo || '',
    website: initialData?.website || '',
    twitter: initialData?.twitter || '',
    github: initialData?.github || '',
    tags: initialData?.tags || [],
    chains: initialData?.chains || [],
    isFeatured: initialData?.isFeatured || false,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await onSave(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: initialData ? prev.slug : generateSlug(name),
    }))
  }

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }))
  }

  const toggleChain = (chain: string) => {
    setFormData((prev) => ({
      ...prev,
      chains: prev.chains.includes(chain)
        ? prev.chains.filter((c) => c !== chain)
        : [...prev.chains, chain],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="label-text">App Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="input-field"
            placeholder="Uniswap"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="label-text">Slug *</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="input-field"
            placeholder="uniswap"
            required
            disabled={!!initialData}
          />
          {initialData && (
            <p className="text-xs text-slate-500 mt-1">Slug cannot be changed after creation</p>
          )}
        </div>

        {/* Logo URL */}
        <div>
          <label className="label-text">Logo URL *</label>
          <input
            type="url"
            value={formData.logo}
            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
            className="input-field"
            placeholder="https://example.com/logo.png"
            required
          />
        </div>

        {/* Website */}
        <div>
          <label className="label-text">Website *</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="input-field"
            placeholder="https://example.com"
            required
          />
        </div>

        {/* Twitter */}
        <div>
          <label className="label-text">Twitter (Optional)</label>
          <input
            type="url"
            value={formData.twitter}
            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
            className="input-field"
            placeholder="https://twitter.com/username"
          />
        </div>

        {/* GitHub */}
        <div>
          <label className="label-text">GitHub (Optional)</label>
          <input
            type="url"
            value={formData.github}
            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
            className="input-field"
            placeholder="https://github.com/username"
          />
        </div>
      </div>

      {/* Description (Markdown) */}
      <div>
        <label className="label-text">Description (Markdown) *</label>
        <div data-color-mode="dark">
          <MDEditor
            value={formData.description}
            onChange={(val) => setFormData({ ...formData, description: val || '' })}
            height={300}
            preview="edit"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="label-text">Categories * (Select at least one)</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleTag(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                formData.tags.includes(cat)
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/50'
                  : 'glass-card text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Chains */}
      <div>
        <label className="label-text">Blockchains * (Select at least one)</label>
        <div className="flex flex-wrap gap-2">
          {CHAINS.map((chain) => (
            <button
              key={chain}
              type="button"
              onClick={() => toggleChain(chain)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                formData.chains.includes(chain)
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/50'
                  : 'glass-card text-slate-400 hover:text-slate-200'
              }`}
            >
              {chain}
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="label-text">Mark as Featured</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{initialData ? 'Update' : 'Create'} Dapp</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="btn-secondary flex items-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>
    </form>
  )
}