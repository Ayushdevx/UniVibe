import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Upload, X, Share2, Copy, QrCode, Moon, Sun, Github, MessageCircle, Link, Image, Zap, Loader } from 'lucide-react';
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';
import { QRCodeSVG } from 'qrcode.react';
import { useMouse } from 'react-use';
import axios from 'axios';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Input,
  Tooltip,
  useColorMode,
  IconButton,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Switch,
  Badge,
} from '@chakra-ui/react';

const LiveFileSharing = ({ isOpen, onClose }) => {
  const [files, setFiles] = useState([]);
  const [shareLinks, setShareLinks] = useState([]);
  const [shortLinks, setShortLinks] = useState([]);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const containerRef = useRef(null);
  const { elX, elY } = useMouse(containerRef);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [0, dimensions.height], [5, -5]);
  const rotateY = useTransform(mouseX, [0, dimensions.width], [-5, 5]);
  const controls = useAnimation();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (isOpen) {
      controls.start({
        scale: [0.9, 1.05, 1],
        transition: { duration: 0.5, ease: "easeOut" }
      });
    }
  }, [isOpen, controls]);

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight
      });
    }
  }, [isOpen]);

  useEffect(() => {
    mouseX.set(elX);
    mouseY.set(elY);
  }, [elX, elY]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    toast({
      title: "Files added",
      description: `${acceptedFiles.length} file(s) added successfully`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

  const handleUpload = async (fileInfo) => {
    if (fileInfo) {
      setIsLoading(true);
      setUploadProgress(0);
      const longUrl = `https://ucarecdn.com/${fileInfo.uuid}/`;
      setShareLinks((prevLinks) => [...prevLinks, longUrl]);
      
      try {
        const response = await axios.post('https://api.tinyurl.com/create', {
          url: longUrl,
          domain: 'tiny.one'
        }, {
          headers: {
            'Authorization': `Bearer vjwX3ZgmYj8fsw4XzN5MbQoatqrWQWLGA7Soq3KuiDUZQPzehCrqCaZtidC0`,
            'Content-Type': 'application/json'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        });
        setShortLinks((prevShortLinks) => [...prevShortLinks, response.data.data.tiny_url]);
        toast({
          title: "Upload successful",
          description: "File uploaded and link shortened successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error shortening URL:', error);
        toast({
          title: "Upload failed",
          description: "Failed to upload file. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
        setUploadProgress(0);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortLinks.join('\n') || shareLinks.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Links copied",
      description: "File links copied to clipboard",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setShareLinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
    setShortLinks((prevShortLinks) => prevShortLinks.filter((_, i) => i !== index));
    setSelectedFiles((prevSelected) => prevSelected.filter((_, i) => i !== index));
  };

  const toggleFileSelection = (index) => {
    setSelectedFiles((prevSelected) => {
      if (prevSelected.includes(index)) {
        return prevSelected.filter(i => i !== index);
      } else {
        return [...prevSelected, index];
      }
    });
  };

  const generateQR = () => {
    if (selectedFiles.length === 0) return;
    const urls = selectedFiles.map(index => shortLinks[index] || shareLinks[index]);
    setShowQR(urls.join(','));
  };

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      inset="0"
      zIndex={50}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
      bg="blackAlpha.500"
      backdropFilter="blur(5px)"
    >
      <motion.div
        ref={containerRef}
        initial={{ scale: 0.9, y: 50 }}
        animate={controls}
        exit={{ scale: 0.9, y: 50 }}
        style={{ rotateX, rotateY, perspective: 1000 }}
      >
        <Box
          w="full"
          maxW="md"
          p={6}
          borderRadius="2xl"
          overflow="hidden"
          bg={colorMode === 'dark' ? 'gray.800' : 'white'}
          boxShadow="xl"
          position="relative"
        >
          <IconButton
            icon={<X />}
            onClick={onClose}
            position="absolute"
            top={4}
            right={4}
            aria-label="Close"
          />

          <VStack spacing={6}>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              bgGradient="linear(to-r, blue.400, teal.400)"
              bgClip="text"
            >
              Zap Share
            </Text>

            <Box w="full" bg={colorMode === 'dark' ? 'gray.700' : 'gray.100'} p={4} borderRadius="lg">
              <FileUploaderRegular
                sourceList="local, url, camera, dropbox, facebook, gdrive, gphotos, instagram"
                classNameUploader={colorMode === 'dark' ? 'uc-dark' : 'uc-light'}
                pubkey="cd14305434bdddf14650"
                onChange={handleUpload}
                multiple
              />
            </Box>

            <VStack w="full" spacing={2} maxH="40" overflowY="auto">
              {files.map((file, index) => (
                <FilePreview
                  key={file.name}
                  file={file}
                  index={index}
                  isSelected={selectedFiles.includes(index)}
                  onSelect={toggleFileSelection}
                  onRemove={removeFile}
                />
              ))}
            </VStack>

            {isLoading && (
              <Box w="full">
                <Progress value={uploadProgress} size="sm" colorScheme="blue" />
                <Text textAlign="center" mt={2} fontSize="sm" color="gray.500">
                  Uploading... {uploadProgress}%
                </Text>
              </Box>
            )}

            {shareLinks.length > 0 && (
              <ShareOptions
                shareLinks={shareLinks}
                shortLinks={shortLinks}
                onCopy={handleCopy}
                onGenerateQR={generateQR}
              />
            )}

            {showQR && <QRCodeDisplay value={showQR} />}

            <HStack w="full" justifyContent="space-between">
              <Switch
                isChecked={colorMode === 'dark'}
                onChange={toggleColorMode}
                size="lg"
              />
              <Tooltip label="View on GitHub">
                <IconButton
                  as="a"
                  href="https://github.com/Ayushdevx"
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={<Github />}
                  aria-label="GitHub"
                />
              </Tooltip>
            </HStack>
          </VStack>
        </Box>
      </motion.div>
    </Box>
  );
};

const FilePreview = ({ file, index, isSelected, onSelect, onRemove }) => {
  const fileType = file.type.split('/')[0];
  const iconMap = {
    'image': Image,
    'audio': MessageCircle,
    'video': MessageCircle,
    'application': Share2,
  };
  const Icon = iconMap[fileType] || Share2;

  return (
    <HStack
      w="full"
      p={3}
      borderRadius="lg"
      bg={isSelected ? 'blue.100' : 'gray.100'}
      _hover={{ bg: isSelected ? 'blue.200' : 'gray.200' }}
      cursor="pointer"
      onClick={() => onSelect(index)}
    >
      <Icon size={24} />
      <VStack align="start" spacing={0} flex={1}>
        <Text fontWeight="medium" isTruncated>{file.name}</Text>
        <Text fontSize="xs" color="gray.500">{formatFileSize(file.size)}</Text>
      </VStack>
      <IconButton
        icon={<X size={16} />}
        size="sm"
        colorScheme="red"
        variant="ghost"
        onClick={(e) => { e.stopPropagation(); onRemove(index); }}
        aria-label="Remove file"
      />
    </HStack>
  );
};

const ShareOptions = ({ shareLinks, shortLinks, onCopy, onGenerateQR }) => {
  return (
    <VStack w="full" spacing={4}>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          value={shortLinks.join('\n') || shareLinks.join('\n')}
          readOnly
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={onCopy}>
            {copied ? <Zap size={16} /> : <Copy size={16} />}
          </Button>
        </InputRightElement>
      </InputGroup>
      <Button
        leftIcon={<QrCode size={16} />}
        onClick={onGenerateQR}
        isDisabled={selectedFiles.length === 0}
      >
        Generate QR
      </Button>
    </VStack>
  );
};

const QRCodeDisplay = ({ value }) => {
  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="md">
      <QRCodeSVG value={value} size={200} />
    </Box>
  );
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default LiveFileSharing;