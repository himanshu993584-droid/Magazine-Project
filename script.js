// Search filter with smooth animations
const searchBar = document.getElementById("searchBar");
const articles = document.querySelectorAll(".card");

searchBar.addEventListener("keyup", (e) => {
  const term = e.target.value.toLowerCase();
  articles.forEach((article) => {
    const title = article.getAttribute("data-title").toLowerCase();
    if (title.includes(term)) {
      article.style.display = "block";
      article.style.opacity = "1";
      article.style.transform = "scale(1)";
    } else {
      article.style.opacity = "0";
      article.style.transform = "scale(0.8)";
      setTimeout(() => {
        if (article.style.opacity === "0") {
      article.style.display = "none";
        }
      }, 300);
    }
  });
});

// Smooth scroll to sections
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Legacy function for backward compatibility
function scrollToArticles() {
  scrollToSection('technology');
}

  // Enhanced article click handler
  function openArticle(type) {
    const articles = {
      ai: "🤖 AI Revolution: Artificial Intelligence is revolutionizing every industry from healthcare diagnostics to financial trading. Discover the latest breakthroughs!",
      space: "🚀 Mars & Beyond: SpaceX, NASA, and other space agencies are making interplanetary travel a reality. The next decade will see humans on Mars!",
      energy: "🌱 Clean Energy Future: Solar, wind, and fusion energy are transforming how we power our world. A sustainable future is within reach!",
      gadgets: "📱 Next-Gen Gadgets: From foldable phones to AR glasses, discover the cutting-edge devices that will define the next decade!",
      quantum: "⚛️ Quantum Computing: Quantum computers will solve complex problems in seconds that would take classical computers millennia!",
      "5g": "📡 5G Revolution: Ultra-fast 5G networks are enabling autonomous vehicles, smart cities, and immersive AR/VR experiences!",
      biotech: "🧬 Biotechnology Advances: CRISPR gene editing and personalized medicine are revolutionizing healthcare and extending human lifespan!",
      smarthome: "🏠 Smart Home Revolution: AI-powered homes that learn your habits, optimize energy use, and enhance security automatically!",
      wellness: "🧘 Digital Wellness: Learn how to maintain mental health and find balance in our increasingly connected digital world!",
      blockchain: "⛓️ Blockchain Future: Decentralized technologies are revolutionizing finance, supply chains, and digital ownership!",
      vrar: "🥽 Virtual Reality: Immersive technologies are changing how we work, learn, and experience entertainment!",
      ocean: "🌊 Ocean Innovation: Advanced submersibles and marine conservation technologies are exploring the depths!",
      smartcities: "🏙️ Smart Cities: Urban innovation is creating sustainable, connected, and livable cities of the future!",
      remotework: "💻 Future of Work: Remote work technologies are reshaping careers and work-life balance globally!",
      healthtech: "🏥 Health Technology: Wearable devices and health apps are revolutionizing personal wellness and medical care!"
    };
    
    alert(articles[type] || "📰 Article coming soon! Stay tuned for more exciting content!");
  }
  
  // GSAP Card Animation System
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize card galleries
    const cardGalleries = document.querySelectorAll('.card-gallery');
    const cardAnimations = {};
    let isDragging = false;
    
    // Track drag state globally
    document.addEventListener('mousedown', () => { isDragging = true; });
    document.addEventListener('mouseup', () => { isDragging = false; });
    document.addEventListener('dragstart', () => { isDragging = true; });
    document.addEventListener('dragend', () => { isDragging = false; });
    
    cardGalleries.forEach(gallery => {
      const section = gallery.getAttribute('data-section');
      const cards = gallery.querySelectorAll('.card');
      const prevBtn = gallery.querySelector('.card-prev');
      const nextBtn = gallery.querySelector('.card-next');
      
      if (cards.length === 0) return;
      
      // Create seamless loop animation
      const animation = createCardLoop(cards, section);
      cardAnimations[section] = animation;
      
      // Add button event listeners
      if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
          animation.previous();
        });
        
        nextBtn.addEventListener('click', () => {
          animation.next();
        });
      }
      
      // Add drag hover effects to cards
      cards.forEach(card => {
        card.addEventListener('dragenter', (e) => {
          e.preventDefault();
          card.classList.add('drag-hover');
        });
        
        card.addEventListener('dragover', (e) => {
          e.preventDefault();
        });
        
        card.addEventListener('dragleave', (e) => {
          if (!card.contains(e.relatedTarget)) {
            card.classList.remove('drag-hover');
          }
        });
        
        card.addEventListener('drop', (e) => {
          e.preventDefault();
          card.classList.remove('drag-hover');
        });
        
        // Also add mouse drag simulation
        card.addEventListener('mouseenter', () => {
          if (isDragging) {
            card.classList.add('drag-hover');
          }
        });
        
        card.addEventListener('mouseleave', () => {
          card.classList.remove('drag-hover');
        });
      });
    });
    
    function createCardLoop(cards, section) {
      let currentIndex = 0;
      const totalCards = cards.length;
      
      // Set initial deck positions - all cards visible in stack
      cards.forEach((card, index) => {
        gsap.set(card, {
          opacity: 1,
          scale: 1
        });
      });
      
      function animateToCard(index, direction = 1) {
        if (index === currentIndex) return;
        
        const tl = gsap.timeline();
        
        // Animate all cards to new straight positions
        cards.forEach((card, cardIndex) => {
          const relativeIndex = (cardIndex - index + totalCards) % totalCards;
          let zIndex, translateX;
          
          switch(relativeIndex) {
            case 0: // Position 1 (far left)
              zIndex = 50;
              translateX = -720;
              break;
            case 1: // Position 2 (left)
              zIndex = 50;
              translateX = -360;
              break;
            case 2: // Position 3 (center)
              zIndex = 50;
              translateX = 0;
              break;
            case 3: // Position 4 (right)
              zIndex = 50;
              translateX = 360;
              break;
            case 4: // Position 5 (far right)
              zIndex = 50;
              translateX = 720;
              break;
          }
          
          tl.to(card, {
            zIndex: zIndex,
            x: translateX,
            rotation: 0,
            duration: 0.8,
            ease: "power2.inOut"
          }, 0);
        });
        
        currentIndex = index;
      }
      
      return {
        next() {
          const nextIndex = (currentIndex + 1) % totalCards;
          animateToCard(nextIndex, 1);
        },
        previous() {
          const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
          animateToCard(prevIndex, -1);
        },
        goTo(index) {
          if (index !== currentIndex) {
            animateToCard(index);
          }
        }
      };
    }
    
    // Initialize cards when sections come into view with deck effect
    ScrollTrigger.batch('.card-gallery', {
      onEnter: (elements) => {
        elements.forEach(element => {
          const cards = element.querySelectorAll('.card');
          const section = element.getAttribute('data-section');
          
          // Animate entire deck in with staggered effect
          gsap.fromTo(cards, 
            {
              opacity: 0,
              scale: 0.8,
              rotateY: -30
            },
            {
              opacity: 1,
              scale: 1,
              rotateY: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "back.out(1.7)"
            }
          );
          
          // Add smooth color transition effect for the section
          const sectionElement = element.closest('section');
          gsap.to(sectionElement, {
            duration: 1,
            ease: "power2.out"
          });
        });
      },
      start: "top 80%"
    });
    
    // Smooth color blending on scroll
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const progress = self.progress;
        const sections = document.querySelectorAll('section');
        
        sections.forEach((section, index) => {
          const sectionProgress = (progress * sections.length) - index;
          const opacity = Math.max(0, Math.min(1, 1 - Math.abs(sectionProgress)));
          
          // Smooth color blending for each section
          gsap.to(section, {
            duration: 0.3,
            ease: "power2.out"
          });
        });
      }
    });
  }

