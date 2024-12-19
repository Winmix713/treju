export async function fetchApi(url: string, options: RequestInit = {}) {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, mergedOptions)

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage: string
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.message || `HTTP error! status: ${response.status}`
      } catch {
        errorMessage = `HTTP error! status: ${response.status}. Response: ${errorText}`
      }
      throw new Error(errorMessage)
    }

    const contentType = response.headers.get("content-type")
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json()
    } else {
      const text = await response.text()
      try {
        return JSON.parse(text)
      } catch {
        console.warn("Response is not JSON:", text)
        return text
      }
    }
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

