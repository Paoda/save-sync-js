class Modal {
  constructor(ref) {
    this.ref = ref;
  }

  hide() {
    this.ref.style.display = 'none'
  }

  show() {
    this.ref.style.display = 'flex'
  }

  destroy() {
    this.ref.parentNode.removeChild(this.ref);
  }
}