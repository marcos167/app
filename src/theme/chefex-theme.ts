/**
 * 🎨 CHEFEX THEME - Arquivo de Tema Centralizado
 * 
 * REGRA: Todas as cores, tipografia, espaçamentos e sombras
 * devem ser importadas deste arquivo. Cores hardcoded são PROIBIDAS.
 * 
 * Empresa: Axis Software
 * Produto: Chefex
 */

// ============================================
// 🎨 PALETA DE CORES OFICIAL CHEFEX
// ============================================

export const colors = {
    // Cores Primárias (NUNCA ALTERAR)
    primary: {
        green: '#4A9D5B',        // Verde Chefex - ação principal, sucesso
        greenLight: '#5DB46E',   // Verde claro (dark mode)
        greenDark: '#3D8A4E',    // Verde escuro (hover)
    },
    secondary: {
        orange: '#F5A623',       // Laranja Chefex - CTA, destaque
        orangeLight: '#FFAD33',  // Laranja claro (dark mode)
        orangeDark: '#E09500',   // Laranja escuro (hover)
    },

    // Neutros - PREMIUM SOPHISTICATED
    neutral: {
        black: '#0E0F10',        // Base Premium (NUNCA usar #000000)
        graphite: '#0E0F10',     // Dark Premium Base
        secondary: '#141618',    // Background Secondary
        surface: '#1B1E22',      // Cards/Surfaces
        elevated: '#24272C',     // Elevated surfaces
        darkGray: '#1B1E22',     // Surfaces
        mediumGray: '#44403C',   // Borders
        lightGray: '#9CA3AF',    // Texto secundário
        offWhite: '#EDEDED',     // Texto primário
        warmWhite: '#FDFCF5',    // Light mode bg
        borderSoft: 'rgba(255,255,255,0.06)', // Bordas sutis
    },

    // Estados
    state: {
        success: '#4A9D5B',      // Verde Chefex
        warning: '#F5A623',      // Laranja Chefex
        error: '#EF4444',        // Vermelho suave
        errorLight: '#FF4D6D',   // Vermelho claro (dark mode)
        info: '#3B82F6',         // Azul info
    },

    // Overlay
    overlay: {
        dark: 'rgba(0, 0, 0, 0.5)',
        darker: 'rgba(0, 0, 0, 0.8)',
        light: 'rgba(255, 255, 255, 0.1)',
    },
} as const;

// ============================================
// 📐 ESPAÇAMENTOS
// ============================================

export const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
} as const;

// ============================================
// 🔤 TIPOGRAFIA
// ============================================

export const typography = {
    fontFamily: {
        sans: 'var(--font-geist-sans), system-ui, sans-serif',
        mono: 'var(--font-geist-mono), monospace',
    },
    fontSize: {
        xs: '10px',
        sm: '12px',
        base: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '40px',
        '5xl': '48px',
    },
    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        black: 900,
    },
} as const;

// ============================================
// 🌓 SOMBRAS
// ============================================

export const shadows = {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
    '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
    glow: {
        green: '0 0 20px rgba(74, 157, 91, 0.3)',
        orange: '0 0 20px rgba(245, 166, 35, 0.3)',
    },
} as const;

// ============================================
// 📐 BORDER RADIUS
// ============================================

export const radius = {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    '3xl': '32px',
    full: '9999px',
} as const;

// ============================================
// 🖼️ ASSETS DA MARCA
// ============================================

export const brand = {
    logo: {
        full: {
            dark: '/brand/chefex-logo-dark.png',
            light: '/brand/chefex-logo-light.png',
        },
        icon: '/brand/chefex-icon.png',
        appIcon: '/brand/chefex-app-icon.png',
        favicon: '/brand/chefex-favicon.png',
    },
    name: 'Chefex',
    company: 'Axis Software',
    tagline: 'Seu Assistente na Cozinha',
    copyright: `© ${new Date().getFullYear()} Axis Software. Todos os direitos reservados.`,
} as const;

// ============================================
// 🎯 TEMA COMPLETO (EXPORT DEFAULT)
// ============================================

const chefexTheme = {
    colors,
    spacing,
    typography,
    shadows,
    radius,
    brand,
} as const;

export default chefexTheme;

// Type exports
export type ChefexColors = typeof colors;
export type ChefexTheme = typeof chefexTheme;
