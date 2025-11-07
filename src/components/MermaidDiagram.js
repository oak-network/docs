import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

const MermaidDiagram = ({ children, title = "Diagram" }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsFullscreen(false);
      }
    };

    const handleResize = () => {
      if (isFullscreen) {
        // Re-scale the diagram when window is resized
        setTimeout(() => {
          const mermaidElements = document.querySelectorAll('.mermaid-modal .mermaid');
          mermaidElements.forEach(element => {
            const svg = element.querySelector('svg');
            if (svg) {
              const viewBox = svg.getAttribute('viewBox');
              if (viewBox) {
                const [, , width, height] = viewBox.split(' ').map(Number);
                if (width && height) {
                  const largeWidth = Math.max(window.innerWidth * 0.8, 2000);
                  const scale = largeWidth / width;
                  const largeHeight = height * scale;
                  
                  svg.style.width = `${largeWidth}px`;
                  svg.style.height = `${largeHeight}px`;
                  svg.style.maxWidth = 'none';
                  svg.style.maxHeight = 'none';
                  svg.style.minWidth = 'none';
                  svg.style.minHeight = 'none';
                  svg.style.display = 'block';
                  
                  svg.setAttribute('width', largeWidth);
                  svg.setAttribute('height', largeHeight);
                }
              }
            }
          });
        }, 100);
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', handleResize);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  const openFullscreen = () => {
    console.log('🔍 Opening fullscreen...');
    setIsFullscreen(true);
    
    // Force Mermaid to re-render with much larger dimensions
    setTimeout(() => {
      console.log('🔍 Looking for mermaid elements...');
      
      // Try different selectors to find the mermaid elements
      const selectors = [
        '.mermaid-modal .mermaid',
        '.mermaid-modal mermaid',
        '.mermaid-modal [class*="mermaid"]',
        '.mermaid-modal svg',
        '.mermaid-modal',
        'mermaid',
        '.mermaid'
      ];
      
      let mermaidElements = [];
      let workingSelector = '';
      
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        console.log(`🔍 Selector "${selector}" found:`, elements.length, 'elements');
        if (elements.length > 0) {
          mermaidElements = elements;
          workingSelector = selector;
          break;
        }
      }
      
      console.log('🔍 Using selector:', workingSelector);
      console.log('🔍 Found mermaid elements:', mermaidElements.length);
      
      // If no mermaid elements found, try to find SVG elements directly
      if (mermaidElements.length === 0) {
        console.log('🔍 No mermaid elements found, looking for SVG elements directly...');
        const svgElements = document.querySelectorAll('svg');
        console.log('🔍 Found SVG elements:', svgElements.length);
        
        svgElements.forEach((svg, index) => {
          console.log(`🔍 Processing SVG ${index} directly:`, svg);
          processSvgElement(svg, index);
        });
      } else {
        mermaidElements.forEach((element, index) => {
          console.log(`🔍 Processing element ${index}:`, element);
          const svg = element.querySelector('svg');
          console.log(`🔍 Found SVG:`, svg);
          
          if (svg) {
            processSvgElement(svg, index);
          }
        });
      }
      
      function processSvgElement(svg, index) {
        console.log('🔍 SVG before modification:', {
          width: svg.getAttribute('width'),
          height: svg.getAttribute('height'),
          styleWidth: svg.style.width,
          styleHeight: svg.style.height,
          maxWidth: svg.style.maxWidth
        });
        
        // Get the viewBox to determine the natural size
        const viewBox = svg.getAttribute('viewBox');
        console.log('🔍 ViewBox:', viewBox);
        
        if (viewBox) {
          const [, , width, height] = viewBox.split(' ').map(Number);
          console.log('🔍 ViewBox dimensions:', width, height);
          
          if (width && height) {
            // Calculate a very large width for the SVG
            const largeWidth = Math.max(window.innerWidth * 0.8, 2000); // At least 2000px or 80% of screen
            const scale = largeWidth / width;
            const largeHeight = height * scale;
            
            console.log('🔍 Calculated dimensions:', { largeWidth, largeHeight, scale });
            
            // Force override the style attribute completely
            svg.setAttribute('style', `width: ${largeWidth}px !important; height: ${largeHeight}px !important; max-width: none !important; max-height: none !important; min-width: none !important; min-height: none !important; display: block !important;`);
            
            // Also set the attributes
            svg.setAttribute('width', largeWidth);
            svg.setAttribute('height', largeHeight);
            
            // Force override CSS properties as well
            svg.style.setProperty('width', `${largeWidth}px`, 'important');
            svg.style.setProperty('height', `${largeHeight}px`, 'important');
            svg.style.setProperty('max-width', 'none', 'important');
            svg.style.setProperty('max-height', 'none', 'important');
            svg.style.setProperty('min-width', 'none', 'important');
            svg.style.setProperty('min-height', 'none', 'important');
            
            console.log('🔍 SVG after modification:', {
              width: svg.getAttribute('width'),
              height: svg.getAttribute('height'),
              styleWidth: svg.style.width,
              styleHeight: svg.style.height,
              maxWidth: svg.style.maxWidth
            });
          }
        } else {
          // Fallback: use a very large fixed width
          const largeWidth = Math.max(window.innerWidth * 0.8, 2000);
          const largeHeight = 1000;
          
          console.log('🔍 Using fallback dimensions:', { largeWidth, largeHeight });
          
          // Force override the style attribute completely
          svg.setAttribute('style', `width: ${largeWidth}px !important; height: ${largeHeight}px !important; max-width: none !important; max-height: none !important; min-width: none !important; min-height: none !important; display: block !important;`);
          
          svg.setAttribute('width', largeWidth);
          svg.setAttribute('height', largeHeight);
          
          // Force override CSS properties as well
          svg.style.setProperty('width', `${largeWidth}px`, 'important');
          svg.style.setProperty('height', `${largeHeight}px`, 'important');
          svg.style.setProperty('max-width', 'none', 'important');
          svg.style.setProperty('max-height', 'none', 'important');
          svg.style.setProperty('min-width', 'none', 'important');
          svg.style.setProperty('min-height', 'none', 'important');
        }
      }
    }, 200);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  return (
    <>
      <div className="mermaid-diagram-container" style={{ 
        border: '1px solid rgba(251, 162, 68, 0.2)', 
        padding: '1rem', 
        margin: '1rem 0',
        borderRadius: '8px',
        background: '#1B1F30'
      }}>
        <h3 className="mermaid-diagram-title" style={{ color: '#FFFFFF', marginBottom: '1rem' }}>{title}</h3>
        <div style={{ background: '#13171C', padding: '1rem', borderRadius: '4px' }}>
          {children}
        </div>
        <button 
          onClick={openFullscreen}
          style={{
            background: '#FBA244',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          <i className="fas fa-expand"></i> Fullscreen
        </button>
      </div>

      {/* Fullscreen Modal */}
      <div
        className={clsx('mermaid-modal', { active: isFullscreen })}
        ref={modalRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.9)',
          display: isFullscreen ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '2rem'
        }}
      >
                <div style={{
                  background: '#1B1F30',
                  border: '1px solid rgba(251, 162, 68, 0.2)',
                  borderRadius: '20px',
                  padding: '2rem', // Back to normal padding
                  width: '95vw',
                  height: '95vh',
                  overflow: 'auto',
                  position: 'relative',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
          <button
            onClick={closeFullscreen}
            className="mermaid-close-button"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'transparent',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              fontSize: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000,
              opacity: 0.7,
              transition: 'opacity 0.2s ease'
            }}
            title="Close fullscreen"
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
          >
            <i className="fas fa-times"></i>
          </button>
          
                  <h3 className="mermaid-modal-title" style={{ 
                    color: '#FFFFFF', 
                    marginTop: '0',
                    marginBottom: '2rem', 
                    textAlign: 'center',
                    fontSize: '2rem',
                    fontWeight: '700'
                  }}>
                    {title}
                  </h3>
          
          <div style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start', // Always start from top
            overflow: 'auto',
            background: '#1B1F30',
            borderRadius: '12px',
            padding: '2rem',
            minHeight: '80vh', // Ensure minimum height for scrolling
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start', // Start from top
              width: '100%',
              minHeight: 'calc(100vh - 300px)', // Ensure content is tall enough to scroll
              padding: '3rem 2rem 2rem 2rem' // Equal padding on all sides
            }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MermaidDiagram;