import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  VStack,
  Image,
  useToast,
  ChakraProvider,
  extendTheme,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
import { useAuth } from '../AuthContext';
import { updateProfile } from 'firebase/auth';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const theme = extendTheme({
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
});

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name || user.displayName || '');
          setAge(userData.age || '');
          setBio(userData.bio || '');
          setInterests(userData.interests || []);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(user, { displayName: name });
      await setDoc(doc(db, 'users', user.uid), {
        name,
        age,
        bio,
        interests,
      }, { merge: true });
      toast({
        title: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Profile update failed',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addInterest = () => {
    if (newInterest && !interests.includes(newInterest)) {
      setInterests([...interests, newInterest]);
      setNewInterest('');
    }
  };

  const removeInterest = (interest) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  return (
    <ChakraProvider theme={theme}>
      <Flex direction="column" align="center" justify="center" minHeight="100vh" bg="gray.900" p={4}>
        <MotionBox
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          bg="rgba(255,255,255,0.1)"
          p={8}
          borderRadius="lg"
          boxShadow="xl"
          backdropFilter="blur(10px)"
          border="1px solid rgba(255,255,255,0.2)"
          w={{ base: '90%', md: '500px' }}
          mx="auto"
        >
          <VStack spacing={6} align="flex-start" w="full">
            <Heading as="h2" size="xl" color="brand.100" textShadow="0 0 5px #ff6b6b">
              Your Profile
            </Heading>
            <MotionFlex
              w="full"
              justify="center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Image
                src={user?.photoURL || "https://via.placeholder.com/150"}
                alt="Profile"
                borderRadius="full"
                boxSize="150px"
                objectFit="cover"
                border="4px solid"
                borderColor="brand.200"
              />
            </MotionFlex>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={4} align="flex-start" w="full">
                <FormControl>
                  <FormLabel color="white">Name</FormLabel>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    bg="rgba(255,255,255,0.1)"
                    border="none"
                    color="white"
                    _focus={{ boxShadow: "0 0 0 1px #4ecdc4" }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="white">Age</FormLabel>
                  <Input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    bg="rgba(255,255,255,0.1)"
                    border="none"
                    color="white"
                    _focus={{ boxShadow: "0 0 0 1px #4ecdc4" }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="white">Bio</FormLabel>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    bg="rgba(255,255,255,0.1)"
                    border="none"
                    color="white"
                    _focus={{ boxShadow: "0 0 0 1px #4ecdc4" }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="white">Interests</FormLabel>
                  <HStack>
                    <Input
                      type="text"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="Add an interest"
                      bg="rgba(255,255,255,0.1)"
                      border="none"
                      color="white"
                      _focus={{ boxShadow: "0 0 0 1px #4ecdc4" }}
                    />
                    <Button onClick={addInterest} colorScheme="brand">Add</Button>
                  </HStack>
                  <Box mt={2}>
                    <AnimatePresence>
                      {interests.map((interest) => (
                        <motion.div
                          key={interest}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Tag
                            size="md"
                            borderRadius="full"
                            variant="solid"
                            colorScheme="brand"
                            m={1}
                          >
                            <TagLabel>{interest}</TagLabel>
                            <TagCloseButton onClick={() => removeInterest(interest)} />
                          </Tag>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </Box>
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="brand"
                  w="full"
                  isLoading={isLoading}
                  _hover={{ transform: 'translateY(-2px)', boxShadow: '0 0 15px #4ecdc4' }}
                  transition="all 0.2s"
                >
                  Update Profile
                </Button>
              </VStack>
            </form>
          </VStack>
        </MotionBox>
      </Flex>
    </ChakraProvider>
  );
};

export default Profile;