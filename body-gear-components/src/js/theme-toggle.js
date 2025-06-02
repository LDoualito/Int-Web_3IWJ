/**
 * THEME TOGGLE - BODY GEAR COMPONENTS
 * Gestionnaire de thème sombre/clair avec persistance
 * Old School Day/Night Mode 🌙☀️
 */

export class ThemeToggle {
  constructor() {
    this.storageKey = 'bodygear-theme';
    this.themes = {
      LIGHT: 'light',
      DARK: 'dark',
      AUTO: 'auto'
    };
    
    this.currentTheme = null;
    this.toggleButtons = [];
    this.mediaQuery = null;
    
    this.init();
  }
  
  /**
   * Initialisation du gestionnaire de thème
   */
  init() {
    console.log('🌙 Initialisation du gestionnaire de thème...');
    
    // Détecter la préférence système
    this.setupMediaQuery();
    
    // Charger le thème sauvegardé ou détecter automatiquement
    this.loadTheme();
    
    // Initialiser les boutons de basculement
    this.initToggleButtons();
    
    // Appliquer le thème initial
    this.applyTheme();
    
    console.log(`✅ Thème initialisé: ${this.currentTheme}`);
  }
  
  /**
   * Configuration de la détection de préférence système
   */
  setupMediaQuery() {
    if (window.matchMedia) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Écouter les changements de préférence système
      this.mediaQuery.addEventListener('change', (e) => {
        if (this.currentTheme === this.themes.AUTO) {
          this.applyTheme();
          this.notifyThemeChange();
        }
      });
    }
  }
  
  /**
   * Charger le thème depuis le localStorage ou détecter automatiquement
   */
  loadTheme() {
    const savedTheme = localStorage.getItem(this.storageKey);
    
    if (savedTheme && Object.values(this.themes).includes(savedTheme)) {
      this.currentTheme = savedTheme;
    } else {
      // Par défaut, suivre la préférence système
      this.currentTheme = this.themes.AUTO;
    }
  }
  
  /**
   * Sauvegarder le thème dans le localStorage
   */
  saveTheme() {
    try {
      localStorage.setItem(this.storageKey, this.currentTheme);
    } catch (error) {
      console.warn('Impossible de sauvegarder le thème:', error);
    }
  }
  
  /**
   * Déterminer le thème effectif à appliquer
   */
  getEffectiveTheme() {
    if (this.currentTheme === this.themes.AUTO) {
      // Suivre la préférence système
      return this.mediaQuery?.matches ? this.themes.DARK : this.themes.LIGHT;
    }
    
    return this.currentTheme;
  }
  
  /**
   * Appliquer le thème au document
   */
  applyTheme() {
    const effectiveTheme = this.getEffectiveTheme();
    const html = document.documentElement;
    
    // Supprimer tous les attributs de thème existants
    html.removeAttribute('data-theme');
    
    // Appliquer le nouveau thème
    if (effectiveTheme === this.themes.DARK) {
      html.setAttribute('data-theme', 'dark');
    }
    // Le thème clair est le défaut (pas d'attribut)
    
    // Mettre à jour les boutons
    this.updateToggleButtons();
    
    // Transition smooth
    this.addThemeTransition();
    
    console.log(`🎨 Thème appliqué: ${effectiveTheme} (configuré: ${this.currentTheme})`);
  }
  
  /**
   * Ajouter une transition temporaire pour le changement de thème
   */
  addThemeTransition() {
    const css = document.createElement('style');
    css.textContent = `
      *, *::before, *::after {
        transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease !important;
      }
    `;
    
    document.head.appendChild(css);
    
    // Supprimer après la transition
    setTimeout(() => {
      document.head.removeChild(css);
    }, 300);
  }
  
  /**
   * Initialiser les boutons de basculement
   */
  initToggleButtons() {
    // Sélecteurs possibles pour les boutons de thème
    const selectors = [
      '.theme-toggle',
      '.btn--theme-toggle',
      '[data-theme-toggle]',
      '.js-theme-toggle'
    ];
    
    selectors.forEach(selector => {
      const buttons = document.querySelectorAll(selector);
      buttons.forEach(button => this.setupToggleButton(button));
    });
    
    // Créer un bouton par défaut s'il n'y en a pas
    if (this.toggleButtons.length === 0) {
      this.createDefaultToggleButton();
    }
  }
  
  /**
   * Configurer un bouton de basculement
   */
  setupToggleButton(button) {
    if (this.toggleButtons.includes(button)) return;
    
    this.toggleButtons.push(button);
    
    // Événement de clic
    button.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    });
    
    // Accessibilité
    button.setAttribute('role', 'button');
    button.setAttribute('aria-label', 'Basculer le thème');
    
    // Support clavier
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle();
      }
    });
    
    console.log('🔘 Bouton de thème configuré:', button);
  }
  
  /**
   * Créer un bouton de basculement par défaut
   */
  createDefaultToggleButton() {
    const header = document.querySelector('.header, .nav, header');
    if (!header) return;
    
    const button = document.createElement('button');
    button.className = 'theme-toggle btn btn--ghost btn--icon-only';
    button.setAttribute('aria-label', 'Basculer le thème sombre/clair');
    button.innerHTML = `
      <span class="btn__icon theme-toggle__icon">
        <svg class="theme-toggle__sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg class="theme-toggle__moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </span>
    `;
    
    // Ajouter des styles CSS pour les icônes
    const style = document.createElement('style');
    style.textContent = `
      .theme-toggle__icon {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      
      .theme-toggle__sun,
      .theme-toggle__moon {
        position: absolute;
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      
      /* Thème clair - montrer le soleil */
      :root .theme-toggle__sun {
        opacity: 1;
        transform: rotate(0deg) scale(1);
      }
      
      :root .theme-toggle__moon {
        opacity: 0;
        transform: rotate(90deg) scale(0.8);
      }
      
      /* Thème sombre - montrer la lune */
      [data-theme="dark"] .theme-toggle__sun {
        opacity: 0;
        transform: rotate(-90deg) scale(0.8);
      }
      
      [data-theme="dark"] .theme-toggle__moon {
        opacity: 1;
        transform: rotate(0deg) scale(1);
      }
      
      .theme-toggle:hover .theme-toggle__sun,
      .theme-toggle:hover .theme-toggle__moon {
        transform: rotate(0deg) scale(1.1);
      }
    `;
    
    document.head.appendChild(style);
    
    // Ajouter le bouton au header
    const nav = header.querySelector('.nav, .header__nav');
    if (nav) {
      nav.appendChild(button);
    } else {
      header.appendChild(button);
    }
    
    this.setupToggleButton(button);
    
    console.log('🔘 Bouton de thème par défaut créé');
  }
  
  /**
   * Mettre à jour l'apparence des boutons de basculement
   */
  updateToggleButtons() {
    const effectiveTheme = this.getEffectiveTheme();
    
    this.toggleButtons.forEach(button => {
      // Mettre à jour l'attribut aria-label
      const isDark = effectiveTheme === this.themes.DARK;
      const label = isDark 
        ? 'Passer au thème clair' 
        : 'Passer au thème sombre';
      
      button.setAttribute('aria-label', label);
      
      // Mettre à jour l'attribut data
      button.setAttribute('data-theme', effectiveTheme);
      
      // Si le bouton a du texte, le mettre à jour
      const textNode = Array.from(button.childNodes)
        .find(node => node.nodeType === Node.TEXT_NODE);
      
      if (textNode) {
        textNode.textContent = isDark ? '☀️' : '🌙';
      }
    });
  }
  
  /**
   * Basculer le thème
   */
  toggle() {
    const effectiveTheme = this.getEffectiveTheme();
    
    // Basculer entre clair et sombre
    if (effectiveTheme === this.themes.DARK) {
      this.setTheme(this.themes.LIGHT);
    } else {
      this.setTheme(this.themes.DARK);
    }
    
    console.log(`🔄 Thème basculé vers: ${this.currentTheme}`);
  }
  
  /**
   * Définir un thème spécifique
   */
  setTheme(theme) {
    if (!Object.values(this.themes).includes(theme)) {
      console.warn(`Thème invalide: ${theme}`);
      return;
    }
    
    const previousTheme = this.currentTheme;
    this.currentTheme = theme;
    
    // Sauvegarder et appliquer
    this.saveTheme();
    this.applyTheme();
    
    // Notifier le changement
    this.notifyThemeChange(previousTheme);
  }
  
  /**
   * Obtenir le thème actuel
   */
  getTheme() {
    return this.currentTheme;
  }
  
  /**
   * Obtenir le thème effectif (résolu)
   */
  getCurrentTheme() {
    return this.getEffectiveTheme();
  }
  
  /**
   * Vérifier si le thème sombre est actif
   */
  isDarkMode() {
    return this.getEffectiveTheme() === this.themes.DARK;
  }
  
  /**
   * Vérifier si le mode auto est activé
   */
  isAutoMode() {
    return this.currentTheme === this.themes.AUTO;
  }
  
  /**
   * Notifier les changements de thème
   */
  notifyThemeChange(previousTheme = null) {
    const detail = {
      theme: this.currentTheme,
      effectiveTheme: this.getEffectiveTheme(),
      previousTheme,
      isDarkMode: this.isDarkMode(),
      isAutoMode: this.isAutoMode()
    };
    
    // Événement personnalisé
    const event = new CustomEvent('bodygear:theme-changed', { detail });
    document.dispatchEvent(event);
    
    // Callback legacy pour compatibilité
    if (typeof window.onThemeChange === 'function') {
      window.onThemeChange(detail);
    }
  }
  
  /**
   * Ajouter un écouteur de changement de thème
   */
  onChange(callback) {
    if (typeof callback !== 'function') return;
    
    document.addEventListener('bodygear:theme-changed', (e) => {
      callback(e.detail);
    });
  }
  
  /**
   * Réinitialiser le thème aux valeurs par défaut
   */
  reset() {
    localStorage.removeItem(this.storageKey);
    this.currentTheme = this.themes.AUTO;
    this.applyTheme();
    this.notifyThemeChange();
    
    console.log('🔄 Thème réinitialisé');
  }
  
  /**
   * Obtenir les statistiques d'utilisation
   */
  getStats() {
    return {
      currentTheme: this.currentTheme,
      effectiveTheme: this.getEffectiveTheme(),
      isDarkMode: this.isDarkMode(),
      isAutoMode: this.isAutoMode(),
      hasSystemPreference: !!this.mediaQuery,
      systemPrefersDark: this.mediaQuery?.matches || false,
      toggleButtonsCount: this.toggleButtons.length
    };
  }
  
  /**
   * Méthode de débogage
   */
  debug() {
    console.group('🌙 Body Gear Theme Toggle Debug');
    console.log('Configuration actuelle:', this.getStats());
    console.log('Boutons de basculement:', this.toggleButtons);
    console.log('Media Query:', this.mediaQuery);
    console.groupEnd();
  }
}

// Export par défaut
export default ThemeToggle;