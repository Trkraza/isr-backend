import { formatDistanceToNow } from 'date-fns'

/**
 * Generate URL-friendly slug from string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Format timestamp to relative time
 */
export function formatRelativeTime(timestamp: string): string {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  } catch {
    return 'Unknown'
  }
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Trigger frontend revalidation by calling our own backend API route.
 * This is the function called by the client-side button.
 */
export async function triggerFrontendRevalidation(
  type: 'path' | 'tag',
  value: string
): Promise<{ success: boolean; message?: string }> {
  try {
    // We call our own backend, which then securely calls the frontend.
    const res = await fetch(`/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, value }),
    });

    const data = await res.json();

    if (!res.ok) {
      // The message from the server should be informative.
      return {
        success: false,
        message: data.message || `API route failed with status ${res.status}`,
      };
    }

    return {
      success: true,
      message: data.message || 'Revalidation triggered successfully',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown client-side error occurred';
    console.error('--- CLIENT CATCH BLOCK ERROR:', errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  }
}

/**
 * Validate dapp data
 */
export function validateDappData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required')
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.push('Description is required')
  }

  if (!data.logo || !isValidUrl(data.logo)) {
    errors.push('Valid logo URL is required')
  }

  if (!data.website || !isValidUrl(data.website)) {
    errors.push('Valid website URL is required')
  }

  if (!Array.isArray(data.tags) || data.tags.length === 0) {
    errors.push('At least one tag is required')
  }

  if (!Array.isArray(data.chains) || data.chains.length === 0) {
    errors.push('At least one chain is required')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}