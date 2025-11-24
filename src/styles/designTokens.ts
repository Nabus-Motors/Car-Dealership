/**
 * Design Tokens for Automotive Dealership UI
 * Extracted from Figma prototypes with premium automotive aesthetic
 * Sharp edges, sleek lines, high contrast, professional premium feel
 */

export const designTokens = {
  // ============================================
  // COLOR PALETTE
  // ============================================
  colors: {
    // Primary Colors - Navy/Dark Theme
    primary: {
      navy: '#001F3F',      // Deep navy blue
      dark: '#0A1D47',      // Darker navy for contrast
      darker: '#050F1F',    // Almost black navy
      light: '#1A3A52',     // Lighter navy for hover
    },
    
    // Secondary Colors - White & Neutrals
    secondary: {
      white: '#FFFFFF',
      offWhite: '#F8F9FA',
      gray100: '#F3F4F6',
      gray200: '#E5E7EB',
      gray300: '#D1D5DB',
      gray400: '#9CA3AF',
      gray500: '#6B7280',
      gray600: '#4B5563',
      gray700: '#374151',
      gray800: '#1F2937',
      gray900: '#111827',
      black: '#000000',
    },
    
    // Accent Colors - Yellow/Gold
    accent: {
      gold: '#FFD700',      // Classic gold
      yellow: '#FFC700',    // Bright yellow
      light: '#FFF4CC',     // Light yellow for hover
      dark: '#E6B800',      // Darker gold for active
    },
    
    // Status Colors
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    
    // Semantic Colors
    semantic: {
      text: '#FFFFFF',      // Primary text on dark backgrounds
      textDark: '#111827',  // Text on light backgrounds
      textMuted: '#9CA3AF', // Muted text
      background: '#050F1F',  // Dark background
      surface: '#0A1D47',   // Surface/card background
      border: '#1A3A52',    // Border color
      hover: '#FFC700',     // Hover accent
    },
  },

  // ============================================
  // SPACING
  // ============================================
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
    xxxl: '48px',
    huge: '64px',
  },

  // ============================================
  // TYPOGRAPHY
  // ============================================
  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"Courier New", monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '28px',
      '4xl': '32px',
      '5xl': '40px',
      '6xl': '48px',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
  },

  // ============================================
  // BORDERS & CORNERS
  // ============================================
  borders: {
    // Sharp edges - NO border-radius
    radius: {
      none: '0px',
      sharp: '0px',      // Automotive aesthetic - sharp corners
    },
    width: {
      thin: '1px',
      base: '2px',
      thick: '3px',
      extraThick: '4px',
    },
    style: 'solid',
  },

  // ============================================
  // SHADOWS
  // ============================================
  shadows: {
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    base: '0 4px 6px rgba(0, 0, 0, 0.4)',
    md: '0 10px 15px rgba(0, 0, 0, 0.5)',
    lg: '0 20px 25px rgba(0, 0, 0, 0.6)',
    xl: '0 25px 50px rgba(0, 0, 0, 0.7)',
    // Glow effects
    goldGlow: '0 0 20px rgba(255, 215, 0, 0.4)',
    goldGlowStrong: '0 0 40px rgba(255, 215, 0, 0.6)',
  },

  // ============================================
  // TRANSITIONS & ANIMATIONS
  // ============================================
  transitions: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    moderate: '300ms ease-in-out',
    slow: '400ms ease-in-out',
    slower: '500ms ease-in-out',
    slowest: '600ms ease-in-out',
  },

  animations: {
    // Fade transitions
    fadeIn: 'fadeIn 300ms ease-in-out forwards',
    fadeOut: 'fadeOut 300ms ease-in-out forwards',
    // Slide transitions
    slideInLeft: 'slideInLeft 300ms ease-in-out forwards',
    slideInRight: 'slideInRight 300ms ease-in-out forwards',
    slideInUp: 'slideInUp 300ms ease-in-out forwards',
    slideInDown: 'slideInDown 300ms ease-in-out forwards',
    // Scale effects
    scaleIn: 'scaleIn 300ms ease-in-out forwards',
    // Hover effects
    hoverLift: 'hoverLift 200ms ease-in-out',
  },

  // ============================================
  // BREAKPOINTS
  // ============================================
  breakpoints: {
    mobile: '320px',
    tablet: '640px',
    laptop: '1024px',
    desktop: '1280px',
    wide: '1536px',
  },

  // ============================================
  // Z-INDEX SCALE
  // ============================================
  zIndex: {
    base: 0,
    dropdown: 100,
    sticky: 200,
    fixed: 300,
    modal: 400,
    popover: 500,
    tooltip: 600,
  },

  // ============================================
  // COMPONENT-SPECIFIC TOKENS
  // ============================================
  components: {
    button: {
      padding: {
        sm: '8px 16px',
        md: '12px 24px',
        lg: '16px 32px',
      },
      height: {
        sm: '32px',
        md: '40px',
        lg: '48px',
      },
      minWidth: '120px',
      fontWeight: 600,
      borderRadius: '0px', // Sharp edges
    },
    
    card: {
      padding: '24px',
      borderRadius: '0px', // Sharp edges
      borderWidth: '2px',
      gap: '16px',
    },
    
    input: {
      height: '40px',
      padding: '12px 16px',
      borderRadius: '0px', // Sharp edges
      borderWidth: '2px',
      fontSize: '16px',
    },
    
    badge: {
      padding: '8px 12px',
      borderRadius: '0px', // Sharp edges
      fontSize: '14px',
      fontWeight: 600,
    },
  },
};

// Export individual token groups
export const colors = designTokens.colors;
export const spacing = designTokens.spacing;
export const typography = designTokens.typography;
export const borders = designTokens.borders;
export const shadows = designTokens.shadows;
export const transitions = designTokens.transitions;
export const breakpoints = designTokens.breakpoints;

// Color utility functions
export const getColor = (path: string) => {
  const keys = path.split('.');
  let value: any = designTokens.colors;
  for (const key of keys) {
    value = value[key];
  }
  return value;
};
