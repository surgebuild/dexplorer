import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'

import BitcoinPriceDifference from '../BitcoinPriceWidget'

const heightRegex = /^\d+$/
const txhashRegex = /^[A-Z\d]{64}$/
const addrRegex = /^[a-z\d]+1[a-z\d]{38,58}$/

export default function Navbar() {
  const router = useRouter()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [inputSearch, setInputSearch] = useState('')
  const isMobile = useBreakpointValue({ base: true, md: false })

  const handleInputSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearch(event.target.value)
  }

  const handleSearch = (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault()

    if (!inputSearch) {
      toast({
        title: 'Please enter a value!',
        status: 'warning',
        isClosable: true,
      })
      return
    }

    if (heightRegex.test(inputSearch)) {
      router.push('/blocks/' + inputSearch)
    } else if (txhashRegex.test(inputSearch)) {
      router.push('/txs/' + inputSearch)
    } else if (addrRegex.test(inputSearch)) {
      router.push('/accounts/' + inputSearch)
    } else {
      toast({
        title: 'Invalid Height, Transaction, or Account Address!',
        status: 'error',
        isClosable: true,
      })
      return
    }
    setInputSearch('')
    if (isMobile) onClose()
  }

  return (
    <Box
      bg={'dark-bg'}
      w="100%"
      py={{ base: 1, md: 5 }}
      px={{ base: 1, md: 14 }}
      shadow={'base'}
      borderBottom={{ base: '0px', md: '1px' }}
      borderBottomColor={{ base: 'gray-900', md: 'gray-900' }}
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
    >
      {isMobile ? (
        <>
          <IconButton
            variant="ghost"
            aria-label="Search"
            size="sm"
            fontSize="20"
            ml={2}
            color={'GrayText'}
            icon={<FiSearch />}
            onClick={onOpen}
          />
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent
              bg={'dark-bg'}
              border={'1px'}
              borderColor={'GrayText'}
              w={'95%'}
              position={'absolute'}
              top={'120px'}
            >
              <ModalHeader fontSize={'lg'}>Search</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Input
                  width="100%"
                  type="text"
                  placeholder="Height/Transaction/Account Address"
                  value={inputSearch}
                  onChange={handleInputSearch}
                  borderColor="GrayText"
                  focusBorderColor="#ad3014"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  bg="primary-700"
                  _hover={{ opacity: 0.8 }}
                  color="white"
                  w="full"
                  textTransform="uppercase"
                  onClick={() => handleSearch()}
                  fontSize={'14px'}
                >
                  Search
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      ) : (
        <Flex align="center" gap={4}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray" />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Height/Transaction/Account Address"
                value={inputSearch}
                onChange={handleInputSearch}
                borderColor="GrayText"
                width="400px"
                borderRadius="full"
                focusBorderColor="#ad3014"
              />
            </InputGroup>
          </form>
        </Flex>
      )}
      <Flex align="center" gap={{ md: 5, base: 1 }}>
        <BitcoinPriceDifference />
        <Box pl={5}>
          <Text
            fontSize={{ base: 'sm', md: 'md' }}
            fontWeight="medium"
            color="text-200"
            px={{ md: 6, base: 2 }}
            py={{ base: '6px', md: '10px' }}
            border="1px"
            borderColor="text-200"
            borderRadius="full"
          >
            Alpha Testnet
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}