// Add loading effect to images and setup active link tracking
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('.card img');
  images.forEach((img, index) => {
    img.style.animationDelay = `${index * 0.1}s`;
  });
  
  // Set up intersection observer for active navigation
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar a[href^="#"]');
  const progressDots = document.querySelectorAll('.progress-dot');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove active class from all links and progress dots
        navLinks.forEach(link => link.classList.remove('active'));
        progressDots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current section link
        const activeLink = document.querySelector(`.navbar a[href="#${entry.target.id}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
        
        // Add active class to current progress dot
        const sectionIndex = ['home', 'technology', 'innovation', 'lifestyle', 'about', 'contact'].indexOf(entry.target.id);
        if (sectionIndex !== -1 && progressDots[sectionIndex]) {
          progressDots[sectionIndex].classList.add('active');
        }
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-20% 0px -70% 0px'
  });
  
  sections.forEach(section => observer.observe(section));
  
  // Add navbar background on scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(27, 39, 53, 0.9)';
      navbar.style.backdropFilter = 'blur(20px)';
    } else {
      navbar.style.background = 'transparent';
      navbar.style.backdropFilter = 'none';
    }
  });
  
  // Generate realistic star patterns with brightness variations
  function generateStars(count) {
    let shadows = [];
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * window.innerWidth * 1.5); // Ensure full width coverage
      const y = Math.floor(Math.random() * 2000);
      
      // Create brightness variations - some stars shine brighter, some dimmer
      const brightness = Math.random();
      let color;
      
      if (brightness > 0.8) {
        color = '#FFF'; // Brightest stars - pure white
      } else if (brightness > 0.6) {
        color = '#E8E8E8'; // Bright stars - light gray
      } else if (brightness > 0.4) {
        color = '#D0D0D0'; // Medium stars - medium gray
      } else if (brightness > 0.2) {
        color = '#B8B8B8'; // Dim stars - darker gray
      } else {
        color = '#A0A0A0'; // Dimmest stars - very dark gray
      }
      
      shadows.push(`${x}px ${y}px ${color}`);
    }
    return shadows.join(', ');
  }
  
  // Apply generated star patterns
  const stars1 = document.getElementById('stars');
  const stars2 = document.getElementById('stars2');
  const stars3 = document.getElementById('stars3');
  
  function applyStarPatterns() {
    if (stars1) {
      const smallStars = generateStars(700);
      stars1.style.boxShadow = smallStars;
    }
    
    if (stars2) {
      const mediumStars = generateStars(200);
      stars2.style.boxShadow = mediumStars;
    }
    
    if (stars3) {
      const largeStars = generateStars(100);
      stars3.style.boxShadow = largeStars;
    }
  }
  
  // Apply initial star patterns
  applyStarPatterns();
  
  // Regenerate stars on window resize to maintain coverage
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      applyStarPatterns();
    }, 300);
  });
  
  const heroSection = document.getElementById('home');
  
  // Start animation immediately when page loads
  setTimeout(() => {
    if (stars1) stars1.classList.add('animate');
    if (stars2) stars2.classList.add('animate');
    if (stars3) stars3.classList.add('animate');
  }, 500); // Small delay for dramatic effect
  
  // Also trigger when hero section comes into view (for when scrolling back)
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (stars1) stars1.classList.add('animate');
        if (stars2) stars2.classList.add('animate');
        if (stars3) stars3.classList.add('animate');
      }
    });
  }, {
    threshold: 0.1
  });
  
  if (heroSection) {
    heroObserver.observe(heroSection);
  }
  
  // Scroll animation system
  const scrollIndicator = document.getElementById('scrollIndicator');
  const animatedSections = document.querySelectorAll('.section-animate');
  
  // Intersection Observer for section animations
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });
  
  // Observe all animated sections
  animatedSections.forEach(section => {
    sectionObserver.observe(section);
  });
  
  // Hide scroll indicator when scrolling starts
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      scrollIndicator.classList.add('hidden');
    } else {
      scrollIndicator.classList.remove('hidden');
    }
    
    // Clear existing timeout
    clearTimeout(scrollTimeout);
    
    // Set new timeout to show indicator after scroll stops
    scrollTimeout = setTimeout(() => {
      if (scrollTop <= 100) {
        scrollIndicator.classList.remove('hidden');
      }
    }, 1000);
  });
  
  // Add smooth scroll behavior to all sections
  function addSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
  
  // Initialize smooth scrolling
  addSmoothScrolling();
  
  // Enhanced wheel scroll for smoother transitions
  let isScrolling = false;
  window.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    
    const currentSection = getCurrentSection();
    const sections = ['home', 'technology', 'innovation', 'lifestyle', 'about', 'contact'];
    const currentIndex = sections.indexOf(currentSection);
    
    if (Math.abs(e.deltaY) > 50) { // Only respond to significant scroll
      isScrolling = true;
      
      if (e.deltaY > 0 && currentIndex < sections.length - 1) {
        // Scroll down
        scrollToSection(sections[currentIndex + 1]);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        // Scroll up
        scrollToSection(sections[currentIndex - 1]);
      }
      
      setTimeout(() => {
        isScrolling = false;
      }, 1000);
    }
  }, { passive: true });
  
  // Get current section based on scroll position
  function getCurrentSection() {
    const sections = ['home', 'technology', 'innovation', 'lifestyle', 'about', 'contact'];
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    
    for (let i = 0; i < sections.length; i++) {
      const element = document.getElementById(sections[i]);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
          return sections[i];
        }
      }
    }
    return 'home';
  }
  
  // Enhanced form functionality
  const contactForm = document.getElementById('contactForm');
  const newsletterForm = document.getElementById('newsletterForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const subject = formData.get('subject');
      const message = formData.get('message');
      
      // Simulate form submission with success message
      const submitBtn = contactForm.querySelector('.submit-btn');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = '<span>Sending...</span>';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.innerHTML = '<span>Message Sent! ✨</span>';
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          contactForm.reset();
        }, 2000);
      }, 1500);
      
      // Show success notification
      showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours!', 'success');
    });
  }
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = newsletterForm.querySelector('input[type="email"]').value;
      const submitBtn = newsletterForm.querySelector('button');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Subscribing...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.textContent = 'Subscribed! ✨';
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          newsletterForm.reset();
        }, 2000);
      }, 1000);
      
      showNotification('Welcome to FutureTech! You\'ve successfully subscribed to our newsletter.', 'success');
    });
  }
  
  // Animated counter for statistics
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target'));
          const current = parseInt(counter.textContent) || 0;
          
          if (current < target) {
            const increment = target / 100;
            const timer = setInterval(() => {
              const value = parseInt(counter.textContent) + increment;
              if (value >= target) {
                counter.textContent = target.toLocaleString();
                clearInterval(timer);
              } else {
                counter.textContent = Math.floor(value).toLocaleString();
              }
            }, 20);
          }
          
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
  }
  
  // Initialize counter animation
  animateCounters();
  
  // Notification system
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${type === 'success' ? '✅' : 'ℹ️'}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close">×</button>
      </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.95), rgba(118, 75, 162, 0.95));
      color: white;
      padding: 20px;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      z-index: 10000;
      max-width: 400px;
      transform: translateX(450px);
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Slide in animation
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      margin-left: 15px;
      opacity: 0.7;
      transition: opacity 0.3s ease;
    `;
    
    closeBtn.addEventListener('click', () => {
      notification.style.transform = 'translateX(450px)';
      setTimeout(() => notification.remove(), 300);
    });
    
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.opacity = '1';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.opacity = '0.7';
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = 'translateX(450px)';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }
  

});