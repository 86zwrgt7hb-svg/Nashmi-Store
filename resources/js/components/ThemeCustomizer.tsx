import React, { useEffect } from 'react';

interface ThemeCustomizerProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  headingFontFamily?: string;
}

/**
 * ThemeCustomizer component
 * Injects CSS custom properties and Google Fonts based on store customization settings.
 * Place this component inside the theme layout to apply custom colors and fonts.
 */
export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  primaryColor,
  secondaryColor,
  accentColor,
  fontFamily,
  headingFontFamily,
}) => {
  // Collect unique font families to load from Google Fonts
  const fontsToLoad: string[] = [];
  if (fontFamily) fontsToLoad.push(fontFamily);
  if (headingFontFamily && headingFontFamily !== fontFamily) fontsToLoad.push(headingFontFamily);

  // Build Google Fonts URL
  const googleFontsUrl = fontsToLoad.length > 0
    ? `https://fonts.googleapis.com/css2?${fontsToLoad
        .map(f => `family=${f.replace(/ /g, '+')}:wght@300;400;500;600;700`)
        .join('&')}&display=swap`
    : null;

  // Helper to convert hex to RGB values
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
    }
    return '';
  };

  // Helper to darken a hex color by a percentage
  const darkenColor = (hex: string, percent: number): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;
    const r = Math.max(0, Math.floor(parseInt(result[1], 16) * (1 - percent / 100)));
    const g = Math.max(0, Math.floor(parseInt(result[2], 16) * (1 - percent / 100)));
    const b = Math.max(0, Math.floor(parseInt(result[3], 16) * (1 - percent / 100)));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Helper to lighten a hex color by a percentage
  const lightenColor = (hex: string, percent: number): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;
    const r = Math.min(255, Math.floor(parseInt(result[1], 16) + (255 - parseInt(result[1], 16)) * (percent / 100)));
    const g = Math.min(255, Math.floor(parseInt(result[2], 16) + (255 - parseInt(result[2], 16)) * (percent / 100)));
    const b = Math.min(255, Math.floor(parseInt(result[3], 16) + (255 - parseInt(result[3], 16)) * (percent / 100)));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Build CSS custom properties
  let cssVars = ':root {\n';
  
  if (primaryColor) {
    cssVars += `  --store-primary: ${primaryColor};\n`;
    cssVars += `  --store-primary-rgb: ${hexToRgb(primaryColor)};\n`;
    cssVars += `  --store-primary-hover: ${darkenColor(primaryColor, 10)};\n`;
    cssVars += `  --store-primary-light: ${lightenColor(primaryColor, 85)};\n`;
  }
  
  if (secondaryColor) {
    cssVars += `  --store-secondary: ${secondaryColor};\n`;
    cssVars += `  --store-secondary-rgb: ${hexToRgb(secondaryColor)};\n`;
    cssVars += `  --store-secondary-hover: ${darkenColor(secondaryColor, 10)};\n`;
    cssVars += `  --store-secondary-light: ${lightenColor(secondaryColor, 85)};\n`;
  }
  
  if (accentColor) {
    cssVars += `  --store-accent: ${accentColor};\n`;
    cssVars += `  --store-accent-rgb: ${hexToRgb(accentColor)};\n`;
    cssVars += `  --store-accent-hover: ${darkenColor(accentColor, 10)};\n`;
    cssVars += `  --store-accent-light: ${lightenColor(accentColor, 85)};\n`;
  }
  
  if (fontFamily) {
    cssVars += `  --store-font-body: '${fontFamily}', sans-serif;\n`;
  }
  
  if (headingFontFamily) {
    cssVars += `  --store-font-heading: '${headingFontFamily}', sans-serif;\n`;
  }
  
  cssVars += '}\n\n';

  // Apply font families globally
  let fontCss = '';
  if (fontFamily) {
    fontCss += `body, p, span, div, input, textarea, select, button, a, li, td, th, label {\n`;
    fontCss += `  font-family: var(--store-font-body) !important;\n`;
    fontCss += `}\n\n`;
  }
  
  if (headingFontFamily) {
    fontCss += `h1, h2, h3, h4, h5, h6 {\n`;
    fontCss += `  font-family: var(--store-font-heading) !important;\n`;
    fontCss += `}\n\n`;
  }

  // Apply primary color to common elements
  let colorCss = '';
  if (primaryColor) {
    colorCss += `/* Primary color overrides */\n`;
    colorCss += `.bg-blue-600, .bg-blue-500, .bg-indigo-600, .bg-indigo-500,\n`;
    colorCss += `.bg-emerald-600, .bg-emerald-500, .bg-green-600, .bg-green-500,\n`;
    colorCss += `.bg-purple-600, .bg-purple-500, .bg-rose-600, .bg-rose-500,\n`;
    colorCss += `.bg-amber-600, .bg-amber-500, .bg-violet-600, .bg-violet-500 {\n`;
    colorCss += `  background-color: var(--store-primary) !important;\n`;
    colorCss += `}\n\n`;
    
    colorCss += `.bg-blue-600:hover, .bg-blue-500:hover, .bg-indigo-600:hover, .bg-indigo-500:hover,\n`;
    colorCss += `.bg-emerald-600:hover, .bg-emerald-500:hover, .bg-green-600:hover, .bg-green-500:hover,\n`;
    colorCss += `.bg-purple-600:hover, .bg-purple-500:hover, .bg-rose-600:hover, .bg-rose-500:hover,\n`;
    colorCss += `.bg-amber-600:hover, .bg-amber-500:hover, .bg-violet-600:hover, .bg-violet-500:hover {\n`;
    colorCss += `  background-color: var(--store-primary-hover) !important;\n`;
    colorCss += `}\n\n`;

    colorCss += `.text-blue-600, .text-blue-500, .text-indigo-600, .text-indigo-500,\n`;
    colorCss += `.text-emerald-600, .text-emerald-500, .text-green-600, .text-green-500,\n`;
    colorCss += `.text-purple-600, .text-purple-500, .text-rose-600, .text-rose-500,\n`;
    colorCss += `.text-amber-600, .text-amber-500, .text-violet-600, .text-violet-500 {\n`;
    colorCss += `  color: var(--store-primary) !important;\n`;
    colorCss += `}\n\n`;

    colorCss += `.border-blue-600, .border-blue-500, .border-indigo-600, .border-indigo-500,\n`;
    colorCss += `.border-emerald-600, .border-emerald-500, .border-green-600, .border-green-500,\n`;
    colorCss += `.border-purple-600, .border-purple-500, .border-rose-600, .border-rose-500,\n`;
    colorCss += `.border-amber-600, .border-amber-500, .border-violet-600, .border-violet-500 {\n`;
    colorCss += `  border-color: var(--store-primary) !important;\n`;
    colorCss += `}\n\n`;

    colorCss += `.bg-blue-50, .bg-indigo-50, .bg-emerald-50, .bg-green-50,\n`;
    colorCss += `.bg-purple-50, .bg-rose-50, .bg-amber-50, .bg-violet-50 {\n`;
    colorCss += `  background-color: var(--store-primary-light) !important;\n`;
    colorCss += `}\n\n`;

    colorCss += `.ring-blue-600, .ring-blue-500, .ring-indigo-600, .ring-indigo-500,\n`;
    colorCss += `.ring-emerald-600, .ring-emerald-500, .ring-green-600, .ring-green-500,\n`;
    colorCss += `.ring-purple-600, .ring-purple-500, .ring-rose-600, .ring-rose-500,\n`;
    colorCss += `.ring-amber-600, .ring-amber-500, .ring-violet-600, .ring-violet-500 {\n`;
    colorCss += `  --tw-ring-color: var(--store-primary) !important;\n`;
    colorCss += `}\n\n`;
  }

  if (accentColor) {
    colorCss += `/* Accent color for add-to-cart and CTA buttons */\n`;
    colorCss += `[data-action="add-to-cart"], .add-to-cart-btn, .cta-button {\n`;
    colorCss += `  background-color: var(--store-accent) !important;\n`;
    colorCss += `}\n`;
    colorCss += `[data-action="add-to-cart"]:hover, .add-to-cart-btn:hover, .cta-button:hover {\n`;
    colorCss += `  background-color: var(--store-accent-hover) !important;\n`;
    colorCss += `}\n\n`;
  }

  const hasCustomization = primaryColor || secondaryColor || accentColor || fontFamily || headingFontFamily;

  if (!hasCustomization) return null;

  return (
    <>
      {/* Google Fonts */}
      {googleFontsUrl && (
        <link href={googleFontsUrl} rel="stylesheet" />
      )}
      
      {/* Custom CSS Variables and Overrides */}
      <style dangerouslySetInnerHTML={{ __html: cssVars + fontCss + colorCss }} />
    </>
  );
};

export default ThemeCustomizer;
