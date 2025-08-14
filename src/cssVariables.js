// Keep these in sync with the CSS variables in your tailwind configuration

export const cssVariables = {
  breakpoints: {
    '3xl': 1920,
    '2xl': 1536,
    xl: 1280,
    lg: 1024,
    md: 768,
    sm: 640,
  },
}

// Enable smooth scroll globally via a CSS variable hook (Tailwind preflight can pick it up)
if (typeof document !== 'undefined') {
  try {
    const style = document.createElement('style')
    style.innerHTML = `html{scroll-behavior:smooth}`
    document.head.appendChild(style)
  } catch {}
}
