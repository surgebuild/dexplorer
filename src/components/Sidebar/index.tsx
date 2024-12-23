import {
  Box,
  BoxProps,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  HStack,
  Icon,
  IconButton,
  Image,
  Link as NextLink,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect, useState } from 'react'
import { IconType } from 'react-icons'
import { FaGlobeAmericas } from 'react-icons/fa'
import { FiBox, FiMenu } from 'react-icons/fi'
import { GiTwoCoins } from 'react-icons/gi'
import { HiOutlineUsers } from 'react-icons/hi2'
import { IoLogoGithub, IoLogoTwitter } from 'react-icons/io'
import { MdOutlineHome } from 'react-icons/md'
import { PiDevToLogoFill, PiTreeStructure } from 'react-icons/pi'
import { VscGlobe } from 'react-icons/vsc'

import { images } from '@/utils/images'

import Navbar from '../Navbar'

interface LinkItemProps {
  name: string
  icon: IconType
  route: string
  isBlank?: boolean
}
interface RefLinkItemProps {
  icon: IconType
  route: string
  isBlank?: boolean
  iconColor?: boolean
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: MdOutlineHome, route: '/' },
  { name: 'Blocks', icon: FiBox, route: '/blocks' },
  { name: 'Transactions', icon: GiTwoCoins, route: '/txs' },
  { name: 'Validators', icon: HiOutlineUsers, route: '/validators' },
  { name: 'Signers', icon: FaGlobeAmericas, route: '/signer' },
]
const RefLinkItems: Array<RefLinkItemProps> = [
  {
    icon: IoLogoGithub,
    route: 'https://github.com/surgebuild',
    isBlank: true,
  },
  {
    icon: VscGlobe,
    route: 'https://surge.build/',
    isBlank: true,
  },
  {
    icon: IoLogoTwitter,
    route: 'https://x.com/SurgeBuild',
    isBlank: true,
  },
]

export default function Sidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box minH="100vh" bg={'dark-bg'}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>

      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: '280px' }}>{children}</Box>
    </Box>
  )
}

interface SidebarProps extends BoxProps {
  onClose: () => void
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      bg={'dark-bg'}
      borderRight="1px"
      borderRightColor={'gray-900'}
      w={{ base: 'full', md: '280px' }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex flexDirection="column" h="full" justifyContent="space-between">
        <Box>
          <Flex
            h={'65px'}
            mb="44px"
            alignItems="center"
            mx="8"
            justifyContent="space-between"
          >
            <Link href="/">
              <Image
                w={122}
                pt={5}
                src={images.logo.src}
                alt="logo"
                style={{ cursor: 'pointer' }}
              />
            </Link>

            <CloseButton
              display={{ base: 'flex', md: 'none' }}
              onClick={onClose}
            />
          </Flex>
          {LinkItems.map((link) => (
            <NavItem
              key={link.name}
              icon={link.icon}
              route={link.route}
              onClose={onClose}
            >
              {link.name}
            </NavItem>
          ))}
        </Box>
        <Flex justifyContent="center" mb="10">
          <HStack spacing="20px">
            {RefLinkItems.map((link, key) => (
              <RefLinkItem
                key={key}
                icon={link.icon}
                route={link.route}
                isBlank={link.isBlank}
                iconColor={link.iconColor}
                onClose={onClose} // Pass onClose to RefLinkItem
              />
            ))}
          </HStack>
        </Flex>
      </Flex>
    </Box>
  )
}

interface NavItemProps extends FlexProps {
  icon: IconType
  children?: string | number
  route: string
  isBlank?: boolean
  onClose?: () => void // Add onClose prop
}
const NavItem = ({
  icon,
  children,
  route,
  isBlank,
  onClose,
  ...rest
}: NavItemProps) => {
  const router = useRouter()
  const [isSelected, setIsSelected] = useState(false)

  useEffect(() => {
    if (route === '/') {
      setIsSelected(router.route === route)
    } else {
      setIsSelected(router.route.includes(route))
    }
  }, [router])

  const handleClick = () => {
    if (onClose) {
      onClose() // Close the mobile menu when a link is clicked
    }
  }

  return (
    <NextLink
      href={route}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
      target={isBlank ? '_blank' : '_self'}
      mb={'3'}
      display={'block'}
      onClick={handleClick} // Add onClick handler
    >
      <Flex
        className={`${isSelected ? 'primary_gradient' : ''}`}
        align="center"
        px="4"
        py="3"
        mx="8"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        color={isSelected ? 'white' : 'gray-500'}
        fontWeight={isSelected ? 'bold' : 'medium'}
        _hover={{
          color: isSelected ? 'white' : 'dark-theme',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="2"
            fontSize="22"
            _groupHover={{
              color: isSelected ? 'white' : 'dark-theme',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </NextLink>
  )
}

interface RefLinkItemProps extends FlexProps {
  icon: IconType
  children?: string | number
  route: string
  iconColor?: boolean
  isBlank?: boolean
  onClose?: () => void // Add onClose prop
}
const RefLinkItem = ({
  icon,
  route,
  isBlank,
  iconColor,
  onClose,
}: RefLinkItemProps) => {
  const handleClick = () => {
    if (onClose) {
      onClose() // Close the mobile menu when a link is clicked
    }
  }

  return (
    <NextLink
      href={route}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
      target={isBlank ? '_blank' : '_self'}
      display={'block'}
      onClick={handleClick} // Add onClick handler
    >
      {icon && (
        <Icon
          color={iconColor ? '#F66949' : 'gray-500'}
          _hover={{
            color: 'primary-400',
          }}
          cursor="pointer"
          fontSize="22"
          as={icon}
        />
      )}
    </NextLink>
  )
}

interface MobileProps extends FlexProps {
  onOpen: () => void
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={'dark-bg'}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Navbar />
    </Flex>
  )
}
