import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import {
  ChakraProvider,
  extendTheme,
  Container,
  Box,
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Icon,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Grid,
  useBreakpointValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Input,
  Textarea,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { FaHeart, FaUser, FaUsers, FaComments, FaGamepad, FaCalendarAlt, FaBars, FaEnvelope, FaQuestionCircle, FaBookOpen, FaPencilAlt, FaShare } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import { Tilt } from 'react-tilt';
import DynamicBackground from './DynamicBackground';

// Custom theme
const theme = extendTheme({
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Roboto', sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: "#050816",
        color: "white",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
      },
      variants: {
        solid: {
          bg: 'pink.500',
          color: 'white',
          _hover: {
            bg: 'pink.600',
          },
        },
      },
    },
  },
});

// Animated text component
const AnimatedText = ({ children }) => {
  const props = useSpring({
    from: { opacity: 0, transform: 'translateY(70px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 300, friction: 10 },
  });

  return <animated.div style={props}>{children}</animated.div>;
};

// FeatureCard component
const FeatureCard = ({ icon, title, description, onClick }) => (
  <Tilt options={{ max: 25, scale: 1.05 }}>
    <motion.div
      whileHover={{ scale: 1.05, rotateY: 10 }}
      whileTap={{ scale: 0.95 }}
    >
      <Box
        bg="rgba(255,255,255,0.1)"
        backdropFilter="blur(10px)"
        borderRadius="xl"
        p={6}
        cursor="pointer"
        onClick={onClick}
        textAlign="center"
        boxShadow="0 0 15px rgba(255,105,180,0.3)"
        color="white"
        transition="all 0.3s"
        height="100%"
      >
        <VStack spacing={4}>
          <Icon as={icon} boxSize={10} color="pink.400" />
          <Heading size="md">{title}</Heading>
          <Text fontSize="sm">{description}</Text>
        </VStack>
      </Box>
    </motion.div>
  </Tilt>
);

// Sidebar component 
const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  const menuItems = [
    { icon: FaHeart, text: "Matches", path: "/matches" },
    { icon: FaUser, text: "Profile", path: "/profile" },
    { icon: FaUsers, text: "Friends", path: "/friends" },
    { icon: FaComments, text: "Messages", path: "/messages" },
    { icon: FaCalendarAlt, text: "Events", path: "/events" },
    { icon: FaGamepad, text: "Games", path: "/games" },
    { icon: FaBookOpen, text: "Study Groups", path: "/study-groups" },
    { icon: FaPencilAlt, text: "Study", path: "/Study" },
    {icon: FaShare, text: "Share", path: "/share" },
  ];

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent bg="rgba(255,255,255,0.1)" backdropFilter="blur(10px)">
        <DrawerCloseButton color="white" />
        <DrawerHeader borderBottomWidth="1px" color="white">UniVibe Menu</DrawerHeader>
        <DrawerBody>
          <VStack spacing={4} align="stretch">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                leftIcon={<Icon as={item.icon} />}
                variant="ghost"
                justifyContent="flex-start"
                color="white"
                _hover={{ bg: "rgba(255,255,255,0.2)" }}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
              >
                {item.text}
              </Button>
            ))}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

//type writer function
const TypewriterText = () => {
  const phrases = ['Connect', 'Date', 'Study', 'Succeed', 'Thrive','Experience','Explore','College','Events','Education','Upgrade','Exam'];
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const typeText = useCallback(() => {
    const currentPhrase = phrases[currentIndex];
    
    if (isDeleting) {
      setCurrentText(currentPhrase.substring(0, currentText.length - 1));
      if (currentText.length === 1) {
        setIsDeleting(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
      }
    } else {
      setCurrentText(currentPhrase.substring(0, currentText.length + 1));
      if (currentText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 1500);
      }
    }
  }, [currentIndex, isDeleting, currentText]);

  useEffect(() => {
    const timer = setTimeout(() => {
      typeText();
    }, isDeleting ? 300 : 350);

    return () => clearTimeout(timer);
  }, [typeText, isDeleting]);

  return (
    <Text fontSize="2xl" fontWeight="bold" color="pink.400" height="40px">
      {currentText}
      <span className="animate-blink">|</span>
    </Text>
  );
};




