class Modal {
  constructor(ref) {
    this.ref = ref;
    this.displayed = false;

    this.ref.onclick = e => {
      console.log(e);
      
      if (this.displayed && e.target.className === 'modal') this.hide();
    }
  }

  hide() {
    this.ref.style.display = 'none'
    this.displayed = false;
  }

  show() {
    this.ref.style.display = 'flex'
    this.displayed = true;
  }

  destroy() {
    this.ref.parentNode.removeChild(this.ref);
  }

  toggle() {
    if (this.displayed) this.hide();
    else this.show();
  }
}