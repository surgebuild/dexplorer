export const components = {
  Heading: {
    baseStyle: {
      color: 'text-50',
      fontWeight: '500',
    },
  },
  Text: {
    baseStyle: {
      color: 'text-50',
    },
    variants: {
      secondary: {
        color: 'text-500',
      },
      success: {
        color: 'text-success',
      },
      error: {
        color: 'text-error',
      },
    },
  },
  Table: {
    variants: {
      simple: {
        th: {
          borderColor: 'gray-900',
          color: 'text-500',
          fontSize: 'xs',
          fontWeight: '400',
        },
        td: {
          border: 'none',
          color: 'text-50',
          fontSize: 'xs',
        },
        tr: {
          _last: {
            td: {
              borderBottom: 'none',
            },
          },
        },
      },
    },
    defaultProps: {
      variant: 'simple',
    },
  },
  Box: {
    variants: {
      card: {
        bg: 'dark-bg',
        borderRadius: '12px',
        border: '1px',
        borderColor: 'gray-900',
      },
    },
  },
  Button: {
    baseStyle: {
      borderRadius: '12px',
      fontWeight: '500',
    },
    variants: {
      outline: {
        border: '1px',
        borderColor: 'primary-500',
        bg: 'dark-bg',
        color: 'primary-500',
        _hover: {
          bg: 'dark-bg',
          opacity: 0.8,
        },
      },
      solid: {
        bg: 'primary-500',
        color: 'white',
        _hover: {
          bg: 'primary-700',
        },
      },
    },
  },
  Tag: {
    baseStyle: {
      container: {
        bg: 'transparent',
      },
    },
    variants: {
      subtle: {
        container: {
          bg: 'transparent',
          color: 'text-50',
        },
      },
      success: {
        container: {
          bg: 'transparent',
          color: 'text-success',
        },
      },
      error: {
        container: {
          bg: 'transparent',
          color: 'text-error',
        },
      },
    },
  },
  Link: {
    baseStyle: {
      _hover: {
        textDecoration: 'underline',
      },
      _focus: {
        boxShadow: 'none',
      },
    },
  },
  Input: {
    variants: {
      outline: {
        field: {
          bg: 'dark-bg',
          border: '1px',
          borderColor: 'gray-900',
          _hover: {
            borderColor: 'primary-500',
          },
          _focus: {
            borderColor: 'primary-500',
            boxShadow: 'none',
          },
        },
      },
    },
  },
  Tooltip: {
    baseStyle: {
      bg: 'gray.300',
      color: 'black',
      padding: 2,
      borderRadius: 'md',
    },
  },
}
