class MyCounter extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    const template = document.getElementById("counter-template").content;
    shadowRoot.appendChild(template.cloneNode(true));
    this.countElement = shadowRoot.getElementById("count");
    this.incrementButton = shadowRoot.getElementById("increment");
    this.decrementButton = shadowRoot.getElementById("decrement");

    this.count = 0;

    this.incrementButton.addEventListener("click", () => this.increment());
    this.decrementButton.addEventListener("click", () => this.decrement());

    this.render();
  }

  increment() {
    this.count++;
    this.render();
  }

  decrement() {
    this.count--;
    this.render();
  }

  render() {
    this.countElement.textContent = this.count;
  }
}

customElements.define("my-counter", MyCounter);
