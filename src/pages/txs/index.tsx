import { Box, Grid, GridItem, Img, Skeleton, Text } from '@chakra-ui/react'
import { StatusResponse } from '@cosmjs/tendermint-rpc'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { BoxInfo } from '@/components/shared/BoxInfo'
import GradientBackground from '@/components/shared/GradientBackground'
import TransactionList from '@/components/TransactionList'
import { selectNewBlock } from '@/store/streamSlice'
import { displayDate } from '@/utils/helper'
import { images } from '@/utils/images'

export default function Transactions() {
  const [isLoaded, setIsLoaded] = useState(false)
  const newBlock = useSelector(selectNewBlock)
  const [status, setStatus] = useState<StatusResponse | null>()
  useEffect(() => {
    if ((!isLoaded && newBlock) || (!isLoaded && status)) {
      setIsLoaded(true)
    }
  }, [isLoaded, newBlock, status])

  return (
    <GradientBackground title="Transactions">
      <Grid templateColumns="repeat(12, 1fr)" gap={5} mb={9}>
        <GridItem colSpan={3} display={'flex'} flexDirection={'column'} gap={5}>
          <Skeleton isLoaded={isLoaded}>
            <BoxInfo
              bgColor="green.200"
              color="green.600"
              name="TOTAL TXNS"
              value={
                newBlock?.header.time
                  ? displayDate(newBlock?.header.time?.toISOString())
                  : status?.syncInfo.latestBlockTime
                  ? displayDate(status?.syncInfo.latestBlockTime.toISOString())
                  : ''
              }
              tooltipText="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"
            />
          </Skeleton>
          <Skeleton isLoaded={isLoaded}>
            <BoxInfo
              name="MAX TPS"
              value={
                newBlock?.header.height
                  ? '#' + newBlock?.header.height
                  : '#' + status?.syncInfo.latestBlockHeight
              }
              tooltipText="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"
            />
          </Skeleton>
        </GridItem>
        <GridItem colSpan={9} bg={'pink'}></GridItem>
      </Grid>
      <TransactionList title="All Transactions" showAll={true} />
    </GradientBackground>
  )
}
