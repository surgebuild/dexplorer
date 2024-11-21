/* eslint-disable prettier/prettier */
import { InfoOutlineIcon } from '@chakra-ui/icons'
import {
  Box,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Skeleton,
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import { toHex } from '@cosmjs/encoding'
import { StatusResponse, TxEvent } from '@cosmjs/tendermint-rpc'
import { TxBody } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { BoxInfo } from '@/components/shared/BoxInfo'
import GradientBackground from '@/components/shared/GradientBackground'
import TransactionsChart from '@/components/shared/TpsChart'
import TransactionList from '@/components/TransactionList'
import { getTxsByRestApi, getTxTimeStamp } from '@/rpc/query'
import { selectNewBlock, selectTxEvent } from '@/store/streamSlice'
import { MAX_ROWS } from '@/utils/constant'

interface Tx {
  hash: any
  TxEvent: TxEvent
  Timestamp: string
  height: number
}

export default function Transactions() {
  const txEvent = useSelector(selectTxEvent)
  const [isLoaded, setIsLoaded] = useState(false)
  const newBlock = useSelector(selectNewBlock)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<StatusResponse | null>()
  const [txs, setTxs] = useState<Tx[]>([])
  const [totalTxs, setTotalTxs] = useState(0)
  const [loadingTx, setLoadingTx] = useState(false)

  useEffect(() => {
    const fetchTransactions = async () => {
      const restEndpoint = 'https://rpc.devnet.surge.dev'
      const searchParams = {
        query: `"tx.height>0"`,
        per_page: '20',
        page: `${page}`,
        order_by: `"desc"`,
      }

      try {
        setLoadingTx(true)
        const { txData, txsCount } = await getTxsByRestApi(
          restEndpoint,
          searchParams
        )
        const formattedTxs = await Promise.all(
          txData.map(async (tx: any) => {
            const timestamp = await getTxTimeStamp(tx.height) // Resolve each timestamp
            return {
              hash: tx.hash,
              height: tx.height,
              Timestamp: timestamp, // Use resolved timestamp here
              status: tx.tx_result.code,
            }
          })
        )
        // setApiTxs(formattedTxs)
        setLoadingTx(false)
        setTxs(formattedTxs)
        setTotalTxs(txsCount)
        console.log(formattedTxs, 'formattedTxs')
      } catch (error) {
        setLoadingTx(false)
        console.error('Error fetching transactions from REST API:', error)
      }
    }

    fetchTransactions()
  }, [page])

  const updateTxs = (txEvent: TxEvent) => {
    if (!txEvent.result.data) {
      return
    }

    const data = TxBody.decode(txEvent.result.data)

    const tx = {
      TxEvent: txEvent,
      Timestamp: new Date().toISOString(),
      data: data,
      height: txEvent.height,
      hash: toHex(txEvent.hash).toUpperCase(),
      status: txEvent.result.code,
    }
    if (txs.length) {
      if (txEvent.height >= txs[0].height && txEvent.hash != txs[0].hash) {
        const updatedTx = [tx, ...txs.slice(0, MAX_ROWS - 1)].filter(
          (transaction, index, self) =>
            index ===
            self.findIndex((transx) => transx.hash === transaction.hash)
        )
        setTxs(updatedTx)
      }
    } else {
      setTxs([tx])
    }
  }

  useEffect(() => {
    if ((!isLoaded && newBlock) || (!isLoaded && status)) {
      setIsLoaded(true)
    }
  }, [isLoaded, newBlock, status])

  useEffect(() => {
    if (txEvent) {
      updateTxs(txEvent)
    }
  }, [txEvent])

  return (
    <>
      <Head>
        <title>Transactions | Surge Explorer</title>
        <meta name="description" content="Transactions | Surge Explorer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <GradientBackground title="Transactions">
          <Grid templateColumns="repeat(12, 1fr)" gap={5} mb={9}>
            <GridItem
              colSpan={{ base: 12, md: 8 }}
              display={'flex'}
              flexDirection={{ base: 'row', md: 'row' }}
              gap={5}
            >
              <Skeleton isLoaded={isLoaded} width={{ base: '50%', md: '100%' }}>
                <BoxInfo
                  bgColor="green.200"
                  color="green.600"
                  name="TOTAL TXNS"
                  value={`#${totalTxs}`}
                  tooltipText="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"
                />
              </Skeleton>
              <Skeleton isLoaded={isLoaded} width={{ base: '50%', md: '100%' }}>
                <BoxInfo
                  name="MAX TPS"
                  value={'-'}
                  tooltipText="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"
                />
              </Skeleton>
            </GridItem>
            {/* <GridItem colSpan={{ base: 12, md: 9 }}>
              <Box>
                <VStack
                  bg={'gray-1000'}
                  borderRadius={12}
                  p={4}
                  pb={2}
                  border={'1px'}
                  h={'220px'}
                  borderColor={'gray-900'}
                  align={'flex-start'}
                >
                  <HStack mb={'14px'}>
                    <Heading size={'xs'} color={'gray-500'} fontWeight={500}>
                      Transactions
                    </Heading>
                    <Tooltip
                      label={'tooltip text'}
                      placement="right"
                      bg="gray.300"
                      color="black"
                    >
                      <Icon as={InfoOutlineIcon} w={'13px'} color="gray-500" />
                    </Tooltip>
                  </HStack>

                  <TransactionsChart />
                </VStack>
              </Box>
            </GridItem> */}
          </Grid>
          <TransactionList
            title="All Transactions"
            showAll={true}
            txs={txs?.length ? txs : []}
            totalTxs={totalTxs}
            page={page}
            setPage={setPage}
            loading={loadingTx}
          />
        </GradientBackground>
      </main>
    </>
  )
}
