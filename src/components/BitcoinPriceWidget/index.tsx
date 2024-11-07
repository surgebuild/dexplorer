import { Box, Img, Text, VStack } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'

import { images } from '@/utils/images'

export default function BitcoinPriceDifference() {
  const [priceData, setPriceData] = useState({
    currentPrice: null as number | null,
    yesterdayPrice: null as number | null,
    priceDifference: null as number | null,
    differencePercentage: null as string | null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Memoize the fetch function
  const fetchBitcoinPriceDifference = useCallback(async () => {
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

      // Update the state
      setPriceData({
        currentPrice,
        yesterdayPrice,
        priceDifference,
        differencePercentage,
      })
      setLoading(false)
    } catch (error) {
      console.error('Error fetching Bitcoin prices:', error)
      setError('Failed to fetch data')
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBitcoinPriceDifference()
  }, [fetchBitcoinPriceDifference])

  const getPercentageColor = (percentage: string | null) => {
    if (!percentage) return 'gray.500' // Default color if data is missing
    return parseFloat(percentage) >= 0 ? 'green.500' : 'red.500'
  }

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <Box display={'flex'} gap={2} alignItems={'center'}>
          <Img src={images.bitcoinLogo.src} width={8} height={8} />
          <VStack gap={'2px'}>
            <Text fontSize={'sm'}>{`$ ${priceData.currentPrice?.toFixed(
              0
            )}`}</Text>
            <Text
              fontSize={'sm'}
              color={getPercentageColor(priceData.differencePercentage)}
            >
              {priceData.differencePercentage}
            </Text>
          </VStack>
        </Box>
      )}
    </div>
  )
}
