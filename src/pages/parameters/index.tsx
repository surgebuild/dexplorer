import {
  Divider,
  Heading,
  HStack,
  Icon,
  Link,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import Head from 'next/head'
import NextLink from 'next/link'
import { FiChevronRight, FiHome } from 'react-icons/fi'

import DistributionParameters from '@/components/Parameters/DistributionParameters'
import GovParameters from '@/components/Parameters/GovParameters'
import MintParameters from '@/components/Parameters/MintParameters'
import SlashingParameters from '@/components/Parameters/SlashingParameters'
import StakingParameters from '@/components/Parameters/StakingParameters'

export default function Parameters() {
  return (
    <>
      <Head>
        <title>Parameters | Surge Devnet Explorer</title>
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
      <main>
        <HStack h="24px">
          <Heading size={'md'}>Parameters</Heading>
          <Divider borderColor={'gray'} size="10px" orientation="vertical" />
          <Link
            as={NextLink}
            href={'/'}
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}
            display="flex"
            justifyContent="center"
          >
            <Icon
              fontSize="16"
              color={useColorModeValue('light-theme', 'dark-theme')}
              as={FiHome}
            />
          </Link>
          <Icon fontSize="16" as={FiChevronRight} />
          <Text>Parameters</Text>
        </HStack>
        <MintParameters />
        <StakingParameters />
        <GovParameters />
        <DistributionParameters />
        <SlashingParameters />
      </main>
    </>
  )
}
