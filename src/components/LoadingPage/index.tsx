import { Flex, Spinner, useColorModeValue } from '@chakra-ui/react'
import Head from 'next/head'

export default function LoadingPage() {
  return (
    <>
      <Head>
        <title>Surge Devnet Explorer</title>
        <meta
          name="description"
          content="Explore the Surge Devnet blockchain with ease. Access real-time data, transactions, and blockchain analytics."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        w="100"
        bg={useColorModeValue('gray.100', 'gray.900')}
      >
        <Spinner size="xl" />
      </Flex>
    </>
  )
}
