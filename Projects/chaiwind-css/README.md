# ☕ Chaiwind CSS

<p>
  <a href="https://www.npmjs.com/package/chaiwind-css"><img src="https://img.shields.io/npm/v/chaiwind-css?color=f97316&label=npm" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/chaiwind-css"><img src="https://img.shields.io/npm/dm/chaiwind-css?color=f97316" alt="npm downloads" /></a>
  <a href="https://github.com/your-username/chaiwind-css/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/chaiwind-css?color=f97316" alt="license" /></a>
  <img src="https://img.shields.io/badge/dependencies-0-f97316" alt="zero dependencies" />
  <img src="https://img.shields.io/badge/size-~12kb-f97316" alt="bundle size" />
</p>

A **utility-first CSS-in-JS library** inspired by Tailwind CSS. Chaiwind scans your DOM, finds `chai-` utility classes, and injects styles automatically — no build step, no config, no dependencies.

```html
<div class="chai-flex chai-items-center chai-gap-4 chai-p-6 chai-bg-orange chai-rounded-xl">
  <h1 class="chai-text-2xl chai-font-bold chai-text-white">Hello, Chaiwind!</h1>
</div>
```

---

## ✨ Features

- ⚡ **Zero config** — drop in a script tag and start writing classes
- 🎯 **DOM-based injection** — only styles that are actually used get injected
- 🧩 **100+ utilities** — spacing, typography, colors, layout, borders, shadows, animations
- 🪶 **Zero dependencies** — pure vanilla JavaScript, ~12kb
- 📦 **Works everywhere** — any HTML file, React, Vue, or any framework
- 🔁 **Familiar API** — if you know Tailwind, you already know Chaiwind

---

## 📦 Installation

### Via npm

```bash
npm install chaiwind-css
# or
pnpm add chaiwind-css
# or
yarn add chaiwind-css
```

Then import once at your entry point:

```js
import 'chaiwind-css';
```

### Via CDN

Add this script tag anywhere in your HTML — no bundler required:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/chaiwind-css/src/index.js"></script>
```

---

## 🚀 Quick Start

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My App</title>
</head>
<body>

  <div class="chai-flex chai-flex-col chai-items-center chai-justify-center chai-min-h-screen chai-bg-black">
    <h1 class="chai-text-4xl chai-font-bold chai-text-white chai-mb-4">
      Hello, Chaiwind!
    </h1>
    <button class="chai-bg-orange chai-text-white chai-font-semibold chai-px-6 chai-py-3 chai-rounded-lg chai-cursor-pointer">
      Get Started
    </button>
  </div>

  <script type="module" src="https://cdn.jsdelivr.net/npm/chaiwind-css/src/index.js"></script>
</body>
</html>
```

---

## 📚 Available Classes

### Spacing

| Class | CSS |
|-------|-----|
| `chai-p-{1–12}` | `padding: ...` |
| `chai-px-{1–8}` | `padding-left & right: ...` |
| `chai-py-{1–8}` | `padding-top & bottom: ...` |
| `chai-pt/pb/pl/pr-{1–12}` | directional padding |
| `chai-m-{1–12}` | `margin: ...` |
| `chai-mx-{1–4}`, `chai-mx-auto` | `margin-left & right: ...` |
| `chai-my-{1–8}` | `margin-top & bottom: ...` |
| `chai-mt/mb/ml/mr-{1–12}` | directional margin |

### Typography

| Class | CSS |
|-------|-----|
| `chai-text-{xs\|sm\|base\|lg\|xl\|2xl\|3xl\|4xl\|5xl\|6xl}` | `font-size: ...` |
| `chai-font-{thin\|light\|normal\|medium\|semibold\|bold\|black}` | `font-weight: ...` |
| `chai-text-{left\|center\|right\|justify}` | `text-align: ...` |
| `chai-uppercase`, `chai-lowercase`, `chai-capitalize` | `text-transform: ...` |
| `chai-italic`, `chai-not-italic` | `font-style: ...` |
| `chai-underline`, `chai-line-through`, `chai-no-underline` | `text-decoration: ...` |
| `chai-tracking-{tight\|normal\|wide\|wider}` | `letter-spacing: ...` |
| `chai-leading-{none\|tight\|normal\|loose}` | `line-height: ...` |
| `chai-truncate` | `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` |

### Colors

**Text colors:** `chai-text-{white|black|red|blue|green|yellow|purple|pink|gray|orange|indigo|teal}`

**Background colors:** `chai-bg-{white|black|red|blue|green|yellow|purple|pink|gray|orange|indigo|teal|transparent}`

### Layout

