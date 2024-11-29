import {
  Box,
  Button,
  HStack,
  Image,
  Link,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import router from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  getBlocksFromRange,
  getLatestBlocks,
  getTotalInscriptions,
} from '@/rpc/query'
import { selectTmClient } from '@/store/connectSlice'
import { getRelativeTime } from '@/utils'
import { shortenAddress } from '@/utils/helper'
import { images } from '@/utils/images'

export default function RecentBlocks() {
  const pollingInterval = 15_000
  const [isLoading, setIsLoading] = useState(false)
  const [inscriptionData, setInscriptionData] = useState([])
  const [err, setError] = useState<any>('')

  const fetchBitcoinData = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getTotalInscriptions()
      const bitcoinData = data?.bitcoindata
      console.log(bitcoinData, 'bitcoin data')
      if (bitcoinData) {
        setInscriptionData(bitcoinData)
        setError(null)
      } else {
        throw new Error('No bitcoin data received')
      }
    } catch (err: any) {
      setError(err?.message)
      console.error('Error fetching Bitcoin data:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Initial fetch
    fetchBitcoinData()

    // Set up polling
    const intervalId = setInterval(fetchBitcoinData, pollingInterval)

    // Cleanup function
    return () => {
      clearInterval(intervalId)
    }
  }, [fetchBitcoinData, pollingInterval])

  const recentBlocks = useMemo(() => {
    if (inscriptionData.length > 0) {
      const filteredBlocks = inscriptionData.filter(
        (item: any) => item.revealTx !== ''
      )
      return filteredBlocks.slice(0, 3)
    }
  }, [inscriptionData])

  return (
    <Box>
      <HStack justifyContent={'space-between'} mb={3}>
        <Text
          fontWeight={'500'}
          color={'text-50'}
          fontSize={'16px'}
          lineHeight={'25px'}
        >
          Recent Blocks
        </Text>
        <Text fontSize={'xs'} color={'gray-400'} pr={2} fontWeight={500}>
          Auto Updates
        </Text>
      </HStack>
      <VStack gap={4} w={'100%'} mb={{ base: '18px', md: '38px' }}>
        {isLoading && (!recentBlocks || recentBlocks.length === 0) ? (
          <Skeleton w={'100%'} height="220px" borderRadius={12} />
        ) : (
          recentBlocks?.map((item: any, key: number) => (
            <RecentBlock key={key} bitcoinData={item} />
          ))
        )}
      </VStack>
      {recentBlocks && recentBlocks?.length > 0 && (
        <Box width={'full'}>
          <Button
            border={'1px'}
            borderColor={'primary-500'}
            width={'100%'}
            alignSelf={'center'}
            bg={'dark-bg'}
            color={'primary-500'}
            borderRadius={'12px'}
            _hover={{
              bg: '#010101',
            }}
            onClick={() => {
              router.push('/blocks')
            }}
          >
            See All Blocks
          </Button>
        </Box>
      )}
    </Box>
  )
}

