import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Dark theme base colors
        background: {
          DEFAULT: '#101520',
          secondary: '#0F1419',
          tertiary: '#1a1f2e',
          elevated: '#242938',
        },

        // Primary colors
        primary: {
          DEFAULT: '#63B5FF',
          dark: '#3B82F6',
          light: '#93C5FD',
        },

        // Accent colors
        accent: {
          DEFAULT: '#B5FF63',
          dark: '#86C735',
          light: '#D4FF94',
        },

        // Semantic colors
        destructive: {
          DEFAULT: '#ff6b6b',
          dark: '#EF4444',
          light: '#FCA5A5',
        },

        warning: {
          DEFAULT: '#FFA500',
          dark: '#F59E0B',
          light: '#FFC04D',
        },

        success: {
          DEFAULT: '#10B981',
          dark: '#059669',
          light: '#34D399',
        },

        // Graph-specific colors
        graph: {
          900: '#0a0d13',
          800: '#0F1419',
          700: '#151b26',
          600: '#1a2332',
          500: '#242d3f',
          400: '#2e3a4e',
        },

        // Text colors
        text: {
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#9ca3af',
          400: '#6b7280',
        },

        // Node type colors
        node: {
          data: '#3B82F6',
          document: '#8B5CF6',
          agent: '#10B981',
          user: '#F59E0B',
          system: '#6B7280',
        },

        // Immutability level colors
        immutable: {
          mutable: '#10B981',
          locked: '#F59E0B',
          immutable: '#EF4444',
        },
      },

      // Glassmorphism utilities
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '40px',
      },

      // Shadows for depth
      boxShadow: {
        'glow-sm': '0 0 10px rgba(99, 181, 255, 0.3)',
        'glow-md': '0 0 20px rgba(99, 181, 255, 0.4)',
        'glow-lg': '0 0 30px rgba(99, 181, 255, 0.5)',
        'glow-accent': '0 0 20px rgba(181, 255, 99, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'depth-1': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'depth-2': '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
        'depth-3': '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
        'depth-4': '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
        'depth-5': '0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)',
      },

      // Animation
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'strobe-gentle': 'strobeGentle 4s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'block-flip': 'blockFlip 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 181, 255, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(99, 181, 255, 0.6)' },
        },
        strobeGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        blockFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
      },

      // Typography
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      // Spacing for the grid system
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // Border radius
      borderRadius: {
        'glass': '16px',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};

export default config;