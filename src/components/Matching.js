import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  Image,
  IconButton,
  useToast,
  Container,
  Tag,
  HStack,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  CircularProgress,
  CircularProgressLabel,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Switch,
  Tooltip,
  Progress,
} from '@chakra-ui/react';
import {
  ChevronLeftIcon,
  InfoIcon,
  CheckIcon,
  ChevronRightIcon,
  CloseIcon,
  StarIcon,
} from '@chakra-ui/icons';
import {
  FaHeart,
  FaFilter,
  FaUndo,
  FaBolt,
  FaComment,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Mock data for demonstration (expanded)
const mockProfiles = [
  {
    id: 1,
    name: 'Ayush Upadhyay',
    age: 21,
    bio: 'Computer Science major who loves hiking and coding. Always up for a coffee and a good conversation about tech!',
    images: ['/Ayush.jpg', 'https://via.placeholder.com/400x600', 'https://via.placeholder.com/400x600'],
    interests: ['Hiking', 'Coding', 'Photography', 'Coffee'],
    major: 'Computer Science',
    matchPercentage: 94,
    height: '180 cm',
    zodiac: 'Leo',
    lookingFor: 'Serious relationship',
    university: 'MIT',
    verified: true,
    distance: '5 miles away',
    prompt: 'My perfect first date',
    promptAnswer: 'A hike followed by coffee and coding together',
  },
  {
    id: 2,
    name: 'Prisha Satyawali',
    age: 18,
    bio: 'Art student with a passion for photography and traveling.',
    image: '/girl1.jpg',
    interests: ['Art', 'Photography', 'Traveling'],
    major: 'Fine Arts',
    matchPercentage: 87,
    university: 'NYU',
    verified: false,
    distance: '10 miles away',
    prompt: 'One thing I want to try',
    promptAnswer: 'Backpacking through Europe',
  },
  {
    id: 3,
    name: 'Ananya Singh',
    age: 19,
    bio: 'Biology major, animal lover, and amateur chef.',
    image: '/girl2.jpg',
    interests: ['Animals', 'Cooking', 'Nature'],
    major: 'Biology',
    matchPercentage: 92,
    university: 'Stanford',
    verified: true,
    distance: '15 miles away',
    prompt: 'My hidden talent',
    promptAnswer: 'I can name any dog breed on sight',
  },
];

const Matching = () => {
  const [currentProfile, setCurrentProfile] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const [direction, setDirection] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cardRef = useRef(null);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSwipe = (dir) => {
    setDirection(dir);
    setTimeout(() => {
      setDirection(null);
      setCurrentProfile((prev) => (prev + 1) % mockProfiles.length);
      setCurrentImage(0);
    }, 300);

    // Haptic feedback (if supported)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    toast({
      title: dir === 'right' ? 'It\'s a match!' : 'Maybe next time',
      description: `You ${dir === 'right' ? 'liked' : 'passed on'} ${mockProfiles[currentProfile].name}`,
      status: dir === 'right' ? 'success' : 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      handleSwipe('right');
    } else if (info.offset.x < -swipeThreshold) {
      handleSwipe('left');
    }
  };

  const profile = mockProfiles[currentProfile];

  if (!profile) {
    return <Text>No profiles available</Text>;
  }

  const images = Array.isArray(profile.images) ? profile.images : [profile.image];

  const cardVariants = {
    center: { x: 0, rotate: 0, opacity: 1 },
    left: { x: '-100%', rotate: -10, opacity: 0 },
    right: { x: '100%', rotate: 10, opacity: 0 },
  };

  const handleImageChange = (direction) => {
    setCurrentImage((prev) => {
      if (direction === 'next') {
        return (prev + 1) % images.length;
      } else {
        return prev === 0 ? images.length - 1 : prev - 1;
      }
    });
  };

  const handleSuperLike = () => {
    toast({
      title: "Super Like!",
      description: `You've super liked ${profile.name}!`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    // Add special animation here
  };

  const handleRewind = () => {
    setCurrentProfile((prev) => (prev === 0 ? mockProfiles.length - 1 : prev - 1));
    toast({
      title: "Rewound!",
      description: "You've gone back to the previous profile.",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="xl" centerContent py={8} position="relative" bg={isDarkMode ? "gray.800" : "white"}>
      <Flex justifyContent="space-between" w="full" mb={4}>
        <IconButton
          icon={<FaFilter />}
          onClick={() => {/* Add filter functionality */}}
          colorScheme="brand"
          variant="ghost"
        />
        <Heading as="h2" size="lg" color={isDarkMode ? "white" : "brand.500"}>
          Find Your Match
        </Heading>
        <Switch
          isChecked={isDarkMode}
          onChange={() => setIsDarkMode(!isDarkMode)}
          colorScheme="brand"
        />
      </Flex>
      
      <Box position="relative" w="full" h="70vh" maxH="600px">
        <AnimatePresence>
          <motion.div
            key={profile.id}
            ref={cardRef}
            initial="center"
            animate={direction ? direction : "center"}
            exit={direction ? direction : "center"}
            variants={cardVariants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
            <Box
              bg={isDarkMode ? "gray.700" : "white"}
              borderRadius="2xl"
              boxShadow="2xl"
              overflow="hidden"
              h="full"
              position="relative"
            >
              <Image src={images[currentImage]} alt={profile.name} w="full" h="full" objectFit="cover" />
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                p={4}
                background="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)"
                color="white"
              >
                <HStack justify="space-between" align="center">
                  <VStack align="flex-start" spacing={0}>
                    <HStack>
                      <Heading as="h3" size="lg">
                        {profile.name}, {profile.age}
                      </Heading>
                      {profile.verified && (
                        <Tooltip label="Verified Profile">
                          <CheckIcon color="green.500" />
                        </Tooltip>
                      )}
                    </HStack>
                    <Text fontSize="sm">{profile.major} @ {profile.university}</Text>
                    <Text fontSize="xs">{profile.distance}</Text>
                  </VStack>
                  <Box position="relative" width="60px" height="60px">
                    <CircularProgress value={profile.matchPercentage} color="green.400" size="60px" thickness="8px">
                      <CircularProgressLabel fontWeight="bold">{profile.matchPercentage}%</CircularProgressLabel>
                    </CircularProgress>
                  </Box>
                </HStack>
              </Box>
              <VStack
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                bg="rgba(0,0,0,0.7)"
                color="white"
                p={4}
                align="stretch"
                spacing={2}
              >
                <HStack spacing={2} flexWrap="wrap">
                  {profile.interests.map((interest, index) => (
                    <Tag key={index} size="sm" colorScheme="brand" variant="solid">
                      {interest}
                    </Tag>
                  ))}
                </HStack>
                <Text fontSize="sm" fontWeight="bold">{profile.prompt}</Text>
                <Text fontSize="sm" fontStyle="italic">"{profile.promptAnswer}"</Text>
                <IconButton
                  icon={<InfoIcon />}
                  onClick={onOpen}
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  alignSelf="flex-end"
                />
              </VStack>
              <HStack position="absolute" top="50%" width="100%" justifyContent="space-between" px={2}>
                <IconButton
                  icon={<ChevronLeftIcon />}
                  onClick={() => handleImageChange('prev')}
                  variant="ghost"
                  colorScheme="whiteAlpha"
                />
                <IconButton
                  icon={<ChevronRightIcon />}
                  onClick={() => handleImageChange('next')}
                  variant="ghost"
                  colorScheme="whiteAlpha"
                />
              </HStack>
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>
      
      <HStack spacing={4} mt={8}>
        <Tooltip label="Pass">
          <IconButton
            icon={<CloseIcon />}
            onClick={() => handleSwipe('left')}
            colorScheme="red"
            size="lg"
            borderRadius="full"
            boxShadow="lg"
          />
        </Tooltip>
        <Tooltip label="Super Like">
          <IconButton
            icon={<StarIcon />}
            onClick={handleSuperLike}
            colorScheme="blue"
            size="lg"
            borderRadius="full"
            boxShadow="lg"
          />
        </Tooltip>
        <Tooltip label="Like">
          <IconButton
            icon={<FaHeart />}
            onClick={() => handleSwipe('right')}
            colorScheme="green"
            size="lg"
            borderRadius="full"
            boxShadow="lg"
          />
        </Tooltip>
      </HStack>
      
      <HStack spacing={4} mt={4}>
        <Tooltip label="Rewind">
          <IconButton
            icon={<FaUndo />}
            onClick={handleRewind}
            colorScheme="yellow"
            size="md"
            borderRadius="full"
          />
        </Tooltip>
        <Tooltip label="Boost Profile">
          <IconButton
            icon={<FaBolt />}
            onClick={() => {/* Add boost functionality */}}
            colorScheme="purple"
            size="md"
            borderRadius="full"
          />
        </Tooltip>
      </HStack>

      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} size="full">
        <DrawerOverlay />
        <DrawerContent borderTopRadius="2xl" bg={isDarkMode ? "gray.800" : "white"}>
          <DrawerCloseButton />
          <DrawerHeader color={isDarkMode ? "white" : "gray.800"}>{profile.name}'s Profile</DrawerHeader>
          <DrawerBody>
            <Tabs>
              <TabList>
                <Tab>About</Tab>
                <Tab>Photos</Tab>
                <Tab>Compatibility</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <VStack align="start" spacing={4}>
                    <Text color={isDarkMode ? "white" : "gray.800"}>{profile.bio}</Text>
                    <HStack>
                      <Text fontWeight="bold" color={isDarkMode ? "white" : "gray.800"}>Major:</Text>
                      <Text color={isDarkMode ? "white" : "gray.800"}>{profile.major}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="bold" color={isDarkMode ? "white" : "gray.800"}>University:</Text>
                      <Text color={isDarkMode ? "white" : "gray.800"}>{profile.university}</Text>
                    </HStack>
                    <Heading as="h4" size="md" mb={2} color={isDarkMode ? "white" : "gray.800"}>
                      Interests
                    </Heading>
                    <HStack spacing={2} flexWrap="wrap">
                      {profile.interests.map((interest, index) => (
                        <Tag key={index} size="md" colorScheme="brand" mb={2}>
                          {interest}
                        </Tag>
                      ))}
                    </HStack>
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <VStack spacing={4}>
                    {images.map((image, index) => (
                      <Image key={index} src={image} alt={`${profile.name} - Photo ${index + 1}`} borderRadius="md" />
                    ))}
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <VStack align="start" spacing={4}>
                    <Heading as="h4" size="md" mb={2} color={isDarkMode ? "white" : "gray.800"}>
                      Compatibility Score: {profile.matchPercentage}%
                    </Heading>
                    <Progress value={profile.matchPercentage} colorScheme="green" w="full" />
                    <Text color={isDarkMode ? "white" : "gray.800"}>
                      You and {profile.name} share many common interests and values!
                    </Text>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Tabs isFitted variant="enclosed" mt={8} w="full">
        <TabList mb="1em">
          <Tab><FaHeart /></Tab>
          <Tab><FaComment /></Tab>
          <Tab><FaFilter /></Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Text color={isDarkMode ? "white" : "gray.800"}>People who liked you</Text>
            {/* Add content for liked profiles */}
          </TabPanel>
          <TabPanel>
            <Text color={isDarkMode ? "white" : "gray.800"}>Your chats</Text>
            {/* Add content for chats */}
          </TabPanel>
          <TabPanel>
            <Text color={isDarkMode ? "white" : "gray.800"}>Filters</Text>
            {/* Add filter options */}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default Matching;