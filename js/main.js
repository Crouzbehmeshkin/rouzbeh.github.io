/**
 * Personal Website - Main JavaScript
 * Handles theme toggling, expandable cards, and mini-map navigation
 */

// ============================================
// THEME MANAGEMENT
// ============================================
const ThemeManager = {
  init() {
    this.toggleBtn = document.querySelector(".theme-toggle");
    this.body = document.body;
    
    if (!this.toggleBtn) return;
    
    this.loadTheme();
    this.attachListeners();
  },
  
  loadTheme() {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const theme = storedTheme || (prefersDark ? "theme-dark" : "theme-slate");
    this.body.className = theme;
  },
  
  attachListeners() {
    this.toggleBtn.addEventListener("click", () => this.toggle());
    
    // Also listen to system theme changes
    window.matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
          this.body.className = e.matches ? "theme-dark" : "theme-slate";
        }
      });
  },
  
  toggle() {
    const current = this.body.className;
    const next = current === "theme-dark" ? "theme-slate" : "theme-dark";
    
    this.body.className = next;
    localStorage.setItem("theme", next);
  }
};


// ============================================
// EXPANDABLE CARDS
// ============================================
const ExpandableCards = {
  init() {
    this.buttons = document.querySelectorAll('.expand-btn');
    this.attachListeners();
  },
  
  attachListeners() {
    this.buttons.forEach(button => {
      button.addEventListener('click', (e) => this.toggle(e.currentTarget));
    });
  },
  
  toggle(button) {
    const card = button.closest('.card');
    if (!card) return;
    
    const description = card.querySelector('.card-description');
    const media = card.querySelector('.card-media');
    const textElement = button.querySelector('.expand-text');
    
    // Toggle expanded state
    const isExpanded = description.classList.toggle('expanded');
    button.classList.toggle('expanded');
    
    if (media) {
      media.classList.toggle('expanded');
    }
    
    // Update button text and aria-label
    textElement.textContent = isExpanded ? 'Collapse' : 'Expand';
    button.setAttribute(
      'aria-label', 
      isExpanded ? 'Collapse description' : 'Expand description'
    );
    
    // Smooth scroll to keep card in view if needed
    if (isExpanded && this.isPartiallyOffScreen(card)) {
      setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  },
  
  isPartiallyOffScreen(element) {
    const rect = element.getBoundingClientRect();
    return rect.bottom > window.innerHeight;
  }
};


// ============================================
// MINI-MAP NAVIGATION
// ============================================
const MiniMap = {
  init() {
    this.items = document.querySelectorAll('.mini-map-item');
    this.sections = [];
    
    // Get all sections
    this.items.forEach(item => {
      const targetId = item.dataset.target;
      const section = document.getElementById(targetId);
      if (section) {
        this.sections.push({ element: section, item, id: targetId });
      }
    });
    
    if (this.sections.length === 0) return;
    
    this.attachListeners();
    this.updateActiveSection();
  },
  
  attachListeners() {
    // Click navigation
    this.items.forEach(item => {
      item.addEventListener('click', () => {
        const targetId = item.dataset.target;
        const section = document.getElementById(targetId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
    
    // Scroll detection with throttle
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    });
  },
  
  updateActiveSection() {
    const scrollPosition = window.scrollY + window.innerHeight / 3;
    
    // Find the current section
    let currentSection = null;
    
    for (const section of this.sections) {
      const rect = section.element.getBoundingClientRect();
      const absoluteTop = window.scrollY + rect.top;
      
      if (scrollPosition >= absoluteTop) {
        currentSection = section;
      }
    }
    
    // Update active states
    this.items.forEach(item => item.classList.remove('active'));
    if (currentSection) {
      currentSection.item.classList.add('active');
    } else if (this.sections.length > 0) {
      // Default to first section if at top
      this.sections[0].item.classList.add('active');
    }
  }
};


// ============================================
// SMOOTH ANCHOR SCROLLING (Enhanced)
// ============================================
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        
        // Ignore empty hash
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // Update URL without jumping
          history.pushState(null, '', href);
        }
      });
    });
  }
};


// ============================================
// LAZY LOAD IMAGES (Not in use currently)
// ============================================
const LazyImages = {
  init() {
    if ('IntersectionObserver' in window) {
      const images = document.querySelectorAll('img[data-src]');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      });
      
      images.forEach(img => observer.observe(img));
    }
  }
};


// ============================================
// INITIALIZE ON DOM READY
// ============================================
const App = {
  init() {
    ThemeManager.init();
    ExpandableCards.init();
    SmoothScroll.init();
    MiniMap.init();
    // LazyImages.init(); // Uncomment if using lazy loading
    
    // Add loaded class for CSS animations
    document.body.classList.add('loaded');
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}