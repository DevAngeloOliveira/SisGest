import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface ButtonProps extends ChakraButtonProps {
  isAnimated?: boolean;
}

const MotionButton = motion(ChakraButton as any);

export function Button({ children, isAnimated = true, ...props }: ButtonProps) {
  if (!isAnimated) {
    return <ChakraButton {...props}>{children}</ChakraButton>;
  }

  return (
    <MotionButton
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      {...props}
    >
      {children}
    </MotionButton>
  );
} 