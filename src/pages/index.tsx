import '@/styles/Home.module.css'

import {
  Box,
  FlexProps,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Image,
  SimpleGrid,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import { toHex } from '@cosmjs/encoding'
import { StatusResponse, TxData, TxEvent } from '@cosmjs/tendermint-rpc'
import { TxBody } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import RecentBlocks from '@/components/RecentBlocks'
import { BoxInfo } from '@/components/shared/BoxInfo'
import TransactionList from '@/components/TransactionList'
import {
  getLatestTxs,
  getTotalInscriptions,
  getTxsByRestApi,
  getValidators,
} from '@/rpc/query'
import { selectTmClient } from '@/store/connectSlice'
import { selectNewBlock, selectTxEvent } from '@/store/streamSlice'
import {
  extractSenderAndRecipient,
  normalizeToISOString,
  sanitizeString,
} from '@/utils'
import { displayDate } from '@/utils/helper'
import { images } from '@/utils/images'

interface Tx {
  hash: any
  TxEvent: TxEvent
  Timestamp: string
  height: number
}

const MAX_ROWS = 20

export default function Home() {
  const tmClient = useSelector(selectTmClient)
  const newBlock = useSelector(selectNewBlock)
  const txEvent = useSelector(selectTxEvent)
  const [validators, setValidators] = useState<number>()
  const [isLoaded, setIsLoaded] = useState(false)
  const [status, setStatus] = useState<StatusResponse | null>()
  const [totalInscription, setTotalInscription] = useState<number>(0)
  const [txs, setTxs] = useState<Tx[]>([])
  const [totalTxs, setTotalTxs] = useState(0)
  const [page, setPage] = useState(1)
  const [loadingTx, setLoadingTx] = useState(false)

  useEffect(() => {
    if (tmClient) {
      tmClient.status().then((response) => setStatus(response))
      getValidators(tmClient).then((response) => setValidators(response.total))
    }
  }, [tmClient])

  useEffect(() => {
    const fetchTransactions = async () => {
      const restEndpoint = 'https://rpc.devnet.surge.dev'
      const searchParams = {
        order: 'timestamp.desc',
        limit: 20,
      }
      const searchParams_restapi = {
        query: `"tx.height>0"`,
        per_page: '10',
        page: `${page}`,
        order_by: `"desc"`,
      }
      try {
        const { txData } = await getLatestTxs(searchParams)
        const { txsCount } = await getTxsByRestApi(
          restEndpoint,
          searchParams_restapi
        )
        setLoadingTx(true)
        const formattedTxs = await Promise.all(
          txData.map(async (tx: any) => {
            return {
              hash: tx.hash,
              height: tx.height,
              Timestamp: normalizeToISOString(tx.timestamp), // Use resolved timestamp here
              status: 0, //need to update
              fromAddress: tx.sender,
              toAddress: tx.receiver,
              txType: tx.method_name,
            }
          })
        )
        setLoadingTx(false)
        setTxs(formattedTxs)
        setTotalTxs(txsCount)
      } catch (error) {
        setLoadingTx(false)
        console.error('Error fetching transactions from REST API:', error)
      }
    }
    fetchTransactions()
  }, [])

  useEffect(() => {
    if (txEvent) {
      updateTxs(txEvent)
    }
  }, [txEvent])

  //deploy commit

  const updateTxs = (txEvent: TxEvent) => {
    if (!txEvent.result.data) {
      return
    }
    console.log(txEvent, 'txEvent')
    const data = TxBody.decode(txEvent.result.data)
    console.log(data, 'data from txevent')
    const result = extractSenderAndRecipient(txEvent)
    const tx = {
      TxEvent: txEvent,
      Timestamp: new Date().toISOString(),
      data: data,
      height: txEvent.height,
      hash: toHex(txEvent.hash).toUpperCase(),
      status: txEvent.result.code,
      fromAddress: result?.sender ?? '',
      toAddress: result?.recipient ?? '',
      txType: sanitizeString(data.memo),
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

  // Function to handle the interval call
  async function checkBitcoinData() {
    const data = await getTotalInscriptions()

    const length = data?.pagination?.total ?? 0
    setTotalInscription(length)
  }

  useEffect(() => {
    const intervalId = setInterval(checkBitcoinData, 5000)
  }, [])

  useEffect(() => {
    if ((!isLoaded && newBlock) || (!isLoaded && status)) {
      setIsLoaded(true)
    }
  }, [isLoaded, newBlock, status])

  return (
    <>
      <Head>
        <title>Home | Surge Devnet Explorer</title>
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
      <main className="home_main">
        <Image
          src={images.pattern.src}
          position="absolute"
          pointerEvents={'none'}
          w={'full'}
          left={0}
          top={0}
          maxHeight={'430px'}
          alt="pattern"
        />
        <Box
          position="relative"
          paddingLeft={{ md: 14 }}
          paddingRight={{ md: 14 }}
        >
          <Text
            fontSize={{ base: '28px', md: '40px' }}
            lineHeight="52px"
            color={'white'}
            fontWeight="bold"
          >
            Surge Explorer
          </Text>
          <Box mt={{ base: 3, md: 7 }} mb={{ base: 4, md: 8 }}>
            <SimpleGrid
              minChildWidth={{ base: '45%', md: '200px' }}
              spacing={{ base: '12px', md: '20px' }}
            >
              <Skeleton isLoaded={isLoaded}>
                <BoxInfo
                  bgColor="green.200"
                  color="green.600"
                  name="TOTAL TXNS"
                  value={`#${totalTxs}`}
                  tooltipText="The total number of transactions processed on the Surge Devnet, including all transfers, inscriptions, and other activities."
                />
              </Skeleton>

              <Skeleton isLoaded={isLoaded}>
                <BoxInfo
                  name="TOTAL INSCRIPTIONS"
                  value={'#' + totalInscription}
                  tooltipText="The total count of inscriptions created on the Surge Devnet, representing unique digital artifacts or data stored on the blockchain."
                />
              </Skeleton>
              <Skeleton isLoaded={isLoaded}>
                <BoxInfo
                  name="LATEST BLOCK"
                  value={
                    newBlock?.header.height
                      ? '#' + newBlock?.header.height
                      : '#' + status?.syncInfo.latestBlockHeight
                  }
                  tooltipText="The most recently mined block on the Surge Devnet, containing transactions and inscriptions added to the blockchain."
                />
              </Skeleton>
              {/* <Skeleton isLoaded={isLoaded}>
                <BoxInfo
                  name="MAX TPS"
                  value={'-'}
                  tooltipText="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"
                />
              </Skeleton> */}
            </SimpleGrid>
          </Box>
          <Grid templateColumns="repeat(12, 1fr)" gap={5} pb={10}>
            <GridItem colSpan={{ base: 12, md: 7 }}>
              <TransactionList
                title="Transactions"
                showAll={false}
                txs={txs?.length ? txs : []}
                totalTxs={totalTxs}
                // page={page}
                // setPage={setPage}
                loading={loadingTx}
              />
            </GridItem>
            <GridItem
              colSpan={{ base: 12, md: 5 }}
              bg="dark-bg"
              px={{ base: 5, md: 7 }}
              pt={10}
              pb={6}
              borderRadius={12}
              border={'1px'}
              borderColor={'gray-900'}
            >
              <RecentBlocks />
            </GridItem>
          </Grid>
        </Box>
      </main>
    </>
  )
}
