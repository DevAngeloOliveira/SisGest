import { extendTheme } from '@chakra-ui/theme-tools'
import type { ThemeConfig } from '@chakra-ui/theme'

const config: ThemeConfig = {
    initialColorMode: 'light',
    useSystemColorMode: true,
}

const colors = {
    brand: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
    },
    gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
    }
}

const components = {
    Button: {
        baseStyle: {
            fontWeight: 'medium',
            borderRadius: 'lg',
        },
        variants: {
            solid: (props: { colorScheme: string }) => ({
                bg: `${props.colorScheme}.500`,
                color: 'white',
                _hover: {
                    bg: `${props.colorScheme}.600`,
                },
            }),
            outline: (props: { colorScheme: string }) => ({
                borderColor: `${props.colorScheme}.500`,
                color: `${props.colorScheme}.500`,
                _hover: {
                    bg: `${props.colorScheme}.50`,
                },
            }),
        },
        defaultProps: {
            colorScheme: 'brand',
        },
    },
    Card: {
        baseStyle: {
            container: {
                bg: 'white',
                _dark: {
                    bg: 'gray.800',
                },
                borderRadius: 'xl',
                boxShadow: 'sm',
                p: 6,
            },
        },
    },
    Input: {
        variants: {
            filled: {
                field: {
                    bg: 'gray.50',
                    _dark: {
                        bg: 'gray.700',
                    },
                    _hover: {
                        bg: 'gray.100',
                        _dark: {
                            bg: 'gray.600',
                        },
                    },
                    _focus: {
                        bg: 'white',
                        _dark: {
                            bg: 'gray.800',
                        },
                    },
                },
            },
        },
        defaultProps: {
            variant: 'filled',
        },
    },
}

const fonts = {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
}

const styles = {
    global: {
        body: {
            bg: 'gray.50',
            color: 'gray.900',
            _dark: {
                bg: 'gray.900',
                color: 'white',
            },
        },
    },
}

export const theme = extendTheme({
    config,
    colors,
    components,
    fonts,
    styles,
}) 