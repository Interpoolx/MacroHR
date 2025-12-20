// src/lib/themes.ts

export type ThemeName = "default" | "minimal" | "oak" | "olive";

export interface ThemeTokens {
    // Colors
    primary: string;
    primaryEnd: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    header: string;
    headerForeground: string;
    footer: string;
    footerForeground: string;
    sidebar: string;
    sidebarForeground: string;
    sidebarBorder: string;
    glassBg: string;
    glassBorder: string;

    // Typography
    fontSans: string;
    fontHeading: string;
    fontSizeBase: string;
    lineHeightBase: string;

    // Spacing & Layout
    spacingBase: string;
    radiusBase: string;
}

export interface ThemeDefinition {
    name: string;
    dark: boolean;
    tokens: ThemeTokens;
}

export const themes: Record<ThemeName, ThemeDefinition> = {
    default: {
        name: "Default",
        dark: true,
        tokens: {
            primary: "#FF6B00",
            primaryEnd: "#FF8533",
            primaryForeground: "#FFFFFF",
            secondary: "#000000",
            secondaryForeground: "#FFFFFF",
            accent: "#FFFFFF",
            accentForeground: "#000000",
            background: "#0F0F0F",
            foreground: "#FFFFFF",
            muted: "#1A1A1A",
            mutedForeground: "#A0A0A0",
            border: "#2A2A2A",
            card: "#121212",
            cardForeground: "#FFFFFF",
            popover: "#1A1A1A",
            popoverForeground: "#FFFFFF",
            header: "#0A0A0A",
            headerForeground: "#FFFFFF",
            footer: "#050505",
            footerForeground: "#A0A0A0",
            sidebar: "#0C0C0C",
            sidebarForeground: "#FFFFFF",
            sidebarBorder: "#242424",
            glassBg: "rgba(10, 10, 10, 0.7)",
            glassBorder: "rgba(255, 255, 255, 0.05)",
            fontSans: "'Inter', sans-serif",
            fontHeading: "'Inter', sans-serif",
            fontSizeBase: "16px",
            lineHeightBase: "1.5",
            spacingBase: "4px",
            radiusBase: "12px",
        },
    },

    minimal: {
        name: "Minimal",
        dark: false,
        tokens: {
            primary: "#000000",
            primaryEnd: "#333333",
            primaryForeground: "#FFFFFF",
            secondary: "#F0F0F0",
            secondaryForeground: "#000000",
            accent: "#000000",
            accentForeground: "#FFFFFF",
            background: "#FFFFFF",
            foreground: "#000000",
            muted: "#F9F9F9",
            mutedForeground: "#666666",
            border: "#EEEEEE",
            card: "#FAFAFA",
            cardForeground: "#000000",
            popover: "#FFFFFF",
            popoverForeground: "#000000",
            header: "#FFFFFF",
            headerForeground: "#000000",
            footer: "#F9F9F9",
            footerForeground: "#666666",
            sidebar: "#FBFBFB",
            sidebarForeground: "#000000",
            sidebarBorder: "#EEEEEE",
            glassBg: "rgba(255, 255, 255, 0.8)",
            glassBorder: "rgba(0, 0, 0, 0.05)",
            fontSans: "'Inter', sans-serif",
            fontHeading: "'Inter', sans-serif",
            fontSizeBase: "15px",
            lineHeightBase: "1.6",
            spacingBase: "5px",
            radiusBase: "8px",
        },
    },

    oak: {
        name: "Oak",
        dark: true,
        tokens: {
            primary: "#8B4513",
            primaryEnd: "#A0522D",
            primaryForeground: "#FFFFFF",
            secondary: "#D2B48C",
            secondaryForeground: "#3E2723",
            accent: "#A0522D",
            accentForeground: "#FFFFFF",
            background: "#2E1A12",
            foreground: "#F5DEB3",
            muted: "#4A2F20",
            mutedForeground: "#D2B48C",
            border: "#5D4037",
            card: "#3E2723",
            cardForeground: "#F5DEB3",
            popover: "#3E2723",
            popoverForeground: "#F5DEB3",
            header: "#3E2723",
            headerForeground: "#F5DEB3",
            footer: "#2E1A12",
            footerForeground: "#D2B48C",
            sidebar: "#2D1D16",
            sidebarForeground: "#F5DEB3",
            sidebarBorder: "#4A2F20",
            glassBg: "rgba(40, 20, 10, 0.7)",
            glassBorder: "rgba(255, 255, 255, 0.05)",
            fontSans: "'Garamond', serif",
            fontHeading: "'Garamond', serif",
            fontSizeBase: "17px",
            lineHeightBase: "1.4",
            spacingBase: "4px",
            radiusBase: "4px",
        },
    },

    olive: {
        name: "Olive",
        dark: true,
        tokens: {
            primary: "#556B2F",
            primaryEnd: "#6B8E23",
            primaryForeground: "#FFFFFF",
            secondary: "#808000",
            secondaryForeground: "#FFFFFF",
            accent: "#6B8E23",
            accentForeground: "#FFFFFF",
            background: "#1F2F1F",
            foreground: "#E8E8E8",
            muted: "#2F3F2F",
            mutedForeground: "#A0A080",
            border: "#3F4F3F",
            card: "#283428",
            cardForeground: "#E8E8E8",
            popover: "#283428",
            popoverForeground: "#E8E8E8",
            header: "#283428",
            headerForeground: "#E8E8E8",
            footer: "#1F2F1F",
            footerForeground: "#A0A080",
            sidebar: "#1A251A",
            sidebarForeground: "#E8E8E8",
            sidebarBorder: "#2F3F2F",
            glassBg: "rgba(30, 45, 30, 0.7)",
            glassBorder: "rgba(255, 255, 255, 0.05)",
            fontSans: "'Outfit', sans-serif",
            fontHeading: "'Outfit', sans-serif",
            fontSizeBase: "16px",
            lineHeightBase: "1.5",
            spacingBase: "4px",
            radiusBase: "16px",
        },
    },
};

export const defaultTheme: ThemeName = "default";
export const currentTheme = themes[defaultTheme];
