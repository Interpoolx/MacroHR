// src/config/modules/hr.config.ts

import {
    LayoutDashboard,
    Users,
    Receipt,
    CalendarCheck,
    FileText,
    Gift,
    TrendingUp,
    User,
    Briefcase,
    Settings,
    LifeBuoy,
} from 'lucide-react';

export const hrModule = {
    // --- General ---
    name: "MacroHR",
    description:
        "The ultimate all-in-one HR Management & Workforce Orchestration suite. Manage payroll, performance, and personnel with a single, high-fidelity platform.",
    url: "https://macrohr.com",
    creator: "@Web4strategy",
    keywords: [
        "hr management",
        "workforce automation",
        "payroll system",
        "employee registry",
        "performance tracking",
        "hr dashboard",
        "personnel dossiers",
        "talent management",
    ],
    contactEmail: "hello@macrohr.com",
    githubUrl: "https://github.com/Interpoolx/MacroHR",
    twitterUrl: "https://x.com/web4strategy",
    websiteUrl: "https://web4strategy.com",
    version: "1.0.0",

    // --- Branding ---
    logo: {
        text: "MacroHR",
        icon: "A+",
        url: "/uploads/images/logo.png",
        favicon: "/uploads/images/favicon.png",
    },

    // --- Navigation (Landing Page) ---
    nav: [
        { title: "Features", href: "#features" },
        { title: "How It Works", href: "#how-it-works" },
        { title: "Testimonials", href: "#testimonials" },
        { title: "FAQ", href: "#faq" },
    ],

    // --- Footer ---
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

    // --- Features (Homepage) ---
    features: [
        {
            title: "Payroll Engine",
            description: "Automated, high-fidelity payroll processing with multi-currency support and tax compliance.",
            emoji: "💰",
            icon: "Receipt"
        },
        {
            title: "Workforce Analytics",
            description: "Deep insights into employee performance, engagement, and retention with AI forecasting.",
            emoji: "📊",
            icon: "TrendingUp"
        },
        {
            title: "Talent Orchestration",
            description: "Streamlined recruitment and onboarding workflows designed for high-growth teams.",
            emoji: "🧬",
            icon: "Users"
        }
    ],

    // --- SEO ---
    seo: {
        homepageTitle: "MacroHR | Advanced Workforce Management & HR Analytics",
        homepageDescription:
            "Streamline your human resources with the MacroHR platform. Automated payroll, performance benchmarks, and deep workforce insights.",
        homepageOgImage: "/uploads/images/image_1766070918398.png",
        titleTemplate: "%s | MacroHR",
        descriptionDefault:
            "High-performance HR management suite for modern enterprise operations.",
        ogImageDefault: "/uploads/images/og-image.png",
        twitterHandle: "@macrohr",
        siteName: "MacroHR",
        locale: "en_US",
        robots: {
            index: true,
            follow: true,
        },
    },

    // --- Social Links ---
    links: {
        twitter: "https://x.com/web4strategy",
        github: "https://github.com/Interpoolx/MacroHR",
        linkedin: "https://linkedin.com/company/web4strategy",
        youtube: "https://youtube.com/@web4strategy",
        discord: "https://discord.gg/web4strategy",
        producthunt: "",
    },

    // --- Support & Help ---
    support: {
        email: "support@macrohr.com",
        helpCenterUrl: "https://help.macrohr.com",
        documentationUrl: "https://docs.macrohr.com",
        communityForumUrl: "https://community.macrohr.com",
        statusPageUrl: "https://status.macrohr.com",
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
                    answer:
                        "Use our one-click deployment to Cloudflare Workers or host on-premise with our Docker images.",
                },
                {
                    question: "Does it support Multi-Role Access?",
                    answer:
                        "Yes, MacroHR is built with granular role-based access control (RBAC) for Admins, Managers, and Employees.",
                },
            ],
        },
    },

    // --- App Sidebar Navigation (Authenticated Dashboard) ---
    sidebarNav: [
        { to: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/user/modules/hr/people", label: "People", icon: Users, managerOnly: true },
        { to: "/user/modules/hr/payslip", label: "Payslips", icon: Receipt, managerOnly: true },
        { to: "/user/modules/hr/attendance", label: "Attendance", icon: CalendarCheck },
        { to: "/user/modules/hr/tasks", label: "My Tasks", icon: FileText, userOnly: true },
        { to: "/user/modules/hr/benefits", label: "Benefits", icon: Gift, managerOnly: true },
        { to: "/user/modules/hr/performance", label: "Performance", icon: TrendingUp, managerOnly: true },
        { to: "/user/modules/hr/personal", label: "Personal Details", icon: User, managerOnly: true },
        { to: "/user/modules/hr/job-reference", label: "Job Reference", icon: Briefcase, managerOnly: true },
        { to: "/user/modules/hr/documents", label: "Documents", icon: FileText, managerOnly: true },
        { to: "/user/modules/hr/settings", label: "Settings", icon: Settings, managerOnly: true },
        { to: "/user/modules/hr/support", label: "Support", icon: LifeBuoy, managerOnly: true },
    ] as const,
} as const;

export type HRModuleConfig = typeof hrModule;