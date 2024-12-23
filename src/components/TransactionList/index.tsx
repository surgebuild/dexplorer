import {
  Box,
  Button,
  HStack,
  Img,
  Link,
  Table,
  TableContainer,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react'
import { toHex } from '@cosmjs/encoding'
import NextLink from 'next/link'
import router from 'next/router'
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactFragment,
  ReactPortal,
} from 'react'
import { FiCheck, FiX } from 'react-icons/fi'

import {
  capitalizeFirstLetter,
  getColor,
  getRelativeTime,
  sanitizeString,
  truncate,
} from '@/utils'
import { timeFromNow } from '@/utils/helper'
import { images } from '@/utils/images'

interface ITransactionList {
  title: string
  showAll: boolean
  txs: any
  // page: number
  // setPage: (page: number) => void
  totalTxs: number
  loading: boolean
}

export default function TransactionList({
  title,
  showAll,
  txs,
  // page = 1,
  // setPage,
  totalTxs,
  loading = false,
}: ITransactionList) {
  // const handlePreviousPage = () => {
  //   if (page > 1) {
  //     setPage!(page - 1)
  //   }
  // }

  // const handleNextPage = () => {
  //   if (page < totalTxs / 20) {
  //     setPage!(page + 1)
  //   }
  // }
  return (
    <Box
      pt={10}
      pb={showAll ? 1 : 5}
      border={'1px'}
      borderColor={'gray-900'}
      bg={'dark-bg'}
      borderRadius={12}
    >
      <Text
        fontWeight={'500'}
        fontSize={'16px'}
        lineHeight={'25px'}
        mb={2}
        px={6}
        color={'text-50'}
      >
        {title}
      </Text>
      <TableContainer display={'block'}>
        <Table>
          <Thead px={6}>
            <Tr>
              <Th borderColor={'gray-900'} color={'text-500'} width={'25%'}>
                Transaction Hash
              </Th>
              <Th borderColor={'gray-900'} color={'text-500'} width={'25%'}>
                Function
              </Th>
              <Th borderColor={'gray-900'} color={'text-500'} width={'25%'}>
                From
              </Th>
              <Th borderColor={'gray-900'} color={'text-500'} width={'25%'}>
                To
              </Th>
              {/* <Th borderColor={'gray-900'} color={'text-500'} width={'10%'}>
                Height
              </Th>
              <Th borderColor={'gray-900'} color={'text-500'} width={'15%'}>
                Time
              </Th> */}
            </Tr>
          </Thead>
          <Tbody>
            {txs.length > 0 && !loading ? (
              txs.map(
                (
                  transaction: {
                    hash: string
                    TxEvent: { result: { code: number } }
                    height: string
                    // | boolean
                    // | ReactElement<any, string | JSXElementConstructor<any>>
                    // | ReactFragment
                    // | ReactPortal
                    // | null
                    // | undefined
                    Timestamp: string
                    status: number
                    fees: any
                    feeValue: any
                    fromAddress: string
                    toAddress: string
                    txType: string
                  },
                  ind: Key | null | undefined
                ) => (
                  <Tr
                    key={ind}
                    px={6}
                    borderBottom={'1px'}
                    borderColor={'gray-900'}
                    _last={{ borderBottom: 'none' }}
                  >
                    <Td border={'none'} fontSize={'xs'} color={'text-50'}>
                      {/* <Link
                        as={NextLink}
                        href={'/txs/' + transaction.hash}
                        _focus={{ boxShadow: 'none' }}
                        _hover={{ textDecoration: 'underline' }}
                      >
                        # {truncate(transaction.hash, 6)}
                      </Link>  */}
                      <HashComponent
                        txHash={transaction.hash}
                        txStatus={transaction.status}
                        blockHeight={transaction.height}
                        time={transaction.Timestamp}
                      />
                    </Td>
                    <Td border={'none'} fontSize={'xs'}>
                      {/* <Text
                        fontSize={{ base: 'xs', md: 'sm' }}
                        color={'gray-50'}
                      >
                        {sanitizeString(transaction.txType)}
                      </Text> */}
                      <Tag variant="subtle" colorScheme="cyan">
                        <TagLabel fontSize={{ base: 'xs', md: 'sm' }}>
                          {sanitizeString(transaction.txType)}
                        </TagLabel>
                      </Tag>
                    </Td>
                    {/* <Td border={'none'}>
                      {transaction.status == 0 ? (
                        <Tag variant="subtle" colorScheme="green">
                          <TagLeftIcon as={FiCheck} />
                          <TagLabel fontSize={{ base: 'xs', md: 'sm' }}>
                            Success
                          </TagLabel>
                        </Tag>
                      ) : (
                        <Tag variant="subtle" colorScheme="red">
                          <TagLeftIcon as={FiX} />
                          <TagLabel fontSize={{ base: 'xs', md: 'sm' }}>
                            Error
                          </TagLabel>
                        </Tag>
                      )}
                    </Td> */}
                    <Td border={'none'}>
                      <HStack justifyContent={'space-between'}>
                        <Text
                          fontSize={{ base: 'xs', md: 'sm' }}
                          color={'text-link'}
                        >
                          <Link
                            as={NextLink}
                            href={'/accounts/' + transaction.fromAddress}
                            _hover={{ textDecoration: 'underline' }}
                            _focus={{ boxShadow: 'none' }}
                          >
                            {truncate(
                              transaction.fromAddress,
                              showAll ? 10 : 6
                            )}
                          </Link>
                        </Text>
                        <Img
                          src={images.rightArrow.src}
                          width={6}
                          height={6}
                          alt="arrow"
                          mr={{ base: 0, md: 6 }}
                        />
                      </HStack>
                    </Td>
                    <Td border={'none'}>
                      <Text
                        fontSize={{ base: 'xs', md: 'sm' }}
                        color={'text-link'}
                      >
                        <Link
                          as={NextLink}
                          href={'/accounts/' + transaction.toAddress}
                          _hover={{ textDecoration: 'underline' }}
                          _focus={{ boxShadow: 'none' }}
                        >
                          {truncate(transaction.toAddress, showAll ? 10 : 6)}
                        </Link>
                      </Text>
                    </Td>
                    {/* <Td border={'none'} pr={1}>
                      <Box
                        display={'flex'}
                        gap={4}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                      >
                        <Text
                          fontSize={{ base: 'xs', md: 'sm' }}
                          color={'text-link'}
                        >
                          <Link
                            as={NextLink}
                            href={'/blocks/' + transaction.height}
                            _hover={{ textDecoration: 'underline' }}
                            _focus={{ boxShadow: 'none' }}
                          >
                            {transaction.height}
                          </Link>
                        </Text>
                      </Box>
                    </Td> */}
                    {/* <Td border={'none'}>
                      <Text
                        fontSize={{ base: 'xs', md: 'sm' }}
                        color={'text-link'}
                      >
                        {getRelativeTime(String(transaction.Timestamp))}
                      </Text>
                    </Td> */}
                  </Tr>
                )
              )
            ) : (
              <Tr>
                <Td
                  border={'none'}
                  color={'text-50'}
                  colSpan={4}
                  textAlign="center"
                  pt={8}
                  fontSize={{ base: 'xs', md: 'base' }}
                >
                  Loading Transactions...
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
      {!showAll && txs?.length > 0 && (
        <Box width={'full'} px={4}>
          <Button
            border={'1px'}
            borderColor={'primary-500'}
            width={'100%'}
            alignSelf={'center'}
            mt={4}
            bg={'dark-bg'}
            color={'primary-500'}
            borderRadius={'12px'}
            _hover={{
              bg: '#010101',
            }}
            onClick={() => {
              router.push('/txs')
            }}
          >
            See all transactions
          </Button>
        </Box>
      )}
      {/* {showAll && txs.length > 18 && (
        <Box display={'flex'} justifyContent={{ md: 'center' }}>
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
              Page {page} of {(totalTxs / 20).toFixed(0)}
            </Text>
            <Button
              onClick={handleNextPage}
              disabled={page === totalTxs / 20}
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
    </Box>
  )
}

interface IHashComponent {
  txHash: string
  blockHeight: string
  txStatus: number
  time: string
}

const HashComponent = ({
  txHash,
  blockHeight,
  txStatus,
  time,
}: IHashComponent) => {
  return (
    <Box>
      <VStack gap={'6px'} alignItems={'start'}>
        <HStack gap={'2px'}>
          <Link
            as={NextLink}
            href={'/txs/' + txHash}
            style={{ display: 'flex', gap: '2px' }}
            _focus={{ boxShadow: 'none' }}
            _hover={{ textDecoration: 'underline' }}
          >
            <Text
              fontWeight={'medium'}
              fontSize={'xs'}
              lineHeight={'18px'}
              color={'text-200'}
            >
              #
            </Text>
            <Text
              fontWeight={'medium'}
              fontSize={'xs'}
              lineHeight={'18px'}
              color={'text-50'}
            >
              {truncate(txHash, 8)}
            </Text>
          </Link>
        </HStack>
        <HStack gap={'2px'}>
          <Img src={images.blockLogo.src} width={'12px'} height={'12px'} />
          <Text fontSize={'xs'} lineHeight={'15px'} color={'primary-200'}>
            <Link
              as={NextLink}
              href={'/blocks/' + blockHeight}
              _focus={{ boxShadow: 'none' }}
              _hover={{ textDecoration: 'underline' }}
            >
              {blockHeight}
            </Link>
          </Text>
          <Dot />
          <Text
            color={getColor(txStatus)}
            fontSize={'xs'}
            fontWeight={'medium'}
          >
            {capitalizeFirstLetter(txStatus == 0 ? 'success' : 'error')}
          </Text>
          <Dot />
          <Text fontSize={'xs'} color={'gray-50'} lineHeight={'15px'}>
            {getRelativeTime(time)}
          </Text>
        </HStack>
      </VStack>
    </Box>
  )
}

const Dot = () => {
  return <Box minW={'2px'} minH={'2px'} bg={'gray.300'} rounded="full" mx={1} />
}
