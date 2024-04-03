export const delay = (t, val) => new Promise((resolve) => setTimeout(resolve, t, val))

export const decodeJWT = (token) => {
  const parts = token.split('.') // Split the token into its parts
  if (parts.length !== 3) {
    throw new Error('Invalid JWT: The token must have three parts')
  }

  const [header, payload] = parts.map((part) => {
    // Convert Base64Url to Base64
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
    // Decode Base64 to UTF-8 string
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
    // Parse the JSON string
    return JSON.parse(jsonPayload)
  })

  return { header, payload }
}
