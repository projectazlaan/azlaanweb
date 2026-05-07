interface ApiRequestOptions {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: unknown
  queryParams?: Record<string, string>
}

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  status: number
}

export async function fetchRestApi<T = unknown>(options: ApiRequestOptions): Promise<ApiResponse<T>> {
  try {
    let url = options.url
    if (options.queryParams) {
      const params = new URLSearchParams(options.queryParams)
      url += `?${params.toString()}`
    }

    const response = await fetch(url, {
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    })

    const data = await response.json()

    return {
      success: response.ok,
      data: response.ok ? data : undefined,
      error: response.ok ? undefined : data.message || 'Request failed',
      status: response.status
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
      status: 0
    }
  }
}

export async function fetchGraphQL<T = unknown>(url: string, query: string, variables?: Record<string, unknown>): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables })
    })

    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors.map((e: { message: string }) => e.message).join(', '),
        status: response.status
      }
    }

    return {
      success: true,
      data: data.data,
      status: response.status
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
      status: 0
    }
  }
}

interface VisualFetcherOptions {
  url: string
  method: 'GET' | 'POST'
  type: 'rest' | 'graphql'
  query?: string
  variables?: Record<string, unknown>
  headers?: Record<string, string>
  onSuccess?: (data: unknown) => void
  onError?: (error: string) => void
}

export function createVisualFetcher(options: VisualFetcherOptions) {
  return async (): Promise<ApiResponse> => {
    try {
      let result: ApiResponse
      
      if (options.type === 'graphql') {
        result = await fetchGraphQL(options.url, options.query || '', options.variables)
      } else {
        result = await fetchRestApi({
          url: options.url,
          method: options.method,
          headers: options.headers
        })
      }

      if (result.success && options.onSuccess) {
        options.onSuccess(result.data)
      } else if (!result.success && options.onError) {
        options.onError(result.error || 'Unknown error')
      }

      return result
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      if (options.onError) options.onError(message)
      return { success: false, error: message, status: 0 }
    }
  }
}

export type { ApiRequestOptions, ApiResponse, VisualFetcherOptions }
