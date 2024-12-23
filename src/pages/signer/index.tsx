import { Box, Grid, GridItem, Img, Skeleton, Text } from '@chakra-ui/react'
import { StatusResponse } from '@cosmjs/tendermint-rpc'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { BoxInfo } from '@/components/shared/BoxInfo'
import GradientBackground from '@/components/shared/GradientBackground'
import SignersList from '@/components/SignersList'
import ValidatorsList from '@/components/ValidatorsList'
import { selectNewBlock } from '@/store/streamSlice'

export default function Signers() {
  const [isLoaded, setIsLoaded] = useState(false)
  const newBlock = useSelector(selectNewBlock)
  const [status, setStatus] = useState<StatusResponse | null>()
  useEffect(() => {
    if ((!isLoaded && newBlock) || (!isLoaded && status)) {
      setIsLoaded(true)
    }
  }, [isLoaded, newBlock, status])

  return (
    <GradientBackground title="Signers">
      <Grid templateColumns="repeat(12, 1fr)" gap={5} mb={9}>
        <GridItem
          colSpan={{ base: 12, md: 6 }}
          display={'flex'}
          flexDirection={{ base: 'row', md: 'row' }}
          gap={5}
        >
          <Skeleton isLoaded={isLoaded} width={{ base: '50%', md: '100%' }}>
            <BoxInfo
              bgColor="green.200"
              color="green.600"
              name="TOTAL SIGNERS"
              value={3}
              tooltipText="The total number of registered signers on the Surge Devnet, including those actively participating and those currently inactive."
            />
          </Skeleton>
          <Skeleton isLoaded={isLoaded} width={{ base: '50%', md: '100%' }}>
            <BoxInfo
              name="ACTIVE SIGNERS"
              value={2}
              tooltipText="The number of signers currently active on the Surge Devnet, contributing to transaction signing and network consensus."
            />
          </Skeleton>
        </GridItem>
        {/* <GridItem
          colSpan={{ base: 12, md: 9 }}
          bg={'gray-900'}
          opacity={'35%'}
          borderRadius={'8px'}
        ></GridItem> */}
      </Grid>
      <SignersList title="All Signers" />
    </GradientBackground>
  )
}
