import {
  Box,
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
import { getTypeMsg, timeFromNow, trimHash } from '@/utils/helper'

const MAX_ROWS = 20

interface Tx {
  TxEvent: TxEvent
  Timestamp: Date
}

export default function Blocks() {
  const newBlock = useSelector(selectNewBlock)
  const txEvent = useSelector(selectTxEvent)
  const [blocks, setBlocks] = useState<NewBlockEvent[]>([])

  useEffect(() => {
    if (newBlock) {
      updateBlocks(newBlock)
    }
  }, [newBlock])

  useEffect(() => {
    const fetchBlocks = async () => {
      const restEndpoint = 'https://rpc.devnet.surge.dev'
      const searchParams = {
        query: `"block.height>0"`,
        per_page: '20',
        page: `${1}`,
        order_by: `"desc"`,
      }

      try {
        const { blocksData } = await getBlocksByRestApi(
          restEndpoint,
          searchParams
        )
        console.log(blocksData, 'blocksData')
        const formattedBlocks = blocksData.map((block: any) => {
          return {
            height: block.block.header.height,
            hash: block.block.header.app_hash,
            Timestamp: block.block.header.time,
            txCount: block.block.data.txs.length,
          }
        })
        console.log(formattedBlocks, 'formatted blocks')
        // setBlocks(blocksData)
        // const formattedTxs = await Promise.all(
        //   txData.map(async (tx: any) => {
        //     const timestamp = await getTxTimeStamp(tx.height) // Resolve each timestamp
        //     return {
        //       hash: tx.hash,
        //       height: tx.height,
        //       Timestamp: timestamp, // Use resolved timestamp here
        //       status: tx.tx_result.code,
        //     }
        //   })
        // )
        // setApiTxs(formattedTxs)
        // setTxs(formattedTxs)
        // setTotalTxs(txsCount)
        // console.log(formattedTxs, 'formattedTxs')
      } catch (error) {
        console.error('Error fetching transactions from REST API:', error)
      }
    }

    fetchBlocks()
  }, [])

  const updateBlocks = (block: NewBlockEvent) => {
    if (blocks.length) {
      if (block.header.height > blocks[0].header.height) {
        setBlocks((prevBlocks) => [block, ...prevBlocks.slice(0, MAX_ROWS - 1)])
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

  return (
    <>
      <Head>
        <title>Blocks | Surge Explorer</title>
        <meta name="description" content="Blocks | Dexplorer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <GradientBackground title="Blocks">
          <Box>
            <Box
              mt={8}
              bg={'dark-bg'}
              borderRadius={4}
              border={'1px'}
              borderColor={'gray-900'}
            >
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>
                        <b>Height</b>
                      </Th>
                      <Th>App Hash</Th>
                      <Th>Txs</Th>
                      <Th>Time</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {blocks.map((block) => (
                      <Tr key={block.header.height}>
                        <Td>
                          <Link
                            as={NextLink}
                            href={'/blocks/' + block.header.height}
                            style={{ textDecoration: 'none' }}
                            _focus={{ boxShadow: 'none' }}
                          >
                            <Text
                              color={useColorModeValue(
                                'light-theme',
                                'dark-theme'
                              )}
                            >
                              {block.header.height}
                            </Text>
                          </Link>
                        </Td>
                        <Td noOfLines={1}>{toHex(block.header.appHash)}</Td>
                        <Td>{block.txs.length}</Td>
                        <Td>{timeFromNow(block.header.time.toISOString())}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </GradientBackground>
      </Box>
    </>
  )
}
