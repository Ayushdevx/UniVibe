import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import Confetti from 'react-confetti';
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
  Button,
  useColorMode,
  useColorModeValue,
  Input,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Checkbox,
  Wrap,
  WrapItem,
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
  FaHome,
  FaCamera,
  FaMusic,
  FaGamepad,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import { Pagination } from 'swiper/modules';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-cards';

// Updated mockProfiles array
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
    height: '183 cm',
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
    images: ['/girl1.jpg', 'https://via.placeholder.com/400x600', 'https://via.placeholder.com/400x600'],
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
    images: ['/girl2.jpg', 'https://via.placeholder.com/400x600', 'https://via.placeholder.com/400x600'],
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
  const [profiles, setProfiles] = useState(mockProfiles);
  const [direction, setDirection] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showConfetti, setShowConfetti] = useState(false);
  const cardRef = useRef(null);
  const toast = useToast();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const [{ scale }, set] = useSpring(() => ({ scale: 1 }));

  const handleSwipe = (dir) => {
    setDirection(dir);
    setTimeout(() => {
      setDirection(null);
      setCurrentProfile((prev) => (prev + 1) % mockProfiles.length);
    }, 300);

    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    if (dir === 'right') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
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

  const cardVariants = {
    center: { x: 0, rotate: 0, opacity: 1 },
    left: { x: '-100%', rotate: -10, opacity: 0 },
    right: { x: '100%', rotate: 10, opacity: 0 },
  };

  const handleSuperLike = () => {
    set({ scale: 1.5 });
    setTimeout(() => set({ scale: 1 }), 300);
    toast({
      title: "Super Like!",
      description: `You've super liked ${profile.name}!`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleRewind = () => {
    setCurrentProfile((prev) => (prev === 0 ? mockProfiles.length - 1 : prev - 1));
    toast({
      title: "Rewind!",
      description: "You've gone back to the previous profile.",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="xl" centerContent py={4} px={2} position="relative" bg={bgColor} minH="100vh">
      {showConfetti && <Confetti />}
      <Flex justifyContent="space-between" w="full" mb={4}>
        <IconButton
          icon={<FaFilter />}
          onClick={() => {/* Add filter functionality */}}
          colorScheme="brand"
          variant="ghost"
        />
        <Heading as="h2" size="lg" color={textColor}>
          UniVibe :)
        </Heading>
        <HStack>
          <IconButton
            icon={<FaHome />}
            onClick={() => navigate('/')}
            colorScheme="brand"
            variant="ghost"
          />
          <Switch
            isChecked={colorMode === 'dark'}
            onChange={toggleColorMode}
            colorScheme="brand"
          />
        </HStack>
      </Flex>
      
      <Box position="relative" w="full" h={{ base: "50vh", md: "70vh" }} maxH="600px">
        <AnimatePresence>
          <motion.div
            key={profile.id}
            ref={cardRef}
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
          >
            <animated.div style={{ scale }}>
              <Box
                bg={bgColor}
                borderRadius="2xl"
                boxShadow="2xl"
                overflow="hidden"
                h="full"
                position="relative"
              >
                <Swiper
                  effect="cards"
                  grabCursor={true}
                  modules={[EffectCards, Pagination, Navigation]}
                  className="mySwiper"
                  pagination={{ clickable: true }}
                  navigation
                >
                  {profile.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <Image src={image} alt={`${profile.name} - ${index + 1}`} w="full" h="full" objectFit="cover" />
                    </SwiperSlide>
                  ))}
                </Swiper>
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
              </Box>
            </animated.div>
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
        <Tooltip label="Take Photo">
          <IconButton
            icon={<FaCamera />}
            onClick={() => {/* Add photo functionality */}}
            colorScheme="teal"
            size="md"
            borderRadius="full"
          />
        </Tooltip>
      </HStack>

      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} size="full">
        <DrawerOverlay />
        <DrawerContent borderTopRadius="2xl" bg={bgColor}>
          <DrawerCloseButton />
          <DrawerHeader color={textColor}>{profile.name}'s Profile</DrawerHeader>
          <DrawerBody>
            <Tabs>
              <TabList>
                <Tab>About</Tab>
                <Tab>Photos</Tab>
                <Tab>Compatibility</Tab>
                <Tab>Interests</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <VStack align="start" spacing={4}>
                    <Text color={textColor}>{profile.bio}</Text>
                    <HStack>
                      <Text fontWeight="bold" color={textColor}>Major:</Text>
                      <Text color={textColor}>{profile.major}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="bold" color={textColor}>University:</Text>
                      <Text color={textColor}>{profile.university}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="bold" color={textColor}>Height:</Text>
                      <Text color={textColor}>{profile.height}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="bold" color={textColor}>Zodiac:</Text>
                      <Text color={textColor}>{profile.zodiac}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="bold" color={textColor}>Looking for:</Text>
                      <Text color={textColor}>{profile.lookingFor}</Text>
                    </HStack>
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <Swiper
                    pagination={{
                      type: "fraction",
                    }}
                    navigation={true}
                    modules={[Pagination, Navigation]}
                    className="mySwiper"
                  >
                    {profile.images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <Image src={image} alt={`${profile.name} - Photo ${index + 1}`} borderRadius="md" />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </TabPanel>
                <TabPanel>
                  <VStack align="start" spacing={4}>
                    <Heading as="h4" size="md" mb={2} color={textColor}>
                      Compatibility Score: {profile.matchPercentage}%
                    </Heading>
                    <Progress value={profile.matchPercentage} colorScheme="green" w="full" />
                    <Text color={textColor}>
                      You and {profile.name} share many common interests and values!
                    </Text>
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <VStack align="start" spacing={4}>
                    <Heading as="h4" size="md" mb={2} color={textColor}>
                      Shared Interests
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
          <Tab><FaMusic /></Tab>
          <Tab><FaGamepad /></Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack align="start" spacing={4}>
              <Heading as="h4" size="md" color={textColor}>People who liked you</Heading>
              <HStack spacing={4} overflowX="auto" pb={4}>
                {mockProfiles.slice(0, 5).map((profile, index) => (
                  <VStack key={index}>
                    <Image
                      src={profile.images[0]}
                      alt={profile.name}
                      boxSize="100px"
                      objectFit="cover"
                      borderRadius="full"
                      cursor="pointer"
                      onClick={() => {
                        setCurrentProfile(index);
                        onOpen();
                      }}
                    />
                    <Text fontSize="sm" color={textColor}>{profile.name}</Text>
                  </VStack>
                ))}
              </HStack>
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack align="start" spacing={4}>
              <Heading as="h4" size="md" color={textColor}>Your chats</Heading>
              {mockProfiles.slice(0, 3).map((profile, index) => (
                <HStack key={index} w="full" p={2} borderWidth={1} borderRadius="md">
                  <Image
                    src={profile.images[0]}
                    alt={profile.name}
                    boxSize="50px"
                    objectFit="cover"
                    borderRadius="full"
                  />
                  <VStack align="start" flex={1}>
                    <Text fontWeight="bold" color={textColor}>{profile.name}</Text>
                    <Text fontSize="sm" color={textColor}>Last message: Hi there!</Text>
                  </VStack>
                  <Text fontSize="xs" color="gray.500">2h ago</Text>
                </HStack>
              ))}
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack align="start" spacing={4}>
              <Heading as="h4" size="md" color={textColor}>Filters</Heading>
              <Box w="full">
                <Text mb={2} color={textColor}>Age Range</Text>
                <Flex>
                  <Input placeholder="Min" mr={2} />
                  <Input placeholder="Max" />
                </Flex>
              </Box>
              <Box w="full">
                <Text mb={2} color={textColor}>Distance</Text>
                <Slider defaultValue={30} min={0} max={100} step={1}>
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Box>
              <Box w="full">
                <Text mb={2} color={textColor}>Interests</Text>
                <Wrap>
                  {['Sports', 'Music', 'Art', 'Travel', 'Food', 'Tech'].map((interest, index) => (
                    <WrapItem key={index}>
                      <Checkbox colorScheme="brand">{interest}</Checkbox>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
              <Button colorScheme="brand" w="full">Apply Filters</Button>
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack align="start" spacing={4}>
              <Heading as="h4" size="md" color={textColor}>Music Preferences</Heading>
              <Text color={textColor}>Connect your Spotify account to share your music taste!</Text>
              <Button leftIcon={<FaMusic />} colorScheme="green">
                Connect Spotify
              </Button>
              <Text color={textColor}>Top Artists:</Text>
              <HStack spacing={4} overflowX="auto" pb={4}>
                {['Artist 1', 'Artist 2', 'Artist 3', 'Artist 4', 'Artist 5'].map((artist, index) => (
                  <VStack key={index}>
                    <Box
                      w="80px"
                      h="80px"
                      bg="gray.300"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize="xs" textAlign="center">{artist}</Text>
                    </Box>
                  </VStack>
                ))}
              </HStack>
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack align="start" spacing={4}>
              <Heading as="h4" size="md" color={textColor}>Gaming Profile</Heading>
              <Text color={textColor}>Connect your gaming accounts to find matches with similar interests!</Text>
              <Button leftIcon={<FaGamepad />} colorScheme="purple">
                Connect Steam
              </Button>
              <Text color={textColor}>Favorite Games:</Text>
              <Wrap>
                {['Game 1', 'Game 2', 'Game 3', 'Game 4', 'Game 5'].map((game, index) => (
                  <WrapItem key={index}>
                    <Tag size="md" variant="solid" colorScheme="purple">
                      {game}
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Box position="fixed" bottom={4} right={4}>
        <Tooltip label="Quick Match">
          <IconButton
            icon={<FaBolt />}
            onClick={() => {
              toast({
                title: "Quick Match",
                description: "Finding your perfect match...",
                status: "info",
                duration: 2000,
                isClosable: true,
              });
              // Add quick match functionality
            }}
            colorScheme="brand"
            size="lg"
            borderRadius="full"
            boxShadow="lg"
          />
        </Tooltip>
      </Box>
    </Container>
  );
};


export default Matching;