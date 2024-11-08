import { Box, HStack, Image, Link, Text } from '@chakra-ui/react'
import NextLink from 'next/link'

import { shortenAddress } from '@/utils/helper'
import { images } from '@/utils/images'

export default function RecentBlocks() {
  return (
    <Box>
      <HStack justifyContent={'space-between'} mb={3}>
        <Text fontSize={'2xl'} color={'gray-50'}>
          Recent Blocks
        </Text>
        <Text fontSize={'xs'} color={'gray-400'} pr={2} fontWeight={500}>
          Auto-Updates
        </Text>
      </HStack>
      <RecentBlock />
    </Box>
  )
}

const RecentBlock = () => {
  const dummyData = [
    {
      blockId: '291203',
      address:
        '0x00000000000000000001e4add93ab2a51d8d405d60177fd30f791027deefaffd',
      transactions: '1txn',
      timeAgo: '2hr ago',
    },
    {
      blockId: '291204',
      address:
        '0x00000000000000000002e4add93ab2a51d8d405d60177fd30f791027deefb001',
      transactions: '2txn',
      timeAgo: '3hr ago',
    },
    {
      blockId: '291204',
      address:
        '0x00000000000000000002e4add93ab2a51d8d405d60177fd30f791027deefb001',
      transactions: '2txn',
      timeAgo: '3hr ago',
    },
    // Add as many data objects as you want here
  ]
  return (
    <Box bg={'gray-1100'} borderRadius={12}>
      <Box px={4} py={5} bg="gray-1200" borderTopRadius={12}>
        <HStack justifyContent="space-between">
          <HStack gap={3}>
            <Image src={images.chainLink.src} alt="chain" />
            <HStack gap={1}>
              <Image width={5} src={images.bitcoinLogo.src} alt="bitcoin" />
              <Link
                as={NextLink}
                href={'/blocks'}
                _focus={{ boxShadow: 'none' }}
                display={'block'}
                fontSize={'14px'}
                color={'yellow-100'}
              >
                #291203
              </Link>
            </HStack>
          </HStack>
          <HStack gap={1}>
            <Link
              as={NextLink}
              href={'/blocks'}
              _focus={{ boxShadow: 'none' }}
              fontSize={'xs'}
              color={'gray-500'}
              textDecoration={'underline'}
            >
              {shortenAddress(
                '0x00000000000000000001e4add93ab2a51d8d405d60177fd30f791027deefaffd'
              )}
            </Link>
            <Box w={'2px'} h={'2px'} bg={'gray-500'} borderRadius={99} />
            <Text fontSize={'xs'} color={'gray-400'}>
              2hr ago
            </Text>
          </HStack>
        </HStack>
      </Box>
      <Box px={4} py={'14px'}>
        <Box position="relative">
          <Box
            position="absolute"
            left="20px"
            top="0"
            bottom="0"
            width="1px"
            bg="primary-900"
            zIndex="1"
          />

          {dummyData.map((data, index) => (
            <HStack
              key={index}
              justifyContent="space-between"
              py="14px"
              borderBottom="1px"
              borderColor="gray-900"
              ml={10}
              position="relative"
              _last={{ borderBottom: 'none' }}
            >
              <Image
                src={images.logoShort.src}
                alt="Surge"
                position="absolute"
                left="-30px"
                top="50%"
                transform="translateY(-50%)"
                zIndex={2}
              />
              <Box
                className="dots"
                position="absolute"
                left="-22px"
                top="50%"
                transform="translateY(-50%)"
                width="6px"
                height="6px"
                borderRadius="full"
                bg="primary-500"
                zIndex="2"
              />

              <HStack gap={3}>
                <HStack gap={1}>
                  <Image width={5} src={images.block.src} alt="block" />
                  <Link
                    as={NextLink}
                    href={`/blocks/${data.blockId}`}
                    _focus={{ boxShadow: 'none' }}
                    display="block"
                    fontSize="14px"
                    color="primary-200"
                  >
                    {data.blockId}
                  </Link>
                </HStack>
              </HStack>
              <HStack gap={1}>
                <Link
                  as={NextLink}
                  href={`/address/${data.address}`}
                  _focus={{ boxShadow: 'none' }}
                  fontSize="xs"
                  color="gray-500"
                  textDecoration="underline"
                >
                  {shortenAddress(data.address)}
                </Link>
                <Box w="2px" h="2px" bg="gray-500" borderRadius={99} />
                <Text fontSize="xs" color="gray-500">
                  {data.transactions}
                </Text>
                <Box w="2px" h="2px" bg="gray-500" borderRadius={99} />
                <Text fontSize="xs" color="gray-400">
                  {data.timeAgo}
                </Text>
              </HStack>
            </HStack>
          ))}
        </Box>
      </Box>
      <Box px={4} py={5} bg="gray-1200" borderBottomRadius={12}>
        <HStack gap={2}>
          <Image w={4} src={images.stars.src} alt="" />
          <HStack>
            <Text fontSize={'xs'} color={'gray-500'}>
              120 txns
            </Text>
            <Box w={'2px'} h={'2px'} bg={'gray-500'} borderRadius={99} />
            <Text fontSize={'xs'} color={'gray-500'}>
              12 blocks
            </Text>
            <Box w={'2px'} h={'2px'} bg={'gray-500'} borderRadius={99} />
            <Text fontSize={'xs'} color={'gray-500'}>
              ~6s settlement
            </Text>
          </HStack>
        </HStack>
      </Box>
    </Box>
  )
}
