const getEnv = (key: string, defaultValue: string = ""): string => {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
        return (import.meta as any).env[key] || defaultValue;
    }
    try {
        if (typeof process !== 'undefined' && process.env) {
            return process.env[key] || defaultValue;
        }
    } catch (e) { }
    return defaultValue;
};

export const siteConfig = {
    // --- General (General Tab) ---
    name: "MacroHR",
    description: "The ultimate all-in-one HR Management & Workforce Orchestration suite. Manage payroll, performance, and personnel with a single, high-fidelity platform.",
    url: "https://macrohr.com",
    creator: "@Web4strategy",
    keywords: ["hr management", "workforce automation", "payroll system", "employee registry", "performance tracking", "hr dashboard", "personnel dossiers", "talent management"],
    contactEmail: "hello@macrohr.com",
    githubUrl: "https://github.com/Interpoolx/MacroHR",
    twitterUrl: "https://x.com/web4strategy",
    websiteUrl: "https://web4strategy.com",
    version: "1.0.0",
    environment: "production" as "development" | "staging" | "production",
    demo_mode: "enabled" as "enabled" | "disabled",
    system_mode: (getEnv("VITE_SUPABASE_URL") && getEnv("VITE_SUPABASE_ANON_KEY")) ? "live" : "demo" as "demo" | "live",

    // --- Branding (Branding Tab) ---
    logo: {
        text: "MacroHR",
        icon: "A+",
        url: "/uploads/images/logo.png",
        favicon: "/uploads/images/favicon.png",
    },
    theme: {
        primaryColor: "#FF6B00", // Orange
        secondaryColor: "#000000", // Black
        accentColor: "#FFFFFF",
        darkMode: true,
    },

    // --- Backend & Auth (Backend & Auth Tab) ---
    local: {
        backendApiUrl: "http://localhost:3001",
        cloudFlareUrl: "http://localhost:3000",
        storageProvider: "local",
    },
    live: {
        backendApiUrl: "https://worker.macrohr.com",
        cloudFlareUrl: "https://web4strategy.com/",
        storageProvider: "cloudflare-r2",
    },
    database: {
        // Current approach: 'json' | Future: 'd1'
        provider: 'json' as 'json' | 'd1',
        d1: {
            database_id: '',
            binding: 'DB',
        },
        json: {
            dataDir: './public/json',
            seedDir: './public/json-seed',
        }
    },
    cloudflare: {
        r2: {
            bucketName: getEnv("VITE_R2_BUCKET_NAME"),
            accountId: getEnv("VITE_R2_ACCOUNT_ID"),
            accessKeyId: getEnv("VITE_R2_ACCESS_KEY_ID"),
            secretAccessKey: getEnv("VITE_R2_SECRET_ACCESS_KEY"), // Only secure on backend
            publicUrl: getEnv("VITE_R2_PUBLIC_URL"),
            binding: "BUCKET",
        },
        d1: {
            databaseId: getEnv("VITE_D1_DATABASE_ID"),
            binding: "DB",
        }
    },
    supabase: {
        url: getEnv("VITE_SUPABASE_URL"),
        anonKey: getEnv("VITE_SUPABASE_ANON_KEY"),
        serviceRoleKey: getEnv("SUPABASE_SERVICE_ROLE_KEY"), // Only secure on backend
    },
    auth: {
        providers: ["email", "google", "github"],
        enableMagicLink: true,
        sessionTimeout: 7200, // 2 hours in seconds
        requireEmailVerification: true,
        passwordMinLength: 8,
    },
    dbName: "macrohr_db",

    // --- Finance & Billing (Finance & Billing Tab) ---
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
        trialPeriod: 14, // days
    },

    // --- Navigation (Navigation Tab) ---
    nav: [
        { title: "Features", href: "#features" },
        { title: "How It Works", href: "#how-it-works" },
        { title: "Testimonials", href: "#testimonials" },
        { title: "FAQ", href: "#faq" },
    ],
    footer: {
        links: [
            {
                title: "Product",
                items: [
                    { title: "Features", href: "/features" },
                    { title: "Pricing", href: "/pricing" },
                    { title: "Changelog", href: "/changelog" },
                    { title: "Roadmap", href: "/roadmap" },
                ],
            },
            {
                title: "Resources",
                items: [
                    { title: "Documentation", href: "/docs" },
                    { title: "API Reference", href: "/api" },
                    { title: "Tutorials", href: "/tutorials" },
                    { title: "Blog", href: "/blog" },
                ],
            },
            {
                title: "Support",
                items: [
                    { title: "Help Center", href: "/help" },
                    { title: "Contact Us", href: "/contact" },
                    { title: "Status", href: "/status" },
                    { title: "Community", href: "/community" },
                ],
            },
            {
                title: "Legal",
                items: [
                    { title: "Privacy Policy", href: "/privacy" },
                    { title: "Terms of Service", href: "/terms" },
                    { title: "Cookie Policy", href: "/cookies" },
                ],
            },
        ],
    },

    // --- SEO (SEO Tab) ---
    seo: {
        homepageTitle: "MacroHR | Advanced Workforce Management & HR Analytics",
        homepageDescription: "Streamline your human resources with the MacroHR platform. Automated payroll, performance benchmarks, and deep workforce insights.",
        homepageOgImage: "/uploads/images/image_1766070918398.png",
        titleTemplate: "%s | MacroHR",
        descriptionDefault: "High-performance HR management suite for modern enterprise operations.",
        ogImageDefault: "/uploads/images/og-image.png",
        twitterHandle: "@macrohr",
        siteName: "MacroHR",
        locale: "en_US",
        robots: {
            index: true,
            follow: true,
        },
    },

    // --- Social (Social Tab) ---
    links: {
        twitter: "https://x.com/web4strategy",
        github: "https://github.com/Interpoolx/MacroHR",
        linkedin: "https://linkedin.com/company/web4strategy",
        youtube: "https://youtube.com/@web4strategy",
        discord: "https://discord.gg/web4strategy",
        producthunt: "",
    },

    // --- Analytics & Monitoring (Analytics Tab) ---
    analytics: {
        googleAnalyticsId: "",
        googleTagManagerId: "",
        mixpanelToken: "",
        amplitudeApiKey: "",
        hotjarId: "",
        clarity: {
            enabled: false,
            projectId: "",
        },
        plausible: {
            enabled: false,
            domain: "macrohr.com",
        },
    },
    monitoring: {
        sentry: {
            enabled: false,
            dsn: "",
            environment: "production",
            tracesSampleRate: 0.1,
        },
        logRocket: {
            enabled: false,
            appId: "",
        },
    },
    errorTracking: {
        enabled: true,
        reportToBackend: true,
        ignoredErrors: ["ResizeObserver loop limit exceeded"],
    },

    // --- Content Management (Content Tab) ---
    content: {
        blog: {
            enabled: true,
            apiEndpoint: "/api/blog",
            postsPerPage: 10,
        },
        changelog: {
            enabled: true,
            apiEndpoint: "/api/changelog",
        },
        documentation: {
            url: "https://",
            searchEnabled: true,
        },
        helpCenter: {
            url: "https://help",
            categories: ["Getting Started", "Features", "Troubleshooting", "API", "Billing"],
        },
        announcements: {
            enabled: true,
            apiEndpoint: "/api/announcements",
        },
    },

    // --- Legal & Compliance (Legal Tab) ---
    legal: {
        termsOfService: {
            url: "/terms",
            lastUpdated: "2025-12-18",
        },
        privacyPolicy: {
            url: "/privacy",
            lastUpdated: "2025-12-18",
        },
        cookiePolicy: {
            url: "/cookies",
            lastUpdated: "2025-12-18",
        },
        gdpr: {
            enabled: true,
            dataRetentionDays: 365,
            cookieConsentRequired: true,
        },
        ccpa: {
            enabled: true,
            doNotSellLink: "/do-not-sell",
        },
        ageRestriction: {
            minimumAge: 13,
            requireVerification: false,
        },
        dataExport: {
            enabled: true,
            endpoint: "/api/user/export",
        },
        dataDelition: {
            enabled: true,
            endpoint: "/api/user/delete",
        },
    },

    // --- Support & Help (Support Tab) ---
    support: {
        email: "support@macrohr.com",
        helpCenterUrl: "https://help.",
        documentationUrl: "https://docs.",
        communityForumUrl: "https://community.",
        statusPageUrl: "https://status.",
        liveChat: {
            enabled: false,
            provider: "intercom" as "intercom" | "zendesk" | "crisp" | "tawk",
            appId: "",
        },
        ticketSystem: {
            enabled: true,
            endpoint: "/api/support/tickets",
        },
        feedbackWidget: {
            enabled: true,
            position: "bottom-right" as "bottom-right" | "bottom-left" | "top-right" | "top-left",
        },
        faq: {
            enabled: true,
            items: [
                {
                    question: "How do I deploy MacroHR?",
                    answer: "Use our one-click deployment to Cloudflare Workers or host on-premise with our Docker images.",
                },
                {
                    question: "Does it support Multi-Role Access?",
                    answer: "Yes, MacroHR is built with granular role-based access control (RBAC) for Admins, Managers, and Employees.",
                },
            ],
        },
    },

    // --- Notifications & Communications (Notifications Tab) ---
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
        inApp: {
            enabled: true,
            pollInterval: 60000, // 1 minute
            maxNotifications: 50,
        },
        banner: {
            enabled: false,
            message: "",
            type: "info" as "info" | "warning" | "success" | "error",
            dismissible: true,
        },
        newsletter: {
            enabled: true,
            provider: "mailchimp",
            apiKey: "",
            listId: "",
        },
    },

    // --- Feature Flags & Experiments (Features Tab) ---
    features: {
        betaFeatures: {
            enabled: false,
            features: [
                { id: "ai-assistant", name: "AI Assistant", enabled: false },
                { id: "bulk-export", name: "Bulk Export", enabled: false },
                { id: "team-collaboration", name: "Team Collaboration", enabled: false },
            ],
        },
        experimentalFeatures: {
            enabled: false,
            features: [],
        },
        rollout: {
            gradualEnabled: false,
            percentage: 10, // Rollout to 10% of users initially
        },
        maintenance: {
            enabled: false,
            message: "We're currently performing maintenance. We'll be back shortly!",
        },
    },

    // --- Localization & i18n (Localization Tab) ---
    localization: {
        defaultLanguage: "en",
        supportedLanguages: [
            { code: "en", name: "English", flag: "🇺🇸" },
            { code: "es", name: "Español", flag: "🇪🇸" },
            { code: "fr", name: "Français", flag: "🇫🇷" },
            { code: "de", name: "Deutsch", flag: "🇩🇪" },
            { code: "ja", name: "日本語", flag: "🇯🇵" },
        ],
        autoDetect: true,
        fallbackLanguage: "en",
        translationService: {
            provider: "i18next",
            apiKey: "",
        },
        dateFormat: "MM/DD/YYYY",
        timeFormat: "12h" as "12h" | "24h",
        currency: "USD",
        numberFormat: "en-US",
    },

    // --- Storage & Assets (Storage Tab) ---
    storage: {
        provider: "local" as "cloudflare-r2" | "aws-s3" | "cloudinary" | "local",
        bucket: "macrohr",
        region: "auto",
        publicUrl: "",
        limits: {
            maxFileSize: 10485760, // 10MB in bytes
            maxFilesPerUser: 1000,
            allowedFileTypes: [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp", ".pdf"],
        },
        imageOptimization: {
            enabled: true,
            quality: 85,
            formats: ["webp", "avif"],
            responsive: true,
        },
    },

    // --- Security (Security Tab) ---
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
            windowMs: 900000, // 15 minutes
            maxRequests: 100,
            message: "Too many requests, please try again later.",
        },
        apiKeys: {
            rotation: {
                enabled: false,
                intervalDays: 90,
            },
        },
        ipWhitelist: {
            enabled: false,
            ips: [],
        },
        webhookVerification: {
            enabled: true,
            secretKey: "",
        },
        encryption: {
            algorithm: "aes-256-gcm",
            enabled: true,
        },
    },

    // --- Performance (Performance Tab) ---
    performance: {
        cache: {
            enabled: true,
            ttl: 3600, // 1 hour in seconds
            strategy: "stale-while-revalidate" as "cache-first" | "network-first" | "stale-while-revalidate",
        },
        lazyLoading: {
            enabled: true,
            threshold: 0.1,
        },
        compression: {
            enabled: true,
            type: "gzip" as "gzip" | "brotli",
        },
        budgets: {
            javascript: 500, // KB
            css: 100, // KB
            images: 1000, // KB
            fonts: 200, // KB
        },
        preload: {
            enabled: true,
            resources: ["/fonts/main.woff2", "/images/logo.svg"],
        },
    },

    // --- Developer & Testing (Developer Tab) ---
    developer: {
        debugMode: false,
        staging: {
            enabled: true,
            url: "https://staging.macrohr.com",
            apiUrl: "https://staging-api.macrohr.com",
        },
        testing: {
            enabled: true,
            testApiUrl: "https://test-api.macrohr.com",
        },
        apiVersioning: {
            current: "v1",
            supported: ["v1"],
            deprecationNotice: "",
        },
        webhooks: {
            testEndpoint: "https://webhook.site/test",
            retryAttempts: 3,
            timeout: 5000, // ms
        },
        logging: {
            level: "info" as "debug" | "info" | "warn" | "error",
            enabled: true,
            console: true,
            remote: false,
        },
    },

    // --- Changelog & Updates (Updates Tab) ---
    updates: {
        changelog: {
            enabled: true,
            url: "/changelog",
            apiEndpoint: "/api/changelog",
        },
        notifications: {
            showOnUpdate: true,
            showInApp: true,
            sendEmail: false,
        },
        autoUpdate: {
            enabled: true,
            checkInterval: 86400000, // 24 hours in ms
        },
        versionHistory: [
            {
                version: "1.0.0",
                date: "2025-12-18",
                changes: ["Initial release"],
                breaking: false,
            },
        ],
        deprecations: [],
        migrationGuides: {
            enabled: true,
            url: "/docs/migrations",
        },
    },
};

export type SiteConfig = typeof siteConfig;