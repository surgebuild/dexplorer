import { Box, Grid, GridItem, Img, Skeleton, Text } from '@chakra-ui/react'
import { toHex } from '@cosmjs/encoding'
import { StatusResponse } from '@cosmjs/tendermint-rpc'
import { Validator } from 'cosmjs-types/tendermint/types/validator'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { BoxInfo } from '@/components/shared/BoxInfo'
import GradientBackground from '@/components/shared/GradientBackground'
import ValidatorsList from '@/components/ValidatorsList'
import { getValidators } from '@/rpc/query'
import { selectTmClient } from '@/store/connectSlice'
import { selectNewBlock } from '@/store/streamSlice'

export default function Validators() {
  const tmClient = useSelector(selectTmClient)
  const [isLoaded, setIsLoaded] = useState(false)
  const newBlock = useSelector(selectNewBlock)
  const [status, setStatus] = useState<StatusResponse | null>()
  const [validators, setValidators] = useState<
    readonly Validator[] | Validator[]
  >([])
  const [totalValidators, setTotalValidators] = useState(0)
  const [validatorCount, setValidatorCount] = useState(0)

  useEffect(() => {
    if ((!isLoaded && newBlock) || (!isLoaded && status)) {
      setIsLoaded(true)
    }
  }, [isLoaded, newBlock, status])

  useEffect(() => {
    if (tmClient) {
      tmClient.status().then((response) => setStatus(response))
      getValidators(tmClient).then((response) => {
        //@ts-ignore
        setValidators(response.validators)
        setTotalValidators(response.total)
        setValidatorCount(response.count)
      })
    }
  }, [tmClient])

  return (
    <GradientBackground title="Validators">
      <Grid templateColumns="repeat(12, 1fr)" gap={5} mb={9}>
        <GridItem
          colSpan={{ base: 12, md: 3 }}
          display={'flex'}
          flexDirection={{ base: 'row', md: 'column' }}
          gap={5}
        >
          <Skeleton isLoaded={isLoaded} width={{ base: '50%', md: '100%' }}>
            <BoxInfo
              bgColor="green.200"
              color="green.600"
              name="TOTAL VALIDATORS"
              value={totalValidators}
              tooltipText=""
              height={{ base: '120px', md: '100px' }}
            />
          </Skeleton>
          <Skeleton isLoaded={isLoaded} width={{ base: '50%', md: '100%' }}>
            <BoxInfo
              name="ACTIVE VALIDATORS"
              value={validatorCount}
              tooltipText=""
              height={{ base: '120px', md: '100px' }}
            />
          </Skeleton>
        </GridItem>

        <GridItem
          colSpan={{ base: 12, md: 9 }}
          bg={'gray-900'}
          opacity={'35%'}
          borderRadius={'8px'}
        ></GridItem>
      </Grid>
      {/* @ts-ignore */}
      <ValidatorsList title="All Validators" list={validators} />
    </GradientBackground>
  )
}