// FAQ component (new)
const FAQ = () => {
  const faqs = [
    {
      question: "What is UniVibe?",
      answer: "UniVibe is a platform designed for college students to connect, date, study together, and build meaningful relationships within their campus community."
    },
    {
      question: "How do I sign up?",
      answer: "Simply click the 'Start Your Journey' button on our homepage and follow the easy registration process. You'll need a valid college email address to get started."
    },
    {
      question: "Is UniVibe free?",
      answer: "Yes, UniVibe's basic features are completely free for all college students. We also offer premium features for a small subscription fee."
    },
    {
      question: "How does matching work?",
      answer: "Our advanced algorithm considers your interests, study habits, and personal preferences to suggest compatible matches. You can also use filters to find specific types of connections."
    },
  ];

  return (
    <Accordion allowToggle>
      {faqs.map((faq, index) => (
        <AccordionItem key={index}>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                {faq.question}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            {faq.answer}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

// ContactForm component (new)
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input name="name" value={formData.name} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input name="email" type="email" value={formData.email} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Message</FormLabel>
          <Textarea name="message" value={formData.message} onChange={handleChange} />
        </FormControl>
        <Button type="submit" colorScheme="pink">Send Message</Button>
      </VStack>
    </form>
  );
};



// Main Home component
const Home = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const features = [
    { icon: FaHeart, title: "Start Matching", description: "Find your perfect match", onClick: () => navigate('/matching') },
    { icon: FaUsers, title: "Study Buddy", description: "Find partners for group study", onClick: () => navigate('/study-groups') },
    { icon: FaComments, title: "Ice Breakers", description: "Fun conversation starters", onClick: () => navigate('/ice-breakers') },
    { icon: FaGamepad, title: "Fun Games", description: "Play games with matches", onClick: () => navigate('/games') },
    { icon: FaPencilAlt, title: "Study", description: "Explore Study Resources, learn something new", onClick: () => navigate('/study') },
    { icon: FaShare, title: "Share", description: "Share Study Resources", onClick: () => navigate('/share') }
  ];

  return (
    <ChakraProvider theme={theme}>
      <Box minHeight="100vh" position="relative" overflow="hidden">
        {/* New Dynamic Background */}
        <DynamicBackground />

        {/* Header */}
        <Flex
          as="header"
          align="center"
          justify="space-between"
          wrap="wrap"
          padding="1.5rem"
          bg="rgba(0,0,0,0.5)"
          position="sticky"
          top={0}
          zIndex={10}
          backdropFilter="blur(10px)"
        >
          <Flex align="center" mr={5}>
            <Heading as="h1" size="lg" letterSpacing={'tighter'}>
              UniVibe
            </Heading>
          </Flex>

          <HStack spacing={4}>
            {isLoggedIn ? (
              <Menu>
                <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} minW={0}>
                  <Avatar size={'sm'} src={'https://bit.ly/broken-link'} />
                </MenuButton>
                <MenuList bg="rgba(0,0,0,0.8)">
                  <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
                  <MenuItem onClick={() => setIsLoggedIn(false)}>Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button colorScheme="pink" onClick={() => setIsLoggedIn(true)}>
                Login
              </Button>
            )}
            <Button colorScheme="teal" onClick={onOpen}>
              <Icon as={FaBars} />
            </Button>
          </HStack>
        </Flex>

        {/* Sidebar */}
        <Sidebar isOpen={isOpen} onClose={onClose} />

        {/* Main Content */}
        <Container maxW="container.xl" pt={20} position="relative" zIndex={1}>
          <VStack spacing={20} align="stretch">
            {/* Hero Section with Typewriter */}
            <AnimatedText>
              <Box textAlign="center">
                <Heading
                  as="h1"
                  size="3xl"
                  bgGradient="linear(to-r, #ff7f50, #ff69b4)"
                  bgClip="text"
                  mb={4}
                >
                  UniVibe
                </Heading>
                <TypewriterText />
                <Text fontSize="xl" mb={8} mt={4}>
                  Your Ultimate College companion for connecting, dating, and studying
                </Text>
                <Button
                  as={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  size="lg"
                  colorScheme="pink"
                  onClick={() => navigate('/signup')}
                >
                  Start Your Journey
                </Button>
              </Box>
            </AnimatedText>

            {/* Features Section */}
            <Box>
              <Heading size="xl" mb={6} textAlign="center">Discover UniVibe Magic</Heading>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
                {features.map((feature, index) => (
                  <FeatureCard key={index} {...feature} />
                ))}
              </Grid>
            </Box>

            {/* Call-to-Action Section */}
            <Box textAlign="center" py={10}>
              <Heading size="xl" mb={4}>Ready to Find Your Perfect Match?</Heading>
              <Button
                as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                size="lg"
                colorScheme="teal"
                onClick={() => navigate('/signup')}
                leftIcon={<Icon as={FaHeart} />}
              >
                Join UniVibe Now
              </Button>
            </Box>

            {/* FAQ Section */}
            <Box>
              <Heading size="xl" mb={6} textAlign="center">Frequently Asked Questions</Heading>
              <FAQ />
            </Box>

            {/* Contact Us Section */}
            <Box>
              <Heading size="xl" mb={6} textAlign="center">Get in Touch</Heading>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={8}>
                <VStack align="stretch" spacing={4}>
                  <Text fontSize="lg">Have questions or suggestions? We'd love to hear from you!</Text>
                  <HStack>
                    <Icon as={FaEnvelope} />
                    <Text>support@univibe.com</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaQuestionCircle} />
                    <Text>FAQ: Check out our frequently asked questions above</Text>
                  </HStack>
                </VStack>
                <Box>
                  <ContactForm />
                </Box>
              </Grid>
            </Box>
          </VStack>
        </Container>

        {/* Footer */}
        <Box
          as="footer"
          mt={20}
          py={10}
          bg="rgba(0,0,0,0.2)"
          textAlign="center"
          position="relative"
          zIndex={1}
          backdropFilter="blur(10px)"
        >
          <Text>&copy; 2024 UniVibe. All rights reserved.</Text>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default Home;