import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Icon,
  Link,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react'
import { toHex } from '@cosmjs/encoding'
import { NewBlockEvent, TxEvent } from '@cosmjs/tendermint-rpc'
import { TxBody } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import Head from 'next/head'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'
import { FiCheck, FiChevronRight, FiHome, FiX } from 'react-icons/fi'
import { useSelector } from 'react-redux'

import GradientBackground from '@/components/shared/GradientBackground'
import { getBlocksByRestApi, getLatestBlocks } from '@/rpc/query'
import { selectNewBlock, selectTxEvent } from '@/store/streamSlice'
import { getRelativeTime } from '@/utils'
import {
  getTypeMsg,
  shortenAddress,
  timeFromNow,
  trimHash,
} from '@/utils/helper'

const MAX_ROWS = 30

interface Tx {
  TxEvent: TxEvent
  Timestamp: Date
}

interface BlockTx extends NewBlockEvent {
  height: number
  appHash: string
  Timestamp: string
  txCount: number
}

export default function Blocks() {
  const newBlock = useSelector(selectNewBlock)
  const txEvent = useSelector(selectTxEvent)
  const [blocks, setBlocks] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [totalBlocks, setTotalBlocks] = useState(0)
  const [loadingBlocks, setLoadingBlocks] = useState(false)

  useEffect(() => {
    if (newBlock && page == 1) {
      updateBlocks(newBlock)
    }
  }, [newBlock])

  useEffect(() => {
    const fetchBlocks = async () => {
      const restEndpoint = 'https://rpc.devnet.surge.dev'
      const searchParams = {
        query: `"block.height>0"`,
        per_page: '20',
        page: `${page}`,
        order_by: `"desc"`,
      }

      try {
        setLoadingBlocks(true)
        const { blocksData, blocksCount } = await getLatestBlocks()

        const formattedBlocks = blocksData.map((block: any) => ({
          height: block.header.height,
          appHash: block.header.app_hash,
          Timestamp: block.header.time,
          txCount: block.num_txs,
        }))

        setLoadingBlocks(false)
        setBlocks(formattedBlocks)
        setTotalBlocks(blocksCount)
      } catch (error) {
        setLoadingBlocks(false)
        console.error('Exhausted all retry attempts.')
      }
    }

    fetchBlocks()
  }, [page]) // Always run the useEffect, page determines data fetching

  const updateBlocks = (block: NewBlockEvent) => {
    const formattedBlock = {
      height: block.header.height,
      appHash: toHex(block.header.appHash),
      txCount: block.txs.length,
      Timestamp: block.header.time.toISOString(),
    }
    if (blocks.length) {
      if (formattedBlock.height > blocks[0].height) {
        setBlocks((prevBlocks) => [
          formattedBlock,
          ...prevBlocks.slice(0, MAX_ROWS - 1),
        ])
      }
    } else {
      setBlocks([block])
    }
  }

  const renderMessages = (data: Uint8Array | undefined) => {
    if (data) {
      const txBody = TxBody.decode(data)
      const messages = txBody.messages

      if (messages.length == 1) {
        return (
          <HStack>
            <Tag colorScheme="cyan">{getTypeMsg(messages[0].typeUrl)}</Tag>
          </HStack>
        )
      } else if (messages.length > 1) {
        return (
          <HStack>
            <Tag colorScheme="cyan">{getTypeMsg(messages[0].typeUrl)}</Tag>
            <Text textColor="cyan.800">+{messages.length - 1}</Text>
          </HStack>
        )
      }
    }

    return ''
  }

  // const handlePreviousPage = () => {
  //   if (page > 1) {
  //     setPage!(page - 1)
  //   }
  // }

  // const handleNextPage = () => {
  //   if (page < totalBlocks / 20) {
  //     setPage!(page + 1)
  //   }
  // }

  return (
    <>
      <Head>
        <title>Blocks | Surge Devnet Explorer</title>
        <meta
          name="description"
          content="Explore the Surge Devnet blockchain with ease. Access real-time data, transactions, and blockchain analytics."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:image"
          content="https://surge.sfo3.cdn.digitaloceanspaces.com/assets/surgeExplorer/surge_explorer_meta.png"
        />
        <meta
          property="twitter:image"
          content="https://surge.sfo3.cdn.digitaloceanspaces.com/assets/surgeExplorer/surge_explorer_meta.png"
        />
      </Head>
      <Box>
        <GradientBackground title="Blocks">
          <Box>
            <Box
              mt={8}
              bg={'dark-bg'}
              borderRadius={'12px'}
              border={'1px'}
              borderColor={'gray-900'}
            >
              <Text
                fontWeight={'500'}
                fontSize={'16px'}
                lineHeight={'25px'}
                mb={2}
                px={6}
                color={'text-50'}
                paddingTop={8}
              >
                Latest Blocks
              </Text>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th borderColor={'gray-900'}>Height</Th>
                      <Th borderColor={'gray-900'}>App Hash</Th>
                      <Th borderColor={'gray-900'}>Txs</Th>
                      <Th borderColor={'gray-900'}>Time</Th>
                    </Tr>
                  </Thead>
                  {blocks.length > 0 && !loadingBlocks ? (
                    <Tbody>
                      {blocks.map((block) => (
                        <Tr
                          key={block.height}
                          border={'1px'}
                          borderColor={'gray-900'}
                        >
                          <Td
                            fontSize={{ base: 'xs', md: 'sm' }}
                            border={'none'}
                          >
                            <Link
                              as={NextLink}
                              href={'/blocks/' + block.height}
                              style={{ textDecoration: 'none' }}
                              _focus={{ boxShadow: 'none' }}
                            >
                              <Text color={'light-theme'}>{block.height}</Text>
                            </Link>
                          </Td>
                          <Td
                            fontSize={{ base: 'xs', md: 'sm' }}
                            textTransform={'capitalize'}
                            color={'white'}
                            border={'none'}
                          >
                            {trimHash(block.appHash, 10)}
                          </Td>
                          <Td
                            fontSize={{ base: 'xs', md: 'sm' }}
                            color={'white'}
                            border={'none'}
                          >
                            {block.txCount}
                          </Td>
                          {block.Timestamp && (
                            <Td
                              fontSize={{ base: 'xs', md: 'sm' }}
                              color={'white'}
                              border={'none'}
                            >
                              {getRelativeTime(block.Timestamp)}
                            </Td>
                          )}
                        </Tr>
                      ))}
                    </Tbody>
                  ) : (
                    <Tbody py={2}>
                      <Tr>
                        <Td
                          border={'none'}
                          color={'text-50'}
                          colSpan={4}
                          textAlign="center"
                          pt={8}
                        >
                          Loading Blocks...
                        </Td>
                      </Tr>
                    </Tbody>
                  )}
                </Table>
                {/* {blocks.length > 18 && (
                  <Box
                    display={'flex'}
                    justifyContent={{ md: 'center', base: 'space-around' }}
                  >
                    <HStack
                      justifyContent="space-between"
                      alignSelf={''}
                      mt={4}
                      px={6}
                      pb={4}
                      width={{ md: '50%', base: 'full' }}
                    >
                      <Button
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                        size="sm"
                        variant="outline"
                        colorScheme="#f4431c"
                        color={'#f4431c'}
                      >
                        Previous
                      </Button>
                      <Text>
                        Page {page} of {(totalBlocks / 20).toFixed(0)}
                      </Text>
                      <Button
                        onClick={handleNextPage}
                        disabled={page === totalBlocks / 30}
                        size="sm"
                        variant="outline"
                        colorScheme="#f4431c"
                        color={'#f4431c'}
                      >
                        Next
                      </Button>
                    </HStack>
                  </Box>
                )} */}
              </TableContainer>
            </Box>
          </Box>
        </GradientBackground>
      </Box>
    </>
  )
}
