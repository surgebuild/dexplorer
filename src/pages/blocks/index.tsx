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
import { getBlocksByRestApi } from '@/rpc/query'
import { selectNewBlock, selectTxEvent } from '@/store/streamSlice'
import { getRelativeTime } from '@/utils'
import { getTypeMsg, timeFromNow, trimHash } from '@/utils/helper'

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
        per_page: '30',
        page: `${page}`,
        order_by: `"desc"`,
      }

      try {
        setLoadingBlocks(true)
        const { blocksData, blocksCount } = await getBlocksByRestApi(
          restEndpoint,
          searchParams
        )
        const formattedBlocks = blocksData.map((block: any) => {
          return {
            height: block.block.header.height,
            appHash: block.block.header.app_hash,
            Timestamp: block.block.header.time,
            txCount: block.block.data.txs.length,
          }
        })
        setLoadingBlocks(false)
        setBlocks(formattedBlocks)
        setTotalBlocks(blocksCount)
      } catch (error) {
        console.error('Error fetching transactions from REST API:', error)
        setLoadingBlocks(false)
      }
    }

    fetchBlocks()
  }, [page])

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

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage!(page - 1)
    }
  }

  const handleNextPage = () => {
    if (page < totalBlocks / 20) {
      setPage!(page + 1)
    }
  }

  return (
    <>
      <Head>
        <title>Blocks | Surge Explorer</title>
        <meta name="description" content="Blocks | Surge Explorer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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
                All Blocks
              </Text>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Height</Th>
                      <Th>App Hash</Th>
                      <Th>Txs</Th>
                      <Th>Time</Th>
                    </Tr>
                  </Thead>
                  {blocks.length > 0 && !loadingBlocks ? (
                    <Tbody>
                      {blocks.map((block) => (
                        <Tr key={block.height}>
                          <Td fontSize={{ base: 'xs', md: 'sm' }}>
                            <Link
                              as={NextLink}
                              href={'/blocks/' + block.height}
                              style={{ textDecoration: 'none' }}
                              _focus={{ boxShadow: 'none' }}
                            >
                              <Text
                                color={useColorModeValue(
                                  'light-theme',
                                  'dark-theme'
                                )}
                              >
                                {block.height}
                              </Text>
                            </Link>
                          </Td>
                          <Td fontSize={{ base: 'xs', md: 'sm' }}>
                            {block.appHash}
                          </Td>
                          <Td fontSize={{ base: 'xs', md: 'sm' }}>
                            {block.txCount}
                          </Td>
                          {block.Timestamp && (
                            <Td fontSize={{ base: 'xs', md: 'sm' }}>
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
                {blocks.length > 18 && (
                  <Box display={'flex'} justifyContent={'center'}>
                    <HStack
                      justifyContent="space-between"
                      alignSelf={''}
                      mt={4}
                      px={6}
                      pb={4}
                      width={'50%'}
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
                        Page {page} of {(totalBlocks / 30).toFixed(0)}
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
                )}
              </TableContainer>
            </Box>
          </Box>
        </GradientBackground>
      </Box>
    </>
  )
}
