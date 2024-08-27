import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChakraProvider, extendTheme, Box, Button, Flex, FormControl, FormLabel, Heading, Input, Text, VStack, useToast, keyframes } from '@chakra-ui/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { FaUserGraduate, FaLock, FaUniversity } from 'react-icons/fa';

const floatKeyframes = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const glowKeyframes = keyframes`
  0% { box-shadow: 0 0 5px #4ecdc4; }
  50% { box-shadow: 0 0 20px #4ecdc4; }
  100% { box-shadow: 0 0 5px #4ecdc4; }
`;

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.900",
        color: "white",
      },
    },
  },
  colors: {
    brand: {
      100: "#ff6b6b",
      200: "#4ecdc4",
      300: "#45b7d1",
    },
  },
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Roboto', sans-serif",
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
      },
      variants: {
        solid: {
          bg: "brand.100",
          color: "white",
          _hover: {
            bg: "brand.200",
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(78, 205, 196, 0.5)",
          },
          _active: {
            bg: "brand.300",
          },
        },
      },
    },
    Input: {
      variants: {
        filled: {
          field: {
            bg: "rgba(255,255,255,0.08)",
            borderColor: "transparent",
            _hover: {
              bg: "rgba(255,255,255,0.12)",
            },
            _focus: {
              borderColor: "brand.200",
              bg: "rgba(255,255,255,0.16)",
            },
          },
        },
      },
    },
  },
});

const MotionBox = motion(Box);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Welcome back to UniVibe!",
        description: "Get ready to connect and vibe with your peers!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate('/home');
    } catch (error) {
      toast({
        title: "Oops! Login hiccup",
        description: "Please check your email and password, then try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Flex align="center" justify="center" minHeight="100vh" 
        bgImage="url('https://source.unsplash.com/random?university')"
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover">
        <MotionBox
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          bg="rgba(0,0,0,0.7)"
          p={8}
          borderRadius="2xl"
          boxShadow="0 8px 32px rgba(31, 38, 135, 0.37)"
          backdropFilter="blur(8px)"
          border="1px solid rgba(255,255,255,0.18)"
          w={{ base: '90%', md: '400px' }}
        >
          <VStack spacing={6} align="stretch">
            <MotionBox
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Heading 
                as="h1" 
                size="2xl" 
                textAlign="center" 
                bgGradient="linear(to-r, brand.100, brand.200, brand.300)"
                bgClip="text"
                fontWeight="extrabold"
                letterSpacing="tight"
              >
                UniVibe
              </Heading>
            </MotionBox>
            <Text fontSize="lg" textAlign="center" color="gray.300">
              Connect. Study. Vibe.
            </Text>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel color="gray.300">Email</FormLabel>
                  <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      variant="filled"
                      placeholder="your.email@university.edu"
                      leftElement={<Box ml={2}><FaUserGraduate color="#4ecdc4" /></Box>}
                    />
                  </MotionBox>
                </FormControl>
                <FormControl>
                  <FormLabel color="gray.300">Password</FormLabel>
                  <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      variant="filled"
                      placeholder="Your secret passcode"
                      leftElement={<Box ml={2}><FaLock color="#4ecdc4" /></Box>}
                    />
                  </MotionBox>
                </FormControl>
                <MotionBox
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(78, 205, 196, 0)",
                      "0 0 0 10px rgba(78, 205, 196, 0.1)",
                      "0 0 0 20px rgba(78, 205, 196, 0)",
                    ],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                  }}
                >
                  <Button
                    type="submit"
                    w="full"
                    size="lg"
                    isLoading={isLoading}
                    loadingText="Vibing..."
                  >
                    <AnimatePresence>
                      {!isLoading && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Let's Vibe!
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </MotionBox>
              </VStack>
            </form>
            <MotionBox
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Text textAlign="center" color="gray.300">
                New to the vibe?{' '}
                <Text 
                  as={RouterLink} 
                  to="/signup" 
                  color="brand.200" 
                  fontWeight="bold"
                  _hover={{ 
                    color: "brand.100", 
                    textDecoration: 'underline',
                    textShadow: '0 0 8px rgba(78, 205, 196, 0.8)'
                  }}
                >
                  Join the party!
                </Text>
              </Text>
            </MotionBox>
          </VStack>
        </MotionBox>
      </Flex>
    </ChakraProvider>
  );
};

export default Login;