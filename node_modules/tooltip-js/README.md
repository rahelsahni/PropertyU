[![Build Status](https://travis-ci.org/mkay581/tooltip-js.svg?branch=master)](https://travis-ci.org/mkay581/tooltip-js)
[![npm version](https://badge.fury.io/js/tooltip-js.svg)](https://badge.fury.io/js/tooltip-js)
[![Bower version](https://badge.fury.io/bo/tooltip-module.svg)](https://badge.fury.io/bo/tooltip-module)

# Tooltip

Create simple or advanced, high performant Tooltips with minimal javascript and markup.
This library is built using native vanilla javascript which means super fast performance. 
Supports IE10+, all major browsers and even mobile.

## Usage

Create your Tooltip html:

```html
<div class="my-tooltip">My Tooltip Content</div>
<button class="my-tooltip-toggle-btn">Toggle</button>
```

The add your css:

```css

.my-tooltip {
    display: none;
}

.my-tooltip-active {
    display: block;
}
```

Then activate your tooltip with the following: 

```javascript
var tooltip = new Tooltip({
    el: document.body.querySelector('.my-tooltip'),
    activeClass: 'my-tooltip-active',
    triggerClass: 'my-tooltip-toggle-btn'
});

tooltip.show(); // show the tooltip
tooltip.hide(); // hide the tooltip
```
