// Dapp/App data structure
export interface Dapp {
  slug: string
  name: string
  description: string // Markdown content
  logo: string // URL
  tags: string[]
  chains: string[]
  website: string
  twitter?: string
  github?: string
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

// Stats data
export interface Stats {
  totalApps: number
  totalChains: number
  totalCategories: number
  lastUpdated: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Form data for creating/updating dapps
export interface DappFormData {
  slug?: string
  name: string
  description: string
  logo: string
  tags: string[]
  chains: string[]
  website: string
  twitter?: string
  github?: string
  isFeatured: boolean
}