/**
 * ACCORDION COMPONENT - BODY GEAR
 * Gestionnaire d'accordéons avec accessibilité
 */

export class Accordion {
  constructor(element) {
    this.accordion = element;
    this.items = Array.from(this.accordion.querySelectorAll('.accordion__item'));
    this.allowMultiple = this.accordion.hasAttribute('data-allow-multiple');
    
    this.init();
  }
  
  init() {
    this.items.forEach((item, index) => {
      const header = item.querySelector('.accordion__header');
      const content = item.querySelector('.accordion__content');
      
      if (!header || !content) return;
      
      // IDs pour l'accessibilité
      const headerId = `accordion-header-${index}`;
      const contentId = `accordion-content-${index}`;
      
      header.id = headerId;
      content.id = contentId;
      
      // Attributs ARIA
      header.setAttribute('aria-expanded', 'false');
      header.setAttribute('aria-controls', contentId);
      content.setAttribute('aria-labelledby', headerId);
      content.setAttribute('role', 'region');
      
      // Événement de clic
      header.addEventListener('click', () => {
        this.toggle(item);
      });
      
      // Navigation au clavier
      header.addEventListener('keydown', (e) => {
        this.handleKeyDown(e, item);
      });
    });
  }
  
  toggle(item) {
    const isOpen = item.classList.contains('accordion__item--open');
    
    if (!this.allowMultiple) {
      // Fermer tous les autres items
      this.items.forEach(otherItem => {
        if (otherItem !== item) {
          this.close(otherItem);
        }
      });
    }
    
    if (isOpen) {
      this.close(item);
    } else {
      this.open(item);
    }
  }
  
  open(item) {
    const header = item.querySelector('.accordion__header');
    const content = item.querySelector('.accordion__content');
    
    item.classList.add('accordion__item--open');
    header.setAttribute('aria-expanded', 'true');
    
    // Animation d'ouverture
    content.style.maxHeight = content.scrollHeight + 'px';
    
    // Événement personnalisé
    item.dispatchEvent(new CustomEvent('accordion:opened'));
  }
  
  close(item) {
    const header = item.querySelector('.accordion__header');
    const content = item.querySelector('.accordion__content');
    
    item.classList.remove('accordion__item--open');
    header.setAttribute('aria-expanded', 'false');
    
    // Animation de fermeture
    content.style.maxHeight = '0';
    
    // Événement personnalisé
    item.dispatchEvent(new CustomEvent('accordion:closed'));
  }
  
  handleKeyDown(e, item) {
    const currentIndex = this.items.indexOf(item);
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.focusNext(currentIndex);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.focusPrevious(currentIndex);
        break;
      case 'Home':
        e.preventDefault();
        this.focusFirst();
        break;
      case 'End':
        e.preventDefault();
        this.focusLast();
        break;
    }
  }
  
  focusNext(currentIndex) {
    const nextIndex = (currentIndex + 1) % this.items.length;
    const nextHeader = this.items[nextIndex].querySelector('.accordion__header');
    nextHeader.focus();
  }
  
  focusPrevious(currentIndex) {
    const prevIndex = currentIndex === 0 ? this.items.length - 1 : currentIndex - 1;
    const prevHeader = this.items[prevIndex].querySelector('.accordion__header');
    prevHeader.focus();
  }
  
  focusFirst() {
    const firstHeader = this.items[0].querySelector('.accordion__header');
    firstHeader.focus();
  }
  
  focusLast() {
    const lastHeader = this.items[this.items.length - 1].querySelector('.accordion__header');
    lastHeader.focus();
  }
  
  openAll() {
    this.items.forEach(item => this.open(item));
  }
  
  closeAll() {
    this.items.forEach(item => this.close(item));
  }
}

export default Accordion;