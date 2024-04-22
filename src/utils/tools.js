export const delay = (t, val) => new Promise((resolve) => setTimeout(resolve, t, val))

export function decodeJWT(token) {
  // Split the token into its parts
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid JWT: The token must have three parts')
  }

  // Decode header and payload
  const [header, payload] = parts.slice(0, 2).map((part) => {
    // Convert base64url to base64
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
    // Decode base64 to a string
    const jsonPayload = Buffer.from(base64, 'base64').toString()
    // Parse the JSON string
    return JSON.parse(jsonPayload)
  })

  return { header, payload }
}
