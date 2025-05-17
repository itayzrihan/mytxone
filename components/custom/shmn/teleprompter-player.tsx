"use client";

import React, { useEffect } from 'react';

interface ProtocolPart {
  content: string;
}

interface Protocol {
  name: string;
  description: string;
  parts: ProtocolPart[];
  createdAt: string;
}

const TeleprompterPlayer = () => {
  useEffect(() => {
    let currentProtocol: Protocol | null = null;
    let currentPartIndex = 0;
    let currentWordIndex = 0;
    let words: string[] = [];
    let isPlaying = false;
    let animationInterval: NodeJS.Timeout | null = null;
    
    // DOM elements
    const teleprompterText = document.querySelector('.teleprompter-text');
    const progressCircle = document.querySelector('.circle');
    const progressPercentage = document.querySelector('.progress-circle div');
      // Get the linear progress bar for the overall protocol
    const getLinearProgressBar = () => {
      // Get the progress bar that's already in the DOM
      const linearProgressBar = document.querySelector('#protocol-progress-bar div');
      
      if (linearProgressBar) {
        // Reset it to 0%
        const htmlElement = linearProgressBar as HTMLElement;
        htmlElement.style.width = '0%';
      }
      
      return linearProgressBar;
    };
      // Start a protocol
    const startProtocol = (protocolId: number) => {
      // Get protocol data
      const protocols: Protocol[] = JSON.parse(localStorage.getItem('protocols') || '[]');
      currentProtocol = protocols[protocolId];
      
      if (!currentProtocol || !currentProtocol.parts || currentProtocol.parts.length === 0) {
        console.error('Invalid protocol or no parts available');
        return;
      }
      
      // Reset indices
      currentPartIndex = 0;
      currentWordIndex = 0;
      
      // Get the linear progress bar
      getLinearProgressBar();
      
      // Start playing first part
      startPart();
      
      // Update console
      logToConsole(`Starting protocol: ${currentProtocol.name}`);
    };    // Detect if text is in Hebrew
    const isHebrew = (text: string): boolean => {
      // Hebrew Unicode range: \u0590-\u05FF
      const hebrewRegex = /[\u0590-\u05FF]/;
      return hebrewRegex.test(text);
    };
    
    // Start a part
    const startPart = () => {
      if (!currentProtocol || currentPartIndex >= currentProtocol.parts.length) {
        finishProtocol();
        return;
      }
      
      // Get current part
      const part = currentProtocol.parts[currentPartIndex];
      
      // Split content into words
      words = part.content.split(/\s+/);
      currentWordIndex = 0;
      
      // Check if content is Hebrew
      const isHebrewText = isHebrew(part.content);
        // Update teleprompter
      if (teleprompterText) {
        // Apply RTL direction if it's Hebrew
        const textElement = teleprompterText as HTMLElement;
        textElement.dir = isHebrewText ? 'rtl' : 'ltr';
        teleprompterText.innerHTML = words.map((word: string) => `<span class="word">${word}</span>`).join(' ');
      }
      
      // Update part indicator
      const partIndicator = document.querySelector('.protocol-part-indicator');
      if (partIndicator) {
        partIndicator.textContent = `Part ${currentPartIndex + 1}/${currentProtocol.parts.length}`;
      }
      
      // Start animation
      isPlaying = true;
      startWordAnimation();
      
      // Update console
      logToConsole(`Playing part ${currentPartIndex + 1} of ${currentProtocol.parts.length}`);
    };
    
    // Start word animation
    const startWordAnimation = () => {
      // Clear any existing interval
      if (animationInterval) clearInterval(animationInterval);
      
      // Set up word highlighting
      const wordElements = document.querySelectorAll('.word');
      
      // Highlight first word
      if (wordElements.length > 0) {
        highlightWord(wordElements[0]);
      }
      
      // Set up interval for word by word animation
      animationInterval = setInterval(() => {
        if (!isPlaying) return;
        
        // Update progress
        updatePartProgress();
        
        // Move to next word
        currentWordIndex++;
        
        // If we've reached the end of words
        if (currentWordIndex >= words.length) {
          if (animationInterval) clearInterval(animationInterval);
          
          // Wait a moment before moving to next part
          setTimeout(() => {
            currentPartIndex++;
            startPart();
          }, 1000);
          
          return;
        }
        
        // Highlight current word
        if (wordElements[currentWordIndex]) {
          highlightWord(wordElements[currentWordIndex]);
        }
      }, 1000); // 1 second per word
    };
      // Highlight a word
    const highlightWord = (wordElement: Element) => {
      // Remove highlight from all words
      document.querySelectorAll('.word').forEach(el => {
        el.classList.remove('bg-primary', 'text-white', 'px-1', 'py-0.5', 'rounded', 'shadow-glow');
      });
      
      // Add highlight to current word
      wordElement.classList.add('bg-primary', 'text-white', 'px-2', 'py-1', 'rounded-md', 'shadow-glow');
      
      // Scroll the teleprompter if needed to keep the word visible
      const teleprompter = document.querySelector('.teleprompter');
      if (teleprompter) {
        const wordRect = wordElement.getBoundingClientRect();
        const teleprompterRect = teleprompter.getBoundingClientRect();
        
        if (wordRect.bottom > teleprompterRect.bottom || wordRect.top < teleprompterRect.top) {
          wordElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }
    };
    
    // Update part progress
    const updatePartProgress = () => {
      if (!words.length) return;
      
      const progress = Math.min(100, Math.round((currentWordIndex / words.length) * 100));
      
      // Update circular progress
      if (progressCircle) {
        progressCircle.setAttribute('stroke-dasharray', `${progress}, 100`);
      }
      
      // Update percentage text
      if (progressPercentage) {
        progressPercentage.textContent = `${progress}%`;
      }
        // Update linear progress
      if (currentProtocol) {
        const overallProgress = (currentPartIndex + (currentWordIndex / words.length)) / currentProtocol.parts.length * 100;
        const linearProgressBar = document.querySelector('#protocol-progress-bar div');
        if (linearProgressBar) {
          const htmlElement = linearProgressBar as HTMLElement;
          htmlElement.style.width = `${overallProgress}%`;
        }
      }
    };    // Finish protocol
    const finishProtocol = () => {
      isPlaying = false;
      if (animationInterval) clearInterval(animationInterval);
      
      // Update teleprompter
      if (teleprompterText) {
        const textElement = teleprompterText as HTMLElement;
        textElement.dir = 'ltr'; // Reset direction to left-to-right
        teleprompterText.innerHTML = 'Protocol completed. Ready for next session.';
        teleprompterText.classList.add('text-center'); // Ensure text is centered
      }
      
      // Reset progress
      if (progressCircle) {
        progressCircle.setAttribute('stroke-dasharray', '0, 100');
      }
      
      if (progressPercentage) {
        progressPercentage.textContent = '0%';
      }
      
      // Reset part indicator
      const partIndicator = document.querySelector('.protocol-part-indicator');
      if (partIndicator) {
        partIndicator.textContent = 'Part 0/0';
      }
      
      // Reset linear progress bar
      const linearProgressBar = document.querySelector('#protocol-progress-bar div');
      if (linearProgressBar) {
        const htmlElement = linearProgressBar as HTMLElement;
        htmlElement.style.width = '0%';
      }
      
      // Update console
      if (currentProtocol) {
        logToConsole(`Protocol ${currentProtocol.name} completed successfully!`, 'green');
      }
      
      // Reset current protocol
      currentProtocol = null;
    };
    
    // Log to console
    const logToConsole = (message: string, color = 'blue') => {
      const consoleContent = document.querySelector('.console-content');
      if (consoleContent) {
        const messageEl = document.createElement('div');
        messageEl.className = 'mb-2';
        messageEl.innerHTML = `<span class="text-${color}-500">[${new Date().toLocaleTimeString()}]</span> ${message}`;
        consoleContent.appendChild(messageEl);
        consoleContent.scrollTop = consoleContent.scrollHeight;
      }
    };
    
    // Clear console
    const clearConsole = () => {
      const consoleContent = document.querySelector('.console-content');
      if (consoleContent) {
        consoleContent.innerHTML = '';
      }
    };
    
    // Set up event listeners
    const setupEventListeners = () => {
      // Listen for protocol start
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target && target.classList.contains('start-protocol')) {
          const protocolId = target.getAttribute('data-protocol-id');
          if (protocolId) {
            startProtocol(parseInt(protocolId));
          }
        }
      });
      
      // Clear console button
      const clearConsoleBtn = document.getElementById('clear-console');
      if (clearConsoleBtn) {
        clearConsoleBtn.addEventListener('click', clearConsole);
      }
    };
      // Add styles for word glow effect
    const addGlowStyles = () => {
      const styleEl = document.createElement('style');
      styleEl.textContent = `
        .shadow-glow {
          box-shadow: 0 0 10px 2px rgba(var(--color-primary), 0.8), 0 0 20px 4px rgba(var(--color-primary), 0.6);
          animation: pulse 1s infinite alternate ease-in-out;
          transition: all 0.3s ease-in-out;
          font-weight: bold;
          letter-spacing: 0.02em;
        }
        
        @keyframes pulse {
          from { 
            box-shadow: 0 0 10px 2px rgba(var(--color-primary), 0.8), 0 0 20px 4px rgba(var(--color-primary), 0.6);
            transform: scale(1);
          }
          to { 
            box-shadow: 0 0 15px 3px rgba(var(--color-primary), 0.9), 0 0 30px 6px rgba(var(--color-primary), 0.7);
            transform: scale(1.05);
          }
        }
        
        .word {
          display: inline-block;
          margin: 0 2px;
          transition: all 0.2s ease-out;
          border-radius: 4px;
        }
      `;
      document.head.appendChild(styleEl);
    };
    
    // Initialize
    setupEventListeners();
    addGlowStyles();
    
    // Cleanup on unmount
    return () => {
      if (animationInterval) clearInterval(animationInterval);
      const clearConsoleBtn = document.getElementById('clear-console');
      if (clearConsoleBtn) {
        clearConsoleBtn.removeEventListener('click', clearConsole);
      }
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export { TeleprompterPlayer };

