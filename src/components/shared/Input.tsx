import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
} from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/color-mode';

interface InputProps extends ChakraInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  const { colorMode } = useColorMode();
  const bg = colorMode === 'light' ? 'white' : 'gray.800';
  const borderColor = colorMode === 'light' ? 'gray.200' : 'gray.700';

  return (
    <FormControl isInvalid={!!error}>
      {label && (
        <FormLabel fontSize="sm" fontWeight="medium">
          {label}
        </FormLabel>
      )}
      <ChakraInput
        bg={bg}
        borderColor={borderColor}
        _hover={{
          borderColor: 'brand.500',
        }}
        _focus={{
          borderColor: 'brand.500',
          ring: 2,
          ringColor: 'brand.500',
        }}
        {...props}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
} 