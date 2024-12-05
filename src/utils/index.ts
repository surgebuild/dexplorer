export const getColor = (status: string | number) => {
  switch (status) {
    case 'success':
      return 'text-success'
    case 'pending':
      return 'text-danger'
    case 'error':
      return 'text-error'
    case 1:
      return 'text-error'
    case 0:
      return 'text-success'
    default:
      return 'gray.500' // Default color if status is unknown
  }
}
export const getRelativeTime = (timestamp: string | Date, short?: boolean) => {
  const now = new Date()
  const pastDate = new Date(timestamp)
  const timeDifference = now.getTime() - pastDate.getTime() // Difference in milliseconds

  const minutes = Math.floor(timeDifference / (1000 * 60))
  const hours = Math.floor(timeDifference / (1000 * 60 * 60))
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

  if (minutes < 1) return `${short ? 'now' : 'Just now'}`
  if (minutes < 60)
    return `${minutes} ${short ? 'min' : 'minute'}${minutes > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} ${short ? 'h' : 'hour'} ago`
  return `${days} ${short ? 'd' : 'day'} ago`
}

export const truncate = (hash: string, length: number = 5): string => {
  // Ensure the hash is long enough for truncation
  if (hash.length <= length * 2) {
    return hash // No truncation if the hash is too short
  }

  // Get the first and last 'length' characters
  const start = hash.slice(0, length)
  const end = hash.slice(-length)

  // Return the truncated hash
  return `${start}...${end}`
}

export const capitalizeFirstLetter = (word: string): string => {
  if (!word) return '' // Handle empty or null strings
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

export const fetchBitcoinPriceDifference = async () => {
  try {
    // Get the current Bitcoin price
    const currentPriceResponse = await fetch(
      'https://api.coindesk.com/v1/bpi/currentprice/BTC.json'
    )
    const currentPriceData = await currentPriceResponse.json()
    const currentPrice = currentPriceData.bpi.USD.rate_float

    // Get yesterday's date in the format YYYY-MM-DD
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayDateString = yesterday.toISOString().split('T')[0]

    // Fetch Bitcoin price for yesterday
    const historicalPriceResponse = await fetch(
      `https://api.coindesk.com/v1/bpi/historical/close.json?start=${yesterdayDateString}&end=${yesterdayDateString}`
    )
    const historicalPriceData = await historicalPriceResponse.json()
    const yesterdayPrice = historicalPriceData.bpi[yesterdayDateString]

    // Calculate the difference
    const priceDifference = currentPrice - yesterdayPrice
    const differencePercentage = (
      (priceDifference / yesterdayPrice) *
      100
    ).toFixed(2)

    return {
      currentPrice,
      yesterdayPrice,
      priceDifference,
      differencePercentage,
    }
  } catch (error) {
    console.error('Error fetching Bitcoin prices:', error)
    return null
  }
}

export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount)
  } catch (error) {
    console.error('Error formatting currency:', error)
    return amount.toString() // Fallback to raw number if formatting fails
  }
}
export function extractSenderAndRecipient(
  transaction: any
): { sender: string; recipient: string } | null {
  if (!transaction.result || !transaction.result.events) {
    console.warn('Transaction does not have a valid result or events array.')
    return null
  }

  const events = transaction.result.events

  let sender = ''
  let recipient = ''

  // Look for the transfer event type
  for (const event of events) {
    if (event.type === 'transfer') {
      for (const attribute of event.attributes) {
        if (attribute.key === 'sender') {
          sender = attribute.value
        } else if (attribute.key === 'recipient') {
          recipient = attribute.value
        }
      }
    }

    // If sender and recipient are found, no need to continue
    if (sender && recipient) {
      break
    }
  }

  if (!sender || !recipient) {
    console.warn('Sender or recipient not found in transaction events.')
    return null
  }

  return { sender, recipient }
}

export function sanitizeString(input: string): string {
  // Remove newline characters (\n) and escape sequences like \uXXXX
  let sanitized = input.replace(/\\n/g, '').replace(/\\u[0-9a-fA-F]{4}/g, '')

  // Remove any non-printable or non-ASCII characters
  sanitized = sanitized.replace(/[^\x20-\x7E]/g, '')

  // Remove the '&' character
  sanitized = sanitized.replace(/&/g, '')

  // Remove 'Response' at the end of the string
  sanitized = sanitized.replace(/Response$/, '')

  // Trim whitespace from the start and end
  return sanitized.trim()
}

export function normalizeToISOString(timestamp: string) {
  // Check if the input contains fractional seconds
  const [datePart, timePart] = timestamp.split('.')

  if (!timePart) {
    // If no fractional seconds, directly convert to ISO
    return new Date(timestamp).toISOString()
  }

  // Limit fractional seconds to 3 decimal places (milliseconds)
  const milliseconds = timePart.slice(0, 3)
  const normalizedTimestamp = `${datePart}.${milliseconds}Z`

  // Convert to ISO string
  return new Date(normalizedTimestamp).toISOString()
}
