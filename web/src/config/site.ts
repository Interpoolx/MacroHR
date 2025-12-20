// src/config/site.ts

import { getCurrentModule, type ModuleName, type ModuleConfig } from "./modules";
import { defaultTheme, type ThemeName } from "@shared/lib/themes";
import { getEnv } from "@shared/config/env";

// === SELECTED CONFIGURATION ===
// Change these to switch between modules/themes
export const currentModule: ModuleName = "hr"; // "hr" | "legal" | ...
export const currentTheme: ThemeName = defaultTheme; // e.g., "default" | "oak" | "olive"

// === DERIVED: Current Module Config ===
export const moduleConfig: ModuleConfig = getCurrentModule(currentModule);

// === MAIN EXPORT: Combined Global + Module Config ===
export const siteConfig = {
    // --- Runtime / Environment ---
    environment: "production" as "development" | "staging" | "production",
    demo_mode: "enabled" as "enabled" | "disabled",
    system_mode: (getEnv("VITE_SUPABASE_URL") && getEnv("VITE_SUPABASE_ANON_KEY"))
        ? "live"
        : "demo" as "demo" | "live",

    // --- Active Selections ---
    currentModule: currentModule as ModuleName,
    currentTheme: currentTheme as ThemeName,

    // --- Module-Specific Content (branding, nav, seo, support, sidebar, etc.) ---
    module: moduleConfig as ModuleConfig,

    // --- Backend & Infrastructure ---
    local: {
        backendApiUrl: "http://localhost:3001",
        cloudFlareUrl: "http://localhost:3000",
        storageProvider: "local" as const,
    },
    live: {
        backendApiUrl: "https://worker.macrohr.com",
        cloudFlareUrl: "https://web4strategy.com/",
        storageProvider: "cloudflare-r2" as const,
    },

    database: {
        provider: "d1" as "json" | "d1",
        d1: {
            database_id: "",
            binding: "DB",
        },
    },

    cloudflare: {
        r2: {
            bucketName: getEnv("VITE_R2_BUCKET_NAME"),
            accountId: getEnv("VITE_R2_ACCOUNT_ID"),
            accessKeyId: getEnv("VITE_R2_ACCESS_KEY_ID"),
            secretAccessKey: getEnv("VITE_R2_SECRET_ACCESS_KEY"),
            publicUrl: getEnv("VITE_R2_PUBLIC_URL"),
            binding: "BUCKET",
        },
        d1: {
            databaseId: getEnv("VITE_D1_DATABASE_ID"),
            binding: "DB",
        },
    },

    supabase: {
        url: getEnv("VITE_SUPABASE_URL"),
        anonKey: getEnv("VITE_SUPABASE_ANON_KEY"),
        serviceRoleKey: getEnv("SUPABASE_SERVICE_ROLE_KEY"),
    },

    // --- Authentication ---
    auth: {
        providers: ["email", "google", "github"] as const,
        enableMagicLink: true,
        sessionTimeout: 7200, // 2 hours
        requireEmailVerification: true,
        passwordMinLength: 8,
    },

    dbName: "macrohr_db",

    // --- Billing & Plans ---
    billing: {
        mode: "test" as "test" | "live",
        accessToken: "",
        organizationId: "",
        webhookSecret: "",
        currency: "USD",
        plans: {
            free: {
                name: "Free",
                price: 0,
                features: ["Basic inspection", "Limited exports", "Community support"],
            },
            pro: {
                name: "Pro",
                price: 9.99,
                features: ["Unlimited inspection", "Bulk exports", "Priority support", "Advanced SEO tools"],
            },
            team: {
                name: "Team",
                price: 29.99,
                features: ["Everything in Pro", "Team collaboration", "Custom integrations", "Dedicated support"],
            },
        },
        trialPeriod: 14,
    },

    // --- Analytics & Monitoring ---
    analytics: {
        googleAnalyticsId: "",
        googleTagManagerId: "",
        mixpanelToken: "",
        amplitudeApiKey: "",
        hotjarId: "",
        clarity: { enabled: false, projectId: "" },
        plausible: { enabled: false, domain: "macrohr.com" },
    },

    monitoring: {
        sentry: {
            enabled: false,
            dsn: "",
            environment: "production",
            tracesSampleRate: 0.1,
        },
        logRocket: { enabled: false, appId: "" },
    },

    errorTracking: {
        enabled: true,
        reportToBackend: true,
        ignoredErrors: ["ResizeObserver loop limit exceeded"],
    },

    // --- Content Management ---
    content: {
        blog: { enabled: true, apiEndpoint: "/api/blog", postsPerPage: 10 },
        changelog: { enabled: true, apiEndpoint: "/api/changelog" },
        documentation: { url: "https://", searchEnabled: true },
        helpCenter: {
            url: "https://help",
            categories: ["Getting Started", "Features", "Troubleshooting", "API", "Billing"],
        },
        announcements: { enabled: true, apiEndpoint: "/api/announcements" },
    },

    // --- Legal & Compliance ---
    legal: {
        termsOfService: { url: "/terms", lastUpdated: "2025-12-18" },
        privacyPolicy: { url: "/privacy", lastUpdated: "2025-12-18" },
        cookiePolicy: { url: "/cookies", lastUpdated: "2025-12-18" },
        gdpr: { enabled: true, dataRetentionDays: 365, cookieConsentRequired: true },
        ccpa: { enabled: true, doNotSellLink: "/do-not-sell" },
        ageRestriction: { minimumAge: 13, requireVerification: false },
        dataExport: { enabled: true, endpoint: "/api/user/export" },
        dataDelition: { enabled: true, endpoint: "/api/user/delete" },
    },

    // --- Notifications ---
    notifications: {
        email: {
            provider: "sendgrid" as "sendgrid" | "mailchimp" | "resend" | "postmark",
            apiKey: "",
            fromEmail: "noreply@",
            fromName: "MacroHR Team",
        },
        push: {
            enabled: false,
            provider: "onesignal" as "onesignal" | "firebase" | "pusher",
            appId: "",
        },
        inApp: { enabled: true, pollInterval: 60000, maxNotifications: 50 },
        banner: {
            enabled: false,
            message: "",
            type: "info" as "info" | "warning" | "success" | "error",
            dismissible: true,
        },
        newsletter: { enabled: true, provider: "mailchimp", apiKey: "", listId: "" },
    },

    // --- Features & Flags ---
    features: {
        betaFeatures: {
            enabled: false,
            features: [
                { id: "ai-assistant", name: "AI Assistant", enabled: false },
                { id: "bulk-export", name: "Bulk Export", enabled: false },
                { id: "team-collaboration", name: "Team Collaboration", enabled: false },
            ],
        },
        experimentalFeatures: { enabled: false, features: [] },
        rollout: { gradualEnabled: false, percentage: 10 },
        maintenance: {
            enabled: false,
            message: "We're currently performing maintenance. We'll be back shortly!",
        },
    },

    // --- Localization ---
    localization: {
        defaultLanguage: "en",
        supportedLanguages: [
            { code: "en", name: "English", flag: "US" },
            { code: "es", name: "Español", flag: "ES" },
            { code: "fr", name: "Français", flag: "FR" },
            { code: "de", name: "Deutsch", flag: "DE" },
            { code: "ja", name: "日本語", flag: "JP" },
        ],
        autoDetect: true,
        fallbackLanguage: "en",
        translationService: { provider: "i18next", apiKey: "" },
        dateFormat: "MM/DD/YYYY",
        timeFormat: "12h" as "12h" | "24h",
        currency: "USD",
        numberFormat: "en-US",
    },

    // --- Storage ---
    storage: {
        provider: "local" as "cloudflare-r2" | "aws-s3" | "cloudinary" | "local",
        bucket: "macrohr",
        region: "auto",
        publicUrl: "",
        limits: {
            maxFileSize: 10485760,
            maxFilesPerUser: 1000,
            allowedFileTypes: [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp", ".pdf"],
        },
        imageOptimization: { enabled: true, quality: 85, formats: ["webp", "avif"], responsive: true },
    },

    // --- Security ---
    security: {
        cors: {
            enabled: true,
            allowedOrigins: ["https://macrohr.com", "http://localhost:3000"],
            allowedMethods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true,
        },
        csp: {
            enabled: true,
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", ""],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
        rateLimit: {
            enabled: true,
            windowMs: 900000,
            maxRequests: 100,
            message: "Too many requests, please try again later.",
        },
        apiKeys: { rotation: { enabled: false, intervalDays: 90 } },
        ipWhitelist: { enabled: false, ips: [] },
        webhookVerification: { enabled: true, secretKey: "" },
        encryption: { algorithm: "aes-256-gcm", enabled: true },
    },

    // --- Performance ---
    performance: {
        cache: {
            enabled: true,
            ttl: 3600,
            strategy: "stale-while-revalidate" as "cache-first" | "network-first" | "stale-while-revalidate",
        },
        lazyLoading: { enabled: true, threshold: 0.1 },
        compression: { enabled: true, type: "gzip" as "gzip" | "brotli" },
        budgets: { javascript: 500, css: 100, images: 1000, fonts: 200 },
        preload: { enabled: true, resources: ["/fonts/main.woff2", "/images/logo.svg"] },
    },

    // --- Developer Tools ---
    developer: {
        debugMode: false,
        staging: { enabled: true, url: "https://staging.macrohr.com", apiUrl: "https://staging-api.macrohr.com" },
        testing: { enabled: true, testApiUrl: "https://test-api.macrohr.com" },
        apiVersioning: { current: "v1", supported: ["v1"], deprecationNotice: "" },
        webhooks: { testEndpoint: "https://webhook.site/test", retryAttempts: 3, timeout: 5000 },
        logging: {
            level: "info" as "debug" | "info" | "warn" | "error",
            enabled: true,
            console: true,
            remote: false,
        },
    },

    // --- Updates & Changelog ---
    updates: {
        changelog: { enabled: true, url: "/changelog", apiEndpoint: "/api/changelog" },
        notifications: { showOnUpdate: true, showInApp: true, sendEmail: false },
        autoUpdate: { enabled: true, checkInterval: 86400000 },
        versionHistory: [
            { version: "1.0.0", date: "2025-12-18", changes: ["Initial release"], breaking: false },
        ],
        deprecations: [],
        migrationGuides: { enabled: true, url: "/docs/migrations" },
    },
};

// Optional: Export type for use elsewhere
export type SiteConfig = typeof siteConfig;