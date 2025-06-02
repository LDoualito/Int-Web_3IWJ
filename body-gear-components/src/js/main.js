/**
 * MAIN JAVASCRIPT - BODY GEAR COMPONENTS
 * Point d'entrée principal pour toutes les fonctionnalités
 * Musculation Old School Authentique 💪
 */

// ============================================================================
// IMPORTS ET CONFIGURATION
// ============================================================================

import { ThemeToggle } from './theme-toggle.js';
import { Modal } from './components/modal.js';
import { Accordion } from './components/accordion.js';

// ============================================================================
// CLASSES PRINCIPALES
// ============================================================================

/**
 * Gestionnaire principal de l'application Body Gear
 */
class BodyGearApp {
  constructor() {
    this.isInitialized = false;
    this.components = new Map();
    
    // Configuration globale
    this.config = {
      breakpoints: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280
      },
      animations: {
        duration: 250,
        easing: 'ease-in-out'
      }
    };
    
    this.init();
  }
  
  /**
   * Initialisation de l'application
   */
  init() {
    if (this.isInitialized) return;
    
    console.log('🏋️ Body Gear - Initialisation...');
    
    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }
  
  /**
   * Configuration principale après chargement du DOM
   */
  setup() {
    try {
      // 1. Initialiser le thème
      this.initTheme();
      
      // 2. Initialiser la navigation
      this.initNavigation();
      
      // 3. Initialiser les formulaires
      this.initForms();
      
      // 4. Initialiser les composants
      this.initComponents();
      
      // 5. Initialiser les animations
      this.initAnimations();
      
      // 6. Initialiser les événements globaux
      this.initGlobalEvents();
      
      this.isInitialized = true;
      console.log('✅ Body Gear - Prêt à forger des corps !');
      
      // Événement personnalisé pour notifier l'initialisation
      document.dispatchEvent(new CustomEvent('bodygear:ready'));
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation:', error);
    }
  }
  
  /**
   * Initialisation du système de thèmes
   */
  initTheme() {
    const themeToggle = new ThemeToggle();
    this.components.set('themeToggle', themeToggle);
  }
  
  /**
   * Initialisation de la navigation
   */
  initNavigation() {
    // Navigation mobile hamburger
    const hamburger = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    
    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        const isOpen = navMenu.classList.contains('nav__menu--open');
        
        if (isOpen) {
          this.closeNavigation();
        } else {
          this.openNavigation();
        }
      });
      
      // Fermer la navigation en cliquant à l'extérieur
      document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
          this.closeNavigation();
        }
      });
      
      // Fermer la navigation avec Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeNavigation();
        }
      });
    }
    
    // Header scroll effect
    this.initHeaderScroll();
    
    // Smooth scroll pour les liens ancres
    this.initSmoothScroll();
  }
  
  /**
   * Ouvrir la navigation mobile
   */
  openNavigation() {
    const hamburger = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    
    if (hamburger && navMenu) {
      navMenu.classList.add('nav__menu--open');
      hamburger.classList.add('nav__toggle--active');
      hamburger.setAttribute('aria-expanded', 'true');
      
      // Prévenir le scroll du body
      document.body.style.overflow = 'hidden';
      
      // Focus sur le premier lien
      const firstLink = navMenu.querySelector('.nav__link');
      if (firstLink) {
        firstLink.focus();
      }
    }
  }
  
  /**
   * Fermer la navigation mobile
   */
  closeNavigation() {
    const hamburger = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    
    if (hamburger && navMenu) {
      navMenu.classList.remove('nav__menu--open');
      hamburger.classList.remove('nav__toggle--active');
      hamburger.setAttribute('aria-expanded', 'false');
      
      // Restaurer le scroll du body
      document.body.style.overflow = '';
    }
  }
  
  /**
   * Effet de header au scroll
   */
  initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    let isScrollingDown = false;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      isScrollingDown = currentScrollY > lastScrollY;
      
      // Ajouter/supprimer la classe selon le scroll
      if (currentScrollY > 100) {
        header.classList.add('header--scrolled');
        
        if (isScrollingDown && currentScrollY > 200) {
          header.classList.add('header--hidden');
        } else {
          header.classList.remove('header--hidden');
        }
      } else {
        header.classList.remove('header--scrolled', 'header--hidden');
      }
      
      lastScrollY = currentScrollY;
    };
    
    // Throttle pour optimiser les performances
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', scrollListener, { passive: true });
  }
  
  /**
   * Smooth scroll pour les liens ancres
   */
  initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          
          // Fermer la navigation mobile si ouverte
          this.closeNavigation();
          
          // Scroll vers la cible
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const targetPosition = target.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Mettre à jour l'URL
          history.pushState(null, null, href);
        }
      });
    });
  }
  
  /**
   * Initialisation des formulaires
   */
  initForms() {
    const forms = document.querySelectorAll('.form');
    
    forms.forEach(form => {
      this.setupFormValidation(form);
      this.setupFormInteractions(form);
    });
  }
  
  /**
   * Configuration de la validation de formulaire
   */
  setupFormValidation(form) {
    const inputs = form.querySelectorAll('.form__input, .form__textarea, .form__select');
    
    inputs.forEach(input => {
      // Validation en temps réel
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
      
      // Validation spéciale pour email
      if (input.type === 'email') {
        input.addEventListener('input', () => this.validateEmail(input));
      }
      
      // Validation spéciale pour téléphone
      if (input.type === 'tel') {
        input.addEventListener('input', () => this.validatePhone(input));
      }
    });
    
    // Validation à la soumission
    form.addEventListener('submit', (e) => this.handleFormSubmit(e));
  }
  
  /**
   * Configuration des interactions de formulaire
   */
  setupFormInteractions(form) {
    // Gestion des choix avec cartes
    const choiceCards = form.querySelectorAll('.form__choice-card');
    choiceCards.forEach(card => {
      card.addEventListener('click', () => {
        const input = card.querySelector('input[type="radio"], input[type="checkbox"]');
        if (input) {
          if (input.type === 'radio') {
            // Déselectionner les autres cartes du même groupe
            const name = input.name;
            const otherCards = form.querySelectorAll(`input[name="${name}"]`);
            otherCards.forEach(otherInput => {
              otherInput.closest('.form__choice-card')?.classList.remove('form__choice-card--selected');
            });
          }
          
          input.checked = !input.checked;
          card.classList.toggle('form__choice-card--selected', input.checked);
        }
      });
    });
    
    // Compteur de caractères
    const textareas = form.querySelectorAll('.form__textarea[maxlength]');
    textareas.forEach(textarea => {
      this.setupCharacterCounter(textarea);
    });
  }
  
  /**
   * Validation d'un champ
   */
  validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    const fieldGroup = field.closest('.form__group');
    
    // Nettoyer les erreurs existantes
    this.clearFieldError(field);
    
    // Vérifier si le champ est requis et vide
    if (isRequired && !value) {
      this.showFieldError(field, 'Ce champ est obligatoire');
      return false;
    }
    
    // Validation spécifique selon le type
    if (value) {
      switch (field.type) {
        case 'email':
          return this.validateEmail(field);
        case 'tel':
          return this.validatePhone(field);
        default:
          break;
      }
    }
    
    // Si tout va bien, montrer le succès
    this.showFieldSuccess(field);
    return true;
  }
  
  /**
   * Validation email
   */
  validateEmail(field) {
    const email = field.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
      this.showFieldError(field, 'Veuillez entrer un email valide');
      return false;
    }
    
    if (email) {
      this.showFieldSuccess(field);
    }
    return true;
  }
  
  /**
   * Validation téléphone
   */
  validatePhone(field) {
    const phone = field.value.trim();
    const phoneRegex = /^(?:(?:\+33|0)[1-9](?:[0-9]{8}))$/;
    
    if (phone && !phoneRegex.test(phone.replace(/\s/g, ''))) {
      this.showFieldError(field, 'Veuillez entrer un numéro de téléphone valide');
      return false;
    }
    
    if (phone) {
      this.showFieldSuccess(field);
    }
    return true;
  }
  
  /**
   * Afficher une erreur sur un champ
   */
  showFieldError(field, message) {
    field.classList.add('form__input--error');
    field.classList.remove('form__input--valid');
    
    const fieldGroup = field.closest('.form__group');
    if (fieldGroup) {
      let errorElement = fieldGroup.querySelector('.form__error');
      if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'form__error form__feedback form__feedback--visible';
        field.parentNode.appendChild(errorElement);
      }
      errorElement.textContent = message;
      errorElement.classList.add('form__feedback--visible');
    }
    
    // Animation de shake
    field.classList.add('form__input--shake');
    setTimeout(() => field.classList.remove('form__input--shake'), 500);
  }
  
  /**
   * Afficher le succès sur un champ
   */
  showFieldSuccess(field) {
    field.classList.add('form__input--valid');
    field.classList.remove('form__input--error');
    
    const fieldGroup = field.closest('.form__group');
    if (fieldGroup) {
      const errorElement = fieldGroup.querySelector('.form__error');
      if (errorElement) {
        errorElement.classList.remove('form__feedback--visible');
      }
    }
  }
  
  /**
   * Nettoyer les erreurs d'un champ
   */
  clearFieldError(field) {
    field.classList.remove('form__input--error', 'form__input--valid');
    
    const fieldGroup = field.closest('.form__group');
    if (fieldGroup) {
      const errorElement = fieldGroup.querySelector('.form__error');
      if (errorElement) {
        errorElement.classList.remove('form__feedback--visible');
      }
    }
  }
  
  /**
   * Gestion de la soumission de formulaire
   */
  handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const inputs = form.querySelectorAll('.form__input, .form__textarea, .form__select');
    let isValid = true;
    
    // Valider tous les champs
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    // Vérifier les champs obligatoires spéciaux (checkboxes)
    const requiredCheckboxes = form.querySelectorAll('input[type="checkbox"][required]');
    requiredCheckboxes.forEach(checkbox => {
      if (!checkbox.checked) {
        this.showFieldError(checkbox, 'Vous devez accepter ces conditions');
        isValid = false;
      }
    });
    
    if (isValid) {
      this.submitForm(form);
    } else {
      // Scroll vers la première erreur
      const firstError = form.querySelector('.form__input--error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
    }
  }
  
  /**
   * Soumission du formulaire
   */
  async submitForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton?.textContent;
    
    try {
      // État de chargement
      if (submitButton) {
        submitButton.classList.add('btn--loading');
        submitButton.disabled = true;
      }
      
      // Simuler l'envoi (à remplacer par votre logique)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Succès
      this.showFormSuccess(form);
      
    } catch (error) {
      this.showFormError(form, 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      // Restaurer le bouton
      if (submitButton) {
        submitButton.classList.remove('btn--loading');
        submitButton.disabled = false;
      }
    }
  }
  
  /**
   * Afficher le succès du formulaire
   */
  showFormSuccess(form) {
    // Créer le message de succès
    const successMessage = document.createElement('div');
    successMessage.className = 'alert alert--success animate-fadeIn';
    successMessage.innerHTML = `
      <div class="alert__icon">✅</div>
      <div class="alert__content">
        <h4 class="alert__title">Inscription réussie !</h4>
        <p class="alert__message">Bienvenue chez Body Gear ! Préparez-vous à forger votre corps 💪</p>
      </div>
    `;
    
    // Insérer avant le formulaire
    form.parentNode.insertBefore(successMessage, form);
    
    // Masquer le formulaire
    form.style.display = 'none';
    
    // Scroll vers le message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  
  /**
   * Afficher une erreur du formulaire
   */
  showFormError(form, message) {
    // Supprimer les erreurs existantes
    const existingError = form.parentNode.querySelector('.alert--error');
    if (existingError) {
      existingError.remove();
    }
    
    // Créer le message d'erreur
    const errorMessage = document.createElement('div');
    errorMessage.className = 'alert alert--error animate-fadeIn';
    errorMessage.innerHTML = `
      <div class="alert__icon">❌</div>
      <div class="alert__content">
        <h4 class="alert__title">Erreur</h4>
        <p class="alert__message">${message}</p>
      </div>
    `;
    
    // Insérer avant le formulaire
    form.parentNode.insertBefore(errorMessage, form);
    
    // Supprimer automatiquement après 5 secondes
    setTimeout(() => {
      errorMessage.remove();
    }, 5000);
  }
  
  /**
   * Configuration du compteur de caractères
   */
  setupCharacterCounter(textarea) {
    const maxLength = parseInt(textarea.getAttribute('maxlength'));
    const fieldGroup = textarea.closest('.form__group');
    
    // Créer le compteur
    const counter = document.createElement('div');
    counter.className = 'form__counter';
    fieldGroup.appendChild(counter);
    
    const updateCounter = () => {
      const currentLength = textarea.value.length;
      const remaining = maxLength - currentLength;
      
      counter.textContent = `${currentLength}/${maxLength}`;
      
      // Changer la couleur selon le pourcentage
      counter.classList.remove('form__counter--warning', 'form__counter--error');
      
      if (remaining < maxLength * 0.1) {
        counter.classList.add('form__counter--error');
      } else if (remaining < maxLength * 0.2) {
        counter.classList.add('form__counter--warning');
      }
    };
    
    textarea.addEventListener('input', updateCounter);
    updateCounter(); // Initialiser
  }
  
  /**
   * Initialisation des composants
   */
  initComponents() {
    // Modales
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      const modalInstance = new Modal(modal);
      this.components.set(`modal-${modal.id}`, modalInstance);
    });
    
    // Accordéons
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach(accordion => {
      const accordionInstance = new Accordion(accordion);
      this.components.set(`accordion-${accordion.id || Math.random()}`, accordionInstance);
    });
  }
  
  /**
   * Initialisation des animations
   */
  initAnimations() {
    // Observer pour les animations d'entrée
    if ('IntersectionObserver' in window) {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);
      
      // Observer les cartes et sections
      const animateElements = document.querySelectorAll('.card, .section, .box');
      animateElements.forEach(el => observer.observe(el));
    }
  }
  
  /**
   * Initialisation des événements globaux
   */
  initGlobalEvents() {
    // Gestion du resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
    
    // Gestion des erreurs JavaScript
    window.addEventListener('error', (e) => {
      console.error('Body Gear Error:', e.error);
    });
    
    // Amélioration de l'accessibilité
    this.initAccessibility();
  }
  
  /**
   * Gestion du redimensionnement
   */
  handleResize() {
    // Fermer la navigation mobile si on passe en desktop
    if (window.innerWidth >= this.config.breakpoints.lg) {
      this.closeNavigation();
    }
    
    // Ajuster la hauteur des éléments si nécessaire
    this.adjustViewportHeight();
  }
  
  /**
   * Ajuster la hauteur de viewport pour mobile
   */
  adjustViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  /**
   * Améliorations d'accessibilité
   */
  initAccessibility() {
    // Navigation au clavier pour les cartes cliquables
    const clickableCards = document.querySelectorAll('.card--clickable, .form__choice-card');
    clickableCards.forEach(card => {
      if (!card.hasAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
      }
      
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
    
    // Skip links
    this.addSkipLinks();
  }
  
  /**
   * Ajouter des liens d'évitement
   */
  addSkipLinks() {
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links sr-only';
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Aller au contenu principal</a>
      <a href="#main-navigation" class="skip-link">Aller à la navigation</a>
    `;
    
    document.body.insertAdjacentElement('afterbegin', skipLinks);
  }
  
  /**
   * Méthodes utilitaires publiques
   */
  
  /**
   * Obtenir un composant par son ID
   */
  getComponent(id) {
    return this.components.get(id);
  }
  
  /**
   * Obtenir la configuration
   */
  getConfig() {
    return { ...this.config };
  }
  
  /**
   * Vérifier si l'application est initialisée
   */
  isReady() {
    return this.isInitialized;
  }
}

// ============================================================================
// INITIALISATION GLOBALE
// ============================================================================

// Créer l'instance globale
window.BodyGear = new BodyGearApp();

// Export pour les modules
export default BodyGearApp;