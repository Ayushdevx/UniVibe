import React, { useRef, useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const DynamicBackground = () => {
  const canvasRef = useRef(null);
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      constructor(x, y, size, color, shape) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.shape = shape;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.sinValue = Math.random() * Math.PI * 2;
        this.growthSpeed = 0.05;
        this.maxSize = size * 1.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.sinValue += 0.05;
        this.size = this.size + Math.sin(this.sinValue) * this.growthSpeed;

        if (this.size > this.maxSize || this.size < 0) {
          this.growthSpeed *= -1;
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        switch (this.shape) {
          case 'circle':
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            break;
          case 'square':
            ctx.rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
            break;
          case 'triangle':
            ctx.moveTo(this.x, this.y - this.size);
            ctx.lineTo(this.x - this.size, this.y + this.size);
            ctx.lineTo(this.x + this.size, this.y + this.size);
            ctx.closePath();
            break;
        }

        if (Math.random() > 0.5) {
          ctx.fill();
        } else {
          ctx.stroke();
        }
      }
    }

    // Create particle array
    let particleArray = [];

    // Mouse position
    let mouse = {
      x: null,
      y: null,
      radius: 150
    };

    window.addEventListener('mousemove', (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    });

    // Create particles
    function init() {
      particleArray = [];
      const particleCount = 150;
      const shapes = ['circle', 'square', 'triangle'];

      for (let i = 0; i < particleCount; i++) {
        let size = Math.random() * 5 + 2;
        let x = Math.random() * (canvas.width - size * 2);
        let y = Math.random() * (canvas.height - size * 2);
        let color;
        let shape = shapes[Math.floor(Math.random() * shapes.length)];

        switch (theme) {
          case 'neon':
            color = `hsl(${Math.random() * 360}, 100%, 50%)`;
            break;
          case 'pastel':
            color = `hsl(${Math.random() * 360}, 70%, 80%)`;
            break;
          case 'monochrome':
            const shade = Math.floor(Math.random() * 255);
            color = `rgb(${shade}, ${shade}, ${shade})`;
            break;
          default:
            color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        }

        particleArray.push(new Particle(x, y, size, color, shape));
      }
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].update();
        particleArray[i].draw();
        
        // Connect particles
        for (let j = i; j < particleArray.length; j++) {
          const dx = particleArray[i].x - particleArray[j].x;
          const dy = particleArray[i].y - particleArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = particleArray[i].color;
            ctx.lineWidth = 0.2;
            ctx.moveTo(particleArray[i].x, particleArray[i].y);
            ctx.lineTo(particleArray[j].x, particleArray[j].y);
            ctx.stroke();
          }
        }

        // Mouse interaction
        if (mouse.x != null && mouse.y != null) {
          const dx = particleArray[i].x - mouse.x;
          const dy = particleArray[i].y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const angle = Math.atan2(dy, dx);
            const force = (mouse.radius - distance) / mouse.radius;
            particleArray[i].x += Math.cos(angle) * force * 5;
            particleArray[i].y += Math.sin(angle) * force * 5;
          }
        }

        // Boundary check with wrapping
        if (particleArray[i].x < 0) particleArray[i].x = canvas.width;
        if (particleArray[i].x > canvas.width) particleArray[i].x = 0;
        if (particleArray[i].y < 0) particleArray[i].y = canvas.height;
        if (particleArray[i].y > canvas.height) particleArray[i].y = 0;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    }

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  // Theme changer function
  const changeTheme = () => {
    const themes = ['default', 'neon', 'pastel', 'monochrome'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={-1}
      onClick={changeTheme}
      cursor="pointer"
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      <Box
        position="absolute"
        bottom={4}
        right={4}
        padding={2}
        backgroundColor="rgba(0, 0, 0, 0.5)"
        color="white"
        borderRadius="md"
        fontSize="sm"
      >
        Click to change theme: {theme}
      </Box>
    </Box>
  );
};

export default DynamicBackground;