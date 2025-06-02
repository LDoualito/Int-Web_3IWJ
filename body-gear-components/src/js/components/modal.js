/**
 * MODAL COMPONENT - BODY GEAR
 * Gestionnaire de modales avec accessibilité
 */

export class Modal {
  constructor(element) {
    this.modal = element;
    this.backdrop = this.modal.querySelector('.modal__backdrop');
    this.dialog = this.modal.querySelector('.modal__dialog');
    this.closeButtons = this.modal.querySelectorAll('.modal__close, [data-dismiss="modal"]');
    
    this.isOpen = false;
    this.focusableElements = [];
    this.previousFocus = null;
    
    this.init();
  }
  
  init() {
    // Événements de fermeture
    this.closeButtons.forEach(button => {
      button.addEventListener('click', () => this.close());
    });
    
    // Fermer en cliquant sur le backdrop
    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => this.close());
    }
    
    // Fermer avec Escape
    this.modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
    
    // Gestion du focus
    this.modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && this.isOpen) {
        this.handleTabKey(e);
      }
    });
  }
  
  open() {
    if (this.isOpen) return;
    
    // Sauvegarder le focus actuel
    this.previousFocus = document.activeElement;
    
    // Empêcher le scroll du body
    document.body.style.overflow = 'hidden';
    
    // Afficher la modale
    this.modal.classList.add('modal--visible');
    this.isOpen = true;
    
    // Focus sur la modale
    this.setInitialFocus();
    
    // Événement personnalisé
    this.modal.dispatchEvent(new CustomEvent('modal:opened'));
  }
  
  close() {
    if (!this.isOpen) return;
    
    // Restaurer le scroll du body
    document.body.style.overflow = '';
    
    // Masquer la modale
    this.modal.classList.remove('modal--visible');
    this.isOpen = false;
    
    // Restaurer le focus
    if (this.previousFocus) {
      this.previousFocus.focus();
    }
    
    // Événement personnalisé
    this.modal.dispatchEvent(new CustomEvent('modal:closed'));
  }
  
  setInitialFocus() {
    this.updateFocusableElements();
    
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    } else {
      this.dialog.focus();
    }
  }
  
  updateFocusableElements() {
    const selectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ];
    
    this.focusableElements = Array.from(
      this.dialog.querySelectorAll(selectors.join(','))
    );
  }
  
  handleTabKey(e) {
    this.updateFocusableElements();
    
    if (this.focusableElements.length === 0) return;
    
    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];
    
    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
  
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  
  isVisible() {
    return this.isOpen;
  }
}

export default Modal;