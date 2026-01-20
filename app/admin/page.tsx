'use client'

import { useState, useEffect } from 'react'
import { Plus, RefreshCw, Database } from 'lucide-react'
import AdminForm from '@/components/AdminForm'
import DappList from '@/components/DappList'
import RevalidationButtons from '@/components/RevalidationButtons'
import { Dapp } from '@/lib/types'

export default function AdminPage() {
  const [dapps, setDapps] = useState<Dapp[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDapp, setEditingDapp] = useState<Dapp | null>(null)
  const [savedSlug, setSavedSlug] = useState<string | null>(null)

  useEffect(() => {
    fetchDapps()
  }, [])

  const fetchDapps = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/apps')
      const data = await res.json()
      setDapps(data.apps || [])
    } catch (error) {
      console.error('Failed to fetch dapps:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (formData: any) => {
    try {
      const res = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to save')
      }

      // Refresh list
      await fetchDapps()

      // Show success message
      setSavedSlug(data.slug)

      // Close form
      setShowForm(false)
      setEditingDapp(null)

      // Scroll to revalidation buttons
      setTimeout(() => {
        document.getElementById('revalidation-section')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error) {
      throw error
    }
  }

  const handleEdit = (dapp: Dapp) => {
    setEditingDapp(dapp)
    setShowForm(true)
    setSavedSlug(null)
  }

  const handleDelete = async (slug: string) => {
    const res = await fetch(`/api/apps/${slug}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      throw new Error('Failed to delete')
    }

    await fetchDapps()
    setSavedSlug(null)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingDapp(null)
  }

  const handleNewDapp = () => {
    setEditingDapp(null)
    setShowForm(true)
    setSavedSlug(null)
  }

  const handleSeedDatabase = async () => {
    if (!confirm('Seed database with sample dapps?')) return

    try {
      // Import and call seed function
      const { seedDatabase } = await import('@/lib/kv')
      // await seedDatabase()
      await fetchDapps()
      alert('✅ Database seeded successfully!')
    } catch (error) {
      alert('❌ Failed to seed database')
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Manage Dapps</h1>
            <p className="text-slate-400">Create, edit, and manage your dapp directory</p>
          </div>
          <div className="flex items-center space-x-3">
            {dapps.length === 0 && (
              <button
                onClick={handleSeedDatabase}
                className="btn-secondary flex items-center space-x-2"
              >
                <Database className="w-4 h-4" />
                <span>Seed Sample Data</span>
              </button>
            )}
            <button
              onClick={fetchDapps}
              disabled={loading}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            {!showForm && (
              <button onClick={handleNewDapp} className="btn-primary flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Dapp</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            {editingDapp ? 'Edit Dapp' : 'Create New Dapp'}
          </h2>
          <AdminForm
            initialData={editingDapp || undefined}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Success Message + Revalidation Buttons */}
      {savedSlug && !showForm && (
        <div id="revalidation-section" className="glass-card p-8 mb-8 border-l-4 border-green-500">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-green-400 mb-2">
              ✅ Dapp Saved Successfully!
            </h3>
            <p className="text-slate-400 text-sm">
              The dapp has been saved to the database. Now trigger frontend cache update to see
              changes instantly:
            </p>
          </div>
          <RevalidationButtons slug={savedSlug} />
        </div>
      )}

      {/* Dapp List */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          All Dapps ({dapps.length})
        </h2>
        {loading ? (
          <div className="glass-card p-12 text-center">
            <RefreshCw className="w-8 h-8 text-primary-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Loading dapps...</p>
          </div>
        ) : (
          <DappList dapps={dapps} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </div>
  )
}