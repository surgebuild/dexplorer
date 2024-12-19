'use client'

import { Img } from '@chakra-ui/react'
import Image from 'next/image'
import { FC } from 'react'

import { useCopyToClipboard } from '@/utils/hooks/useCopyToClipboard'

export interface ICopyIconProps {
  icon: string
  text: string
  width?: number
  height?: number
}
const CopyIcon: FC<ICopyIconProps> = ({ icon, text, width, height }) => {
  const [, copyToClipBoard] = useCopyToClipboard()
  return (
    <Img
      src={icon}
      alt="copy"
      onClick={() => {
        copyToClipBoard(text)
      }}
      width={width ?? 15}
      height={height ?? 15}
      cursor={'pointer'}
    />
  )
}

export default CopyIcon
