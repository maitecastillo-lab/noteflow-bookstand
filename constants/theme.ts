/**
 * Tokens visuales de Bookstand.
 * Aquí se centraliza la paleta de colores, la tipografía y los espaciados
 * para que toda la app sea coherente.
 */

// Paleta de colores: minimalista en blanco y negro
export const colors = {
    light: {
      background: '#FAFAFA',       // fondo principal, casi blanco
      surface: '#FFFFFF',          // tarjetas y superficies elevadas
      primary: '#1A1A1A',          // negro principal (botones, títulos)
      secondary: '#707070',        // gris medio (texto secundario, iconos)
      text: '#1A1A1A',             // texto principal
      textSecondary: '#707070',    // texto menos importante
      border: '#E5E5E5',           // bordes y separadores
      accent: '#1A1A1A',           // sin color de acento, usa el primary
    },
    dark: {
      background: '#0F0F0F',       // fondo casi negro
      surface: '#1A1A1A',          // tarjetas y superficies
      primary: '#FAFAFA',          // texto y botones en claro
      secondary: '#999999',        // gris medio
      text: '#FAFAFA',             // texto principal
      textSecondary: '#999999',    // texto secundario
      border: '#2A2A2A',           // bordes oscuros
      accent: '#FAFAFA',           // sin color de acento
    },
  };
  
  // Tipografía: tamaños base de fuente
  export const typography = {
    sizes: {
      xs: 12,    // texto muy pequeño (etiquetas)
      sm: 14,    // texto pequeño (subtítulos)
      base: 16,  // texto normal (cuerpo)
      lg: 18,    // texto destacado
      xl: 20,    // títulos pequeños
      '2xl': 24, // títulos
      '3xl': 30, // títulos grandes
      '4xl': 36, // títulos enormes
    },
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
  };
  
  // Espaciados: usados en padding, margin, gap
  export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  };
  
  // Bordes redondeados
  export const radius = {
    sm: 4,
    md: 8,
    lg: 16,
    full: 9999, // para elementos circulares
  };
  
  // Tipo del tema completo
  export type Theme = {
    colors: typeof colors.light;
    typography: typeof typography;
    spacing: typeof spacing;
    radius: typeof radius;
  };