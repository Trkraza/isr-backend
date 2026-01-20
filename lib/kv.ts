import { kv } from '@vercel/kv'
import { Dapp, Stats } from './types'

// ====================
// DAPP CRUD OPERATIONS
// ====================

/**
 * Get all dapp slugs from the set
 */
export async function getAllDappSlugs(): Promise<string[]> {
  try {
   const slugs = await kv.smembers('dapps:all')

    return slugs || []
  } catch (error) {
    console.error('Error getting dapp slugs:', error)
    return []
  }
}

/**
 * Get all dapps with their full data
 */
export async function getAllDapps(): Promise<Dapp[]> {
  try {
    const slugs = await getAllDappSlugs()
    if (slugs.length === 0) return []

    // Fetch all dapps in parallel
    const dapps = await Promise.all(
      slugs.map(async (slug) => {
        const dapp = await kv.get<Dapp>(`dapp:${slug}`)
        return dapp
      })
    )

    // Filter out null values and sort by updatedAt
    return dapps
      .filter((dapp): dapp is Dapp => dapp !== null)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  } catch (error) {
    console.error('Error getting all dapps:', error)
    return []
  }
}

/**
 * Get a single dapp by slug
 */
export async function getDappBySlug(slug: string): Promise<Dapp | null> {
  try {
    const dapp = await kv.get<Dapp>(`dapp:${slug}`)
    return dapp
  } catch (error) {
    console.error(`Error getting dapp ${slug}:`, error)
    return null
  }
}

/**
 * Create or update a dapp
 */
export async function upsertDapp(slug: string, data: Omit<Dapp, 'slug'>): Promise<boolean> {
  try {
    const dapp: Dapp = { slug, ...data }
    
    // Save the dapp
    await kv.set(`dapp:${slug}`, dapp)
    
    // Add slug to the set of all dapps
    await kv.sadd('dapps:all', slug)
    
    return true
  } catch (error) {
    console.error(`Error upserting dapp ${slug}:`, error)
    return false
  }
}

/**
 * Delete a dapp
 */
export async function deleteDapp(slug: string): Promise<boolean> {
  try {
    // Delete the dapp
    await kv.del(`dapp:${slug}`)
    
    // Remove slug from the set
    await kv.srem('dapps:all', slug)
    
    return true
  } catch (error) {
    console.error(`Error deleting dapp ${slug}:`, error)
    return false
  }
}

// ====================
// FEATURED DAPPS
// ====================

/**
 * Get all featured dapps
 */
export async function getFeaturedDapps(): Promise<Dapp[]> {
  try {
    const allDapps = await getAllDapps()
    return allDapps.filter((dapp) => dapp.isFeatured)
  } catch (error) {
    console.error('Error getting featured dapps:', error)
    return []
  }
}

// ====================
// STATS
// ====================

/**
 * Get platform statistics
 */
export async function getStats(): Promise<Stats> {
  try {
    const allDapps = await getAllDapps()
    
    // Calculate unique chains
    const allChains = new Set<string>()
    allDapps.forEach((dapp) => {
      dapp.chains.forEach((chain) => allChains.add(chain.toLowerCase()))
    })
    
    // Calculate unique categories
    const allCategories = new Set<string>()
    allDapps.forEach((dapp) => {
      dapp.tags.forEach((tag) => allCategories.add(tag))
    })
    
    return {
      totalApps: allDapps.length,
      totalChains: allChains.size,
      totalCategories: allCategories.size,
      lastUpdated: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error getting stats:', error)
    return {
      totalApps: 0,
      totalChains: 0,
      totalCategories: 0,
      lastUpdated: new Date().toISOString(),
    }
  }
}

// ====================
// SEED DATA (Development)
// ====================

/**
 * Seed the database with sample dapps
 */
export async function seedDatabase(): Promise<boolean> {
  const sampleDapps: Dapp[] = [
    {
      slug: 'uniswap',
      name: 'Uniswap',
      description: `# Uniswap Protocol

Uniswap is a decentralized trading protocol that enables automated trading of decentralized finance (DeFi) tokens.

## Features

- **Permissionless**: Anyone can swap, provide liquidity, or create new markets
- **Non-custodial**: You remain in control of your tokens at all times
- **Gas Efficient**: Optimized for low transaction costs

## How It Works

Uniswap uses an automated market maker (AMM) system instead of traditional order books. Liquidity providers earn fees on trades.`,
      logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
      tags: ['DeFi', 'DEX'],
      chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
      website: 'https://uniswap.org',
      twitter: 'https://twitter.com/Uniswap',
      github: 'https://github.com/Uniswap',
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: 'aave',
      name: 'Aave',
      description: `# Aave Protocol

Aave is a decentralized non-custodial liquidity protocol where users can participate as suppliers or borrowers.

## Key Features

- **Supply & Earn**: Deposit crypto and earn interest
- **Borrow**: Access instant loans backed by your collateral
- **Flash Loans**: Uncollateralized loans for developers

## Security

Aave protocol is secured by a Safety Module and audited by leading security firms.`,
      logo: 'https://cryptologos.cc/logos/aave-aave-logo.png',
      tags: ['DeFi', 'Lending'],
      chains: ['Ethereum', 'Polygon', 'Avalanche', 'Arbitrum'],
      website: 'https://aave.com',
      twitter: 'https://twitter.com/AaveAave',
      github: 'https://github.com/aave',
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: 'opensea',
      name: 'OpenSea',
      description: `# OpenSea

The world's first and largest NFT marketplace.

## What You Can Do

- Buy, sell, and discover exclusive digital items
- Create your own NFT collections
- Explore trending collections

## Supported Standards

- ERC-721
- ERC-1155
- And more...`,
      logo: 'https://opensea.io/static/images/logos/opensea-logo.svg',
      tags: ['NFT', 'Marketplace'],
      chains: ['Ethereum', 'Polygon', 'Arbitrum'],
      website: 'https://opensea.io',
      twitter: 'https://twitter.com/opensea',
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  try {
    for (const dapp of sampleDapps) {
      await upsertDapp(dapp.slug, dapp)
    }
    console.log('✅ Database seeded successfully')
    return true
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    return false
  }
}