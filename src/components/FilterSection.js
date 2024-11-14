import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  VStack, Heading, Text, Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb,
  Switch, Checkbox, Button, Tabs, TabList, Tab, TabPanels, TabPanel,
  Accordion, AccordionItem, AccordionButton, AccordionPanel,
  Radio, RadioGroup, Stack, Select, useToast, Input, HStack,
  Popover, PopoverTrigger, PopoverContent, PopoverBody, PopoverArrow,
  Tag, TagLabel, TagCloseButton, Wrap, WrapItem
} from '@chakra-ui/react';
import { AddIcon, CloseIcon, InfoIcon } from '@chakra-ui/icons';

const MotionBox = motion(Box);

const FilterSection = () => {
  const toast = useToast();
  const [filters, setFilters] = useState({
    semester: '',
    branch: [],
    block: '',
    gpa: [0, 4],
    sports: [],
    clubs: [],
    courseLoad: '',
    studyPreference: '',
    projectInterests: [],
    internshipStatus: '',
    researchExperience: false,
    programmingLanguages: [],
    favoriteSubjects: [],
    careerGoals: '',
    learningStyle: '',
  });

  const [activeFilters, setActiveFilters] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleAdvancedFilter = (filter) => {
    setActiveFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const filterOptions = {
    semester: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'],
    branch: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Biotechnology'],
    block: ['A', 'B', 'C', 'D1', 'D2'],
    sports: ['Basketball', 'Football', 'Cricket', 'Tennis', 'Volleyball', 'Badminton', 'Table Tennis', 'Athletics'],
    clubs: ['Coding Club', 'Robotics Club', 'Debate Club', 'Music Club', 'Dance Club', 'Photography Club', 'Entrepreneurship Cell'],
    courseLoad: ['Light', 'Moderate', 'Heavy'],
    studyPreference: ['Solo', 'Small Groups', 'Large Groups', 'Mixed'],
    internshipStatus: ['Looking', 'Not Looking', 'Currently Interning'],
    programmingLanguages: ['Python', 'Java', 'C++', 'JavaScript', 'Ruby', 'Go', 'Rust', 'Swift'],
    favoriteSubjects: ['Data Structures', 'Algorithms', 'Database Management', 'Machine Learning', 'Web Development', 'Computer Networks', 'Operating Systems'],
    careerGoals: ['Software Engineer', 'Data Scientist', 'Product Manager', 'Researcher', 'Entrepreneur', 'Cybersecurity Specialist'],
    learningStyle: ['Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing'],
  };

  const applyFilters = () => {
    const newAppliedFilters = Object.entries(filters)
      .filter(([key, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'boolean') return value;
        return value !== '' && value !== null && value !== undefined;
      })
      .map(([key, value]) => ({ key, value }));

    setAppliedFilters(newAppliedFilters);
    toast({
      title: "Filters Applied",
      description: "Your matches have been updated based on your filters.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const resetFilters = () => {
    setFilters({
      semester: '',
      branch: [],
      block: '',
      gpa: [0, 4],
      sports: [],
      clubs: [],
      courseLoad: '',
      studyPreference: '',
      projectInterests: [],
      internshipStatus: '',
      researchExperience: false,
      programmingLanguages: [],
      favoriteSubjects: [],
      careerGoals: '',
      learningStyle: '',
    });
    setActiveFilters([]);
    setAppliedFilters([]);
    toast({
      title: "Filters Reset",
      description: "All filters have been reset to default values.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const removeAppliedFilter = (key) => {
    setAppliedFilters(prev => prev.filter(filter => filter.key !== key));
    if (Array.isArray(filters[key])) {
      setFilters(prev => ({ ...prev, [key]: [] }));
    } else if (typeof filters[key] === 'boolean') {
      setFilters(prev => ({ ...prev, [key]: false }));
    } else {
      setFilters(prev => ({ ...prev, [key]: '' }));
    }
  };

  return (
    <VStack align="start" spacing={4} w="full">
      <Heading as="h4" size="md" color="gray.700">
        Find Your Perfect University Match
      </Heading>
      
      <Tabs variant="soft-rounded" colorScheme="purple" w="full">
        <TabList>
          <Tab>Basic Filters</Tab>
          <Tab>Advanced Filters</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel>
            <VStack align="start" spacing={4} w="full">
              <Box w="full">
                <Text mb={2} fontWeight="medium">Semester</Text>
                <Select
                  placeholder="Select semester"
                  value={filters.semester}
                  onChange={(e) => updateFilter('semester', e.target.value)}
                >
                  {filterOptions.semester.map((sem) => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </Select>
              </Box>
              
              <Box w="full">
                <Text mb={2} fontWeight="medium">Branch</Text>
                <Wrap>
                  {filterOptions.branch.map((branch) => (
                    <WrapItem key={branch}>
                      <Tag
                        size="md"
                        variant={filters.branch.includes(branch) ? "solid" : "outline"}
                        colorScheme="purple"
                        cursor="pointer"
                        onClick={() => {
                          if (filters.branch.includes(branch)) {
                            updateFilter('branch', filters.branch.filter(b => b !== branch));
                          } else {
                            updateFilter('branch', [...filters.branch, branch]);
                          }
                        }}
                      >
                        {branch}
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
              
              <Box w="full">
                <Text mb={2} fontWeight="medium">Block</Text>
                <RadioGroup
                  value={filters.block}
                  onChange={(value) => updateFilter('block', value)}
                >
                  <Stack direction="row">
                    {filterOptions.block.map((block) => (
                      <Radio key={block} value={block}>{block}</Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </Box>
              
              <Box w="full">
                <Text mb={2} fontWeight="medium">GPA Range</Text>
                <Slider
                  min={0}
                  max={4}
                  step={0.1}
                  value={filters.gpa}
                  onChange={(val) => updateFilter('gpa', val)}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb index={0} />
                  <SliderThumb index={1} />
                </Slider>
                <Text mt={2} fontSize="sm" color="gray.500">
                  {filters.gpa[0].toFixed(1)} - {filters.gpa[1].toFixed(1)}
                </Text>
              </Box>
            </VStack>
          </TabPanel>
          
          <TabPanel>
            <Accordion allowMultiple w="full">
              {Object.entries(filterOptions).map(([key, options]) => (
                <AccordionItem key={key}>
                  <h2>
                    <AccordionButton onClick={() => toggleAdvancedFilter(key)}>
                      <Box flex="1" textAlign="left">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Box>
                      {activeFilters.includes(key) ? <CloseIcon /> : <AddIcon />}
                    </AccordionButton>
                  </h2>
                  <AnimatePresence>
                    {activeFilters.includes(key) && (
                      <AccordionPanel pb={4}>
                        <MotionBox
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {['sports', 'clubs', 'programmingLanguages', 'favoriteSubjects'].includes(key) ? (
                            <Wrap>
                              {options.map((option) => (
                                <WrapItem key={option}>
                                  <Tag
                                    size="md"
                                    variant={filters[key].includes(option) ? "solid" : "outline"}
                                    colorScheme="purple"
                                    cursor="pointer"
                                    onClick={() => {
                                      if (filters[key].includes(option)) {
                                        updateFilter(key, filters[key].filter(item => item !== option));
                                      } else {
                                        updateFilter(key, [...filters[key], option]);
                                      }
                                    }}
                                  >
                                    {option}
                                  </Tag>
                                </WrapItem>
                              ))}
                            </Wrap>
                          ) : key === 'researchExperience' ? (
                            <Switch
                              isChecked={filters[key]}
                              onChange={(e) => updateFilter(key, e.target.checked)}
                            />
                          ) : (
                            <Select
                              placeholder={`Select ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                              value={filters[key]}
                              onChange={(e) => updateFilter(key, e.target.value)}
                            >
                              {options.map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </Select>
                          )}
                        </MotionBox>
                      </AccordionPanel>
                    )}
                  </AnimatePresence>
                </AccordionItem>
              ))}
            </Accordion>
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      <Button
        colorScheme="purple"
        w="full"
        onClick={applyFilters}
        leftIcon={<InfoIcon />}
      >
        Apply Filters
      </Button>
      
      <Button
        colorScheme="gray"
        variant="outline"
        w="full"
        onClick={resetFilters}
        leftIcon={<CloseIcon />}
      >
        Reset Filters
      </Button>

      {appliedFilters.length > 0 && (
        <Box w="full">
          <Text mb={2} fontWeight="medium">Applied Filters:</Text>
          <Wrap>
            {appliedFilters.map(({ key, value }) => (
              <WrapItem key={key}>
                <Tag size="md" variant="subtle" colorScheme="purple">
                  <TagLabel>{`${key}: ${Array.isArray(value) ? value.join(', ') : value}`}</TagLabel>
                  <TagCloseButton onClick={() => removeAppliedFilter(key)} />
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      )}
    </VStack>
  );
};

export default FilterSection;