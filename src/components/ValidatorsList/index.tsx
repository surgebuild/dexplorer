import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { toHex } from '@cosmjs/encoding'
import { Validator } from 'cosmjs-types/tendermint/types/validator'

import { getColor, truncate } from '@/utils'

interface IValidatorsList {
  title: string
  list: Validator[]
}

export default function ValidatorsList({ title, list }: IValidatorsList) {
  const totalVotingPower = list.reduce(
    (acc, validator) => acc + BigInt(validator.votingPower),
    BigInt(0n)
  )
  return (
    <Box
      pt={10}
      pb={1}
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
      <TableContainer>
        <Table>
          <Thead px={6}>
            <Tr>
              <Th
                borderColor={'gray-900'}
                color={'text-500'}
                width={'20%'}
                className="label_regular"
              >
                Validators
              </Th>
              <Th borderColor={'gray-900'} color={'text-500'} width={'20%'}>
                Status
              </Th>
              <Th borderColor={'gray-900'} color={'text-500'} width={'20%'}>
                Address Associated
              </Th>
              <Th borderColor={'gray-900'} color={'text-500'} width={'15%'}>
                Voting Power
              </Th>
              <Th borderColor={'gray-900'} color={'text-500'} width={'15%'}>
                Commission
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {list.map((validator, ind) => {
              const percentage =
                (Number(validator.votingPower) / Number(totalVotingPower)) * 100
              return (
                <Tr
                  key={ind}
                  px={6}
                  borderBottom={'1px'}
                  borderColor={'gray-900'}
                  _last={{ borderBottom: 'none' }}
                >
                  <Td border={'none'}>
                    <Text className="body2_regular" color={'white'}>
                      {`Validator ${ind + 1}`}
                    </Text>
                  </Td>
                  <Td border={'none'}>
                    <Text
                      px={2}
                      py={1}
                      borderRadius={'8px'}
                      bg={getColor(1)}
                      className="label_regular"
                      color={'white'}
                      width={'max-content'}
                      textAlign={'center'}
                    >
                      {'Active'}
                    </Text>
                  </Td>
                  <Td
                    border={'none'}
                    className="supportText_semibold"
                    color={'text-50'}
                  >{`# ${truncate(
                    toHex(validator.address),
                    8
                  ).toUpperCase()}`}</Td>
                  <Td
                    border={'none'}
                    className="body2_regular"
                    color={'text-50'}
                  >
                    {`${percentage} %`}
                  </Td>
                  <Td
                    border={'none'}
                    className="body2_regular"
                    color={'text-50'}
                  >{`0%`}</Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  )
}
