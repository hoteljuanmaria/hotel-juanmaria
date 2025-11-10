import Script from 'next/script'
import React from 'react'

import { defaultTheme, themeLocalStorageKey } from '../ThemeSelector/types'

export const InitTheme: React.FC = () => {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      dangerouslySetInnerHTML={{
        __html: `
  (function () {
    // Force light mode always
    var themeToSet = 'light'

    var root = document.documentElement
    root.setAttribute('data-theme', themeToSet)
    root.classList.remove('dark')

    // Also force light mode in localStorage to prevent theme switching
    window.localStorage.setItem('${themeLocalStorageKey}', 'light')
  })();
  `,
      }}
      id='theme-script'
      strategy='beforeInteractive'
    />
  )
}
