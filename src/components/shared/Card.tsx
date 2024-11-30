import { ReactNode } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/color-mode';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

const MotionBox = motion(Box as any);

export function Card({ title, children, className = '' }: CardProps) {
  const { colorMode } = useColorMode();
  const bg = colorMode === 'light' ? 'white' : 'gray.800';
  const borderColor = colorMode === 'light' ? 'gray.200' : 'gray.700';

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      bg={bg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      shadow="sm"
      _hover={{ shadow: 'md' }}
      className={className}
    >
      {title && (
        <Box borderBottomWidth="1px" borderColor={borderColor} px={6} py={4}>
          <Heading size="md" fontWeight="semibold">
            {title}
          </Heading>
        </Box>
      )}
      <Box p={6}>{children}</Box>
    </MotionBox>
  );
} 