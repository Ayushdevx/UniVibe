import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  Radio,
  RadioGroup,
  Progress,
  useToast,
} from '@chakra-ui/react';

const questions = [
  { id: 1, text: "How do you prefer to spend your free time?", options: ["Outdoors activities", "Reading or studying", "Socializing with friends", "Playing video games"] },
  { id: 2, text: "What's your ideal first date?", options: ["Coffee shop", "Movie theater", "Outdoor adventure", "Cooking together"] },
  { id: 3, text: "How important is academic success to you?", options: ["Very important", "Somewhat important", "Not very important", "Not important at all"] },
  // Add more questions as needed
];

const CompatibilityQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const toast = useToast();

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestion]: value });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed
      toast({
        title: "Quiz Completed!",
        description: "Your matches will now be more tailored to your preferences.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Here you would typically send the answers to your backend
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Flex direction="column" align="center" justify="center" minHeight="100vh" bg="gray.50" p={4}>
      <Box
        bg="white"
        borderRadius="lg"
        boxShadow="xl"
        p={8}
        w={{ base: '90%', md: '500px' }}
      >
        <VStack spacing={6} align="stretch">
          <Heading as="h2" size="xl" color="brand.100" textAlign="center">
            Compatibility Quiz
          </Heading>
          <Progress value={progress} colorScheme="brand" size="sm" borderRadius="full" />
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              {questions[currentQuestion].text}
            </Text>
            <RadioGroup onChange={handleAnswer} value={answers[currentQuestion]}>
              <VStack align="stretch" spacing={4}>
                {questions[currentQuestion].options.map((option, index) => (
                  <Radio key={index} value={option} colorScheme="brand">
                    {option}
                  </Radio>
                ))}
              </VStack>
            </RadioGroup>
          </motion.div>
          {currentQuestion === questions.length - 1 && (
            <Button colorScheme="brand" onClick={() => handleAnswer(answers[currentQuestion])}>
              Finish Quiz
            </Button>
          )}
        </VStack>
      </Box>
    </Flex>
  );
};

export default CompatibilityQuiz;