| Class | CSS |
|-------|-----|
| `chai-flex`, `chai-inline-flex` | `display: flex` |
| `chai-grid`, `chai-inline-grid` | `display: grid` |
| `chai-block`, `chai-inline`, `chai-inline-block`, `chai-hidden` | `display: ...` |
| `chai-flex-row`, `chai-flex-col` | `flex-direction: ...` |
| `chai-flex-wrap`, `chai-flex-nowrap` | `flex-wrap: ...` |
| `chai-items-{start\|center\|end\|stretch\|baseline}` | `align-items: ...` |
| `chai-justify-{start\|center\|end\|between\|around\|evenly}` | `justify-content: ...` |
| `chai-gap-{1–8}` | `gap: ...` |
| `chai-grid-cols-{1–4\|6\|12}` | `grid-template-columns: ...` |

### Sizing

| Class | CSS |
|-------|-----|
| `chai-w-{1–96}` | `width: ...` |
| `chai-w-{half\|full\|screen\|auto\|min\|max\|fit}` | percentage/keyword widths |
| `chai-h-{1–96}` | `height: ...` |
| `chai-h-{half\|full\|screen\|auto\|min\|max\|fit}` | percentage/keyword heights |
| `chai-min-w-{0\|full\|min\|max\|fit}` | `min-width: ...` |
| `chai-max-w-{xs–7xl\|full\|none}` | `max-width: ...` |
| `chai-min-h-{0\|full\|screen}` | `min-height: ...` |
| `chai-max-h-{full\|screen\|none}` | `max-height: ...` |

### Position

| Class | CSS |
|-------|-----|
| `chai-static`, `chai-relative`, `chai-absolute`, `chai-fixed`, `chai-sticky` | `position: ...` |
| `chai-top/right/bottom/left-{0\|2\|4\|8}` | directional offsets |
| `chai-inset-0` | `top: 0; right: 0; bottom: 0; left: 0` |
| `chai-z-{0\|10\|20\|30\|40\|50\|100}` | `z-index: ...` |

### Borders

| Class | CSS |
|-------|-----|
| `chai-border`, `chai-border-{2\|4}` | `border: ...px solid` |
| `chai-border-{color}` | `border-color: ...` |
| `chai-rounded-{sm\|md\|lg\|xl\|2xl\|3xl\|full\|none}` | `border-radius: ...` |

### Shadows

`chai-shadow-{sm|md|lg|xl|2xl|none}`

### Transitions & Transforms

| Class | CSS |
|-------|-----|
| `chai-transition`, `chai-transition-{slow\|fast}` | `transition: all ...` |
| `chai-duration-{75\|100\|200\|300\|500}` | `transition-duration: ...` |
| `chai-ease-{in\|out\|in-out}` | `transition-timing-function: ...` |
| `chai-scale-{90\|95\|100\|105\|110\|125}` | `transform: scale(...)` |
| `chai-rotate-{0\|45\|90\|180}` | `transform: rotate(...)` |

### Opacity

`chai-opacity-{0|25|50|75|100}`

### Overflow

`chai-overflow-{auto|hidden|visible|scroll}` · `chai-overflow-{x|y}-{auto|hidden}`

### Cursor

`chai-cursor-{pointer|default|not-allowed|wait|grab|text|none}`

### Animations

| Class | Description |
|-------|-------------|
| `chai-animate-spin` | Continuous 360° rotation |
| `chai-animate-ping` | Scale + fade ping effect |
| `chai-animate-bounce` | Vertical bounce loop |
| `chai-animate-pulse` | Opacity pulse loop |
| `chai-animate-none` | Removes animation |

---

## 🔧 How It Works

Chaiwind uses a simple but effective approach:

1. **Scans the DOM** for all elements with a `class` attribute
2. **Matches** class names against the utility dictionary using exact O(1) lookup
3. **Injects styles** via `element.style.setProperty()` for each matched class
4. **Injects keyframes** once into a `<style>` tag for animation support

```js
// src/index.js (simplified)
import classes from './classes.js';

function applyChaiwind() {
  const elements = [...document.querySelectorAll('[class]')];

  elements.forEach(el => {
    el.classList.forEach(className => {
      if (!classes[className]) return;

      classes[className]
        .split(';')
        .map(s => s.trim())
        .filter(Boolean)
        .forEach(rule => {
          const colonIndex = rule.indexOf(':');
          const prop = rule.slice(0, colonIndex).trim();
          const val  = rule.slice(colonIndex + 1).trim();
          el.style.setProperty(prop, val);
        });
    });
  });
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', applyChaiwind);
} else {
  applyChaiwind();
}
```

---

## 🗂️ Project Structure

```
chaiwind-css/
├── src/
│   ├── index.js       # Core engine — scans DOM and injects styles
│   └── classes.js     # Utility class definitions
├── package.json
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! To add new utility classes:

1. Fork the repository
2. Add your classes to `src/classes.js`
3. Open a pull request with a clear description

```bash
git clone https://github.com/your-username/chaiwind-css.git
cd chaiwind-css
# make your changes to src/classes.js
```

---

## 📄 License

MIT © [Gopal Choudhary](https://github.com/your-username)

---

<p align="center">Built with ☕ by Gopal Choudhary</p>