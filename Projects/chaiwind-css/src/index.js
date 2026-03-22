import classes from "./classes.js";

function applyChaiwind() {
  const elements = [...document.querySelectorAll('[class]')];
  if (elements.length === 0) {
    console.log("No elements found");
    return;
  }

  let animation = false

  elements.forEach(el => {
    el.classList.forEach(className => {

      if (classes[className]) {
        // exact O(1) lookup
        const [prop, val] = classes[className]       // split "padding: 1rem"
          .split(':').map(s => s.trim());            // trim whitespace
        el.style.setProperty(prop, val);             // no override issue

        // If there is a animation
        if (className.startsWith('chai-animate')) {
          animation = true
        }
      }
    });
  });


  //, add animations
  if (animation) {

    const style = document.createElement('style');
    style.textContent = `@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
  
@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}
  

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}`
    document.head.appendChild(style);
  }
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', applyChaiwind);
} else {
  applyChaiwind();
}

