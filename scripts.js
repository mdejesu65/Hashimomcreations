// scripts.js - Main functionality

// Current language state
let currentLang = 'en';

// Translation function
function translatePage(lang) {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });
  
  // Update HTML lang attribute
  document.documentElement.lang = lang;
  
  // Save language preference
  localStorage.setItem('preferredLanguage', lang);
}

// Scroll animation observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  
  // Set up scroll animations
  const animatedElements = document.querySelectorAll('.about-section, .features, .testimonials, .services, .freebie, .work, .coming-soon, .contact, .cta-section');
  animatedElements.forEach(el => {
    el.classList.add('scroll-animate');
    observer.observe(el);
  });
  
  // Language switcher setup
  const langSwitcher = document.getElementById('language');
  if (langSwitcher) {
    // Check for saved language preference or browser language
    const savedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.substring(0, 2);
    
    // Determine which language to use
    if (savedLang && ['en', 'es'].includes(savedLang)) {
      currentLang = savedLang;
    } else if (browserLang === 'es') {
      currentLang = 'es';
    }
    
    // Set the select value
    langSwitcher.value = currentLang;
    
    // Add change event listener
    langSwitcher.addEventListener('change', (e) => {
      currentLang = e.target.value;
      translatePage(currentLang);
    });
  }
  
  // Initial translation
  translatePage(currentLang);
  
  // Cookie banner logic
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookies = document.getElementById('accept-cookies');
  
  if (cookieBanner && acceptCookies) {
    // Check if consent already given
    const consentGiven = localStorage.getItem('cookieConsent');
    
    if (!consentGiven) {
      // Remove hidden class first
      cookieBanner.classList.remove('hidden');
      
      // Show banner with animation after a delay
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 2000);
    } else {
      // Keep banner hidden if consent was already given
      cookieBanner.classList.add('hidden');
    }
    
    // Handle accept button click
    acceptCookies.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('show');
      
      // Hide completely after animation
      setTimeout(() => {
        cookieBanner.classList.add('hidden');
      }, 500);
    });
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        const headerOffset = 80; // Account for fixed elements
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Parallax effect for hero section
  let ticking = false;
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero && scrolled < hero.offsetHeight) {
      hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick);
  
  // Dynamic year in footer
  const updateFooterYear = () => {
    const year = new Date().getFullYear();
    const footerElements = document.querySelectorAll('[data-i18n="footer_legal"]');
    
    footerElements.forEach(el => {
      const currentText = el.innerHTML;
      if (!currentText.includes(year.toString())) {
        el.innerHTML = currentText.replace(/\d{4}/, year.toString());
      }
    });
  };
  
  // Update year after initial translation
  setTimeout(updateFooterYear, 100);
  
  // Add hover effect to feature cards
  const featureCards = document.querySelectorAll('.feature, .card, .testimonial');
  featureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  });
  
  // Form handling for email links (optional enhancement)
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Track email click (you can add analytics here)
      console.log('Email link clicked');
    });
  });
  
  // Download tracking for PDF
  const downloadLinks = document.querySelectorAll('a[download]');
  downloadLinks.forEach(link => {
    link.addEventListener('click', function() {
      console.log('Download initiated:', this.getAttribute('href'));
      
      // Optional: Show thank you message
      const message = currentLang === 'es' 
        ? '¡Gracias por descargar! Revisa tu carpeta de descargas.'
        : 'Thank you for downloading! Check your downloads folder.';
      
      // Create temporary notification
      const notification = document.createElement('div');
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ff70a6, #D6C7F7);
        color: white;
        padding: 15px 30px;
        border-radius: 30px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInUp 0.5s ease;
      `;
      
      document.body.appendChild(notification);
      
      // Remove notification after 4 seconds
      setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 500);
      }, 4000);
    });
  });
  
  // Add loading state for images
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    // Add loading class
    img.classList.add('loading');
    
    // Remove loading class when image loads
    img.addEventListener('load', function() {
      this.classList.remove('loading');
    });
    
    // Handle error state
    img.addEventListener('error', function() {
      this.classList.remove('loading');
      this.classList.add('error');
      
      // Optionally set a fallback image
      if (this.classList.contains('logo')) {
        this.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.innerHTML = '💜';
        placeholder.style.cssText = `
          width: 140px;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 60px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        `;
        this.parentNode.insertBefore(placeholder, this);
      }
    });
  });
  
  // Performance optimization: Lazy load images below the fold
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    lazyImages.forEach(img => {
      img.loading = 'lazy';
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }
  
});

// Add CSS for loading states dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translate(-50%, 100%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  
  img.loading {
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  img:not(.loading) {
    opacity: 1;
  }
  
  img.error {
    display: none;
  }
`;
document.head.appendChild(style);

// Console welcome message
console.log('%c Welcome to HashiMomCreations! 💜', 'font-size: 20px; color: #ff70a6; font-weight: bold;');
console.log('%c Built with love by GrowEasy Digital', 'font-size: 14px; color: #7F5A8A;');