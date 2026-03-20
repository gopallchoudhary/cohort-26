import classes from "./classes.js";
const uniqueClasses = [...new Set(
  [...document.querySelectorAll('[class]')]
    .flatMap(el => [...el.classList])
)];


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





for (let [key, value] of Object.entries(classes)) {
  uniqueClasses.forEach(className => {
    if (className.includes(key)) {
      document.querySelectorAll(`.${className}`).forEach(el => {
        el.style.cssText += "; " + value;
      })
    }
  })
}