const RecentBlock = ({ bitcoinData }: any) => {
  const tmClient = useSelector(selectTmClient)
  const [blockDetails, setBlockDetails] = useState<any[]>([])

  // Create a memoized cache key based on block range
  const cacheKey = useMemo(
    () => `${bitcoinData.startBlock}-${bitcoinData.endBlock}`,
    [bitcoinData.startBlock, bitcoinData.endBlock]
  )

  // Use useEffect with the cache key
  useEffect(() => {
    const fetchBlockDetails = async () => {
      if (!tmClient) return

      // Check if we already have data for these blocks
      if (
        blockDetails.length > 0 &&
        blockDetails[0]?.header?.height === parseInt(bitcoinData.startBlock) &&
        blockDetails[blockDetails.length - 1]?.header?.height ===
          parseInt(bitcoinData.endBlock)
      ) {
        return // Data already exists, no need to fetch
      }

      try {
        const details = await getBlocksFromRange(
          tmClient,
          parseInt(bitcoinData.startBlock),
          parseInt(bitcoinData.endBlock)
        )
        setBlockDetails([...details.firstBlocks, details.lastBlock])
      } catch (err) {
        console.error('Error fetching block details:', err)
      }
    }

    fetchBlockDetails()
  }, [bitcoinData, tmClient, cacheKey, blockDetails])

  const blockRange = Array.from(
    { length: bitcoinData.endBlock - bitcoinData.startBlock + 1 },
    (_, i) => ({
      blockId: (parseInt(bitcoinData.startBlock) + i).toString(),
      address: '',
    })
  )
  const firstThreeBlocks = blockDetails.slice(0, 3)
  const lastBlock = blockDetails.slice(-1)
  console.log(lastBlock, 'last block')
  return (
    <Box bg={'gray-1100'} borderRadius={12} w={'100%'} marginBottom={4}>
      <Box px={4} py={5} bg="gray-1200" borderTopRadius={12}>
        <HStack justifyContent="space-between">
          <HStack gap={3}>
            <Image src={images.chainLink.src} alt="chain" />
            <HStack gap={1}>
              <Image width={5} src={images.bitcoinLogo.src} alt="bitcoin" />
              <Link
                as={NextLink}
                target="_blank"
                href={`https://signet.surge.dev/tx/${bitcoinData.revealTx}`}
                _focus={{ boxShadow: 'none' }}
                display={'block'}
                fontSize={'14px'}
                color={'yellow-100'}
              >
                {shortenAddress(bitcoinData?.revealTx) ?? ''}
              </Link>
            </HStack>
          </HStack>
          {/* <HStack gap={1}>
            <Link
              as={NextLink}
              href={'/blocks'}
              _focus={{ boxShadow: 'none' }}
              fontSize={'xs'}
              color={'gray-500'}
              textDecoration={'underline'}
            >
              {shortenAddress(
                '0x00000000000000000001e4add93ab2a51d8d405d60177fd30f791027deefaffd'
              )}
            </Link>
            <Dot />
            <Text fontSize={'xs'} color={'gray-400'}>
              2hr ago
            </Text>
          </HStack> */}
        </HStack>
      </Box>
      <Box px={4} py={'14px'}>
        <Box position="relative">
          <Box
            position="absolute"
            left="20px"
            top="42px"
            bottom="0"
            width="1px"
            bg="primary-900"
            zIndex="1"
            height={'68%'}
          />
          {firstThreeBlocks.map((data: any, index: number) => (
            <HStack
              key={index}
              justifyContent="space-between"
              py="14px"
              borderBottom="1px"
              borderColor="gray-900"
              ml={10}
              position="relative"
              _last={{ borderBottom: 'none' }}
            >
              {index === 0 && (
                <Image
                  src={images.logoShort.src}
                  alt="Surge"
                  position="absolute"
                  left="-30px"
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex={2}
                />
              )}
              <Box
                className="dots"
                position="absolute"
                left="-22.5px"
                top="50%"
                transform="translateY(-50%)"
                width="6px"
                height="6px"
                borderRadius="full"
                bg="primary-500"
                zIndex="2"
              />

              <HStack gap={3}>
                <HStack gap={1}>
                  <Image width={5} src={images.block.src} alt="block" />
                  <Link
                    as={NextLink}
                    href={`/blocks/${data.header.height}`}
                    _focus={{ boxShadow: 'none' }}
                    display="block"
                    fontSize="14px"
                    color="primary-200"
                  >
                    {data.header.height}
                  </Link>
                </HStack>
              </HStack>
              <HStack gap={1}>
                <Text fontSize="xs" color="gray-500">
                  {shortenAddress(data.id)}
                </Text>
                <Box w="2px" h="2px" bg="gray-500" borderRadius={99} />
                {data?.txs?.length > 0 && (
                  <>
                    <Text fontSize="xs" color="gray-500">
                      {`${data?.txs?.length ?? ''} ${
                        data?.txs?.length > 1 ? 'txs' : 'txn'
                      }`}
                    </Text>
                    <Box w="2px" h="2px" bg="gray-500" borderRadius={99} />
                  </>
                )}
                <Text fontSize="xs" color="gray-400">
                  {getRelativeTime(data.header.time, true)}
                </Text>
              </HStack>
            </HStack>
          ))}
        </Box>
        <Box
          px={3}
          py={'10px'}
          bg={'gray-1000'}
          display={'inline-block'}
          mt={2}
          borderRadius={99}
        >
          <Text fontSize={'xs'} color={'text-200'} fontWeight={500}>
            +{blockRange.length - 4} Block
          </Text>
        </Box>
        <Box position={'relative'}>
          <Box
            position="absolute"
            left="20px"
            top="4px"
            width="1px"
            bg="primary-900"
            zIndex="1"
            height={'24px'}
          />
          {lastBlock.map((data: any, index: number) => (
            <HStack
              key={index}
              justifyContent="space-between"
              py="14px"
              ml={10}
              mt={2}
              position="relative"
            >
              <Box
                className="dots"
                position="absolute"
                left="-22.5px"
                top="50%"
                transform="translateY(-50%)"
                width="6px"
                height="6px"
                borderRadius="full"
                bg="primary-500"
                zIndex="2"
              />

              <HStack gap={3}>
                <HStack gap={1}>
                  <Image width={5} src={images.block.src} alt="block" />
                  <Link
                    as={NextLink}
                    href={`/blocks/${data.header.height}`}
                    _focus={{ boxShadow: 'none' }}
                    display="block"
                    fontSize="14px"
                    color="primary-200"
                  >
                    {data.header.height}
                  </Link>
                </HStack>
              </HStack>
              <HStack gap={1}>
                <Text fontSize="xs" color="gray-500">
                  {shortenAddress(data.id)}
                </Text>
                <Dot />
                {data?.txs?.length > 0 && (
                  <>
                    <Text fontSize="xs" color="gray-500">
                      {`${data?.txs?.length ?? ''} txs`}
                    </Text>
                    <Dot />
                  </>
                )}
                <Text fontSize="xs" color="gray-400">
                  {getRelativeTime(data.header.time, true)}
                </Text>
              </HStack>
            </HStack>
          ))}
        </Box>
      </Box>
      {/* <Box px={4} py={5} bg="gray-1200" borderBottomRadius={12}>
        <HStack gap={2}>
          <Image w={4} src={images.stars.src} alt="" />
          <HStack>
            <Text fontSize={'xs'} color={'gray-500'}>
              120 txns
            </Text>
            <Box w={'2px'} h={'2px'} bg={'gray-500'} borderRadius={99} />
            <Text fontSize={'xs'} color={'gray-500'}>
              12 blocks
            </Text>
            <Box w={'2px'} h={'2px'} bg={'gray-500'} borderRadius={99} />
            <Text fontSize={'xs'} color={'gray-500'}>
              ~6s settlement
            </Text>
          </HStack>
        </HStack>
      </Box> */}
    </Box>
  )
}
const Dot = () => {
  return <Box w="2px" h="2px" bg="gray-500" borderRadius={99} />
}
