// src/config/modules/legal.config.ts

import {
    LayoutDashboard,
    Gavel,
    FileText,
    Briefcase,
    Users,
    Receipt,
    CalendarCheck,
    TrendingUp,
    User,
    Settings,
    LifeBuoy,
} from 'lucide-react';

export const legalModule = {
    // --- General ---
    name: "MacroLegal",
    description:
        "The comprehensive all-in-one legal case management, contract automation, and compliance platform. Streamline matters, documents, billing, and team collaboration with a modern, high-performance solution.",
    url: "https://macrolegal.com",
    creator: "@Web4strategy",
    keywords: [
        "legal case management",
        "matter management",
        "contract automation",
        "legal billing",
        "document management",
        "compliance platform",
        "law firm software",
        "legal operations",
        "e-billing",
        "client portal",
    ],
    contactEmail: "hello@macrolegal.com",
    githubUrl: "https://github.com/Interpoolx/MacroLegal",
    twitterUrl: "https://x.com/web4strategy",
    websiteUrl: "https://web4strategy.com",
    version: "1.0.0",

    // --- Branding ---
    logo: {
        text: "MacroLegal",
        icon: "⚖️",
        url: "/uploads/images/legal-logo.png",
        favicon: "/uploads/images/legal-favicon.png",
    },

    // --- Navigation (Landing Page) ---
    nav: [
        { title: "Features", href: "#features" },
        { title: "Case Management", href: "#case-management" },
        { title: "Pricing", href: "#pricing" },
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
                    { title: "Case Management", href: "/case-management" },
                    { title: "Document Automation", href: "/document-automation" },
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
                    { title: "Webinars", href: "/webinars" },
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
                    { title: "Security", href: "/security" },
                ],
            },
        ],
    },

    // --- SEO ---
    seo: {
        homepageTitle: "MacroLegal | Comprehensive Legal Case Management & Operations Platform",
        homepageDescription:
            "Empower your law firm or legal department with MacroLegal. Advanced case tracking, document management, automated workflows, billing, and compliance tools in one secure platform.",
        homepageOgImage: "/uploads/images/legal-og-image.png",
        titleTemplate: "%s | MacroLegal",
        descriptionDefault:
            "Modern legal practice management software for efficient matter handling, client collaboration, and firm growth.",
        ogImageDefault: "/uploads/images/legal-og-default.png",
        twitterHandle: "@macrolegal",
        siteName: "MacroLegal",
        locale: "en_US",
        robots: {
            index: true,
            follow: true,
        },
    },

    // --- Social Links ---
    links: {
        twitter: "https://x.com/web4strategy",
        github: "https://github.com/Interpoolx/MacroLegal",
        linkedin: "https://linkedin.com/company/web4strategy",
        youtube: "https://youtube.com/@web4strategy",
        discord: "https://discord.gg/web4strategy",
        producthunt: "",
    },

    // --- Support & Help ---
    support: {
        email: "support@macrolegal.com",
        helpCenterUrl: "https://help.macrolegal.com",
        documentationUrl: "https://docs.macrolegal.com",
        communityForumUrl: "https://community.macrolegal.com",
        statusPageUrl: "https://status.macrolegal.com",
        liveChat: {
            enabled: true, // Legal teams often prefer live support
            provider: "intercom" as "intercom" | "zendesk" | "crisp" | "tawk",
            appId: "", // Fill in when integrating
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
                    question: "Is MacroLegal compliant with data privacy laws like GDPR and CCPA?",
                    answer:
                        "Yes, MacroLegal is fully compliant with GDPR, CCPA, and other major data protection regulations. We implement encryption, access controls, and audit logs by default.",
                },
                {
                    question: "Can I import existing matters and documents from my current system?",
                    answer:
                        "Absolutely. MacroLegal supports seamless data migration from popular platforms like Clio, PracticePanther, MyCase, and CSV/Excel exports. Our onboarding team assists at no extra cost on Pro plans.",
                },
                {
                    question: "Does MacroLegal support e-signatures and client portals?",
                    answer:
                        "Yes — built-in secure client portal with e-signature integration (compatible with DocuSign and HelloSign), document sharing, and real-time matter updates.",
                },
                {
                    question: "Is my data encrypted and secure?",
                    answer:
                        "All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We undergo regular security audits and offer SOC 2 Type II compliance on Enterprise plans.",
                },
            ],
        },
    },

    // --- Features (Homepage) ---
    features: [
        {
            title: "Smart Matter Hub",
            description: "Centralized case management with logic-driven lifecycles for every legal department.",
            emoji: "⚖️",
            icon: "Gavel"
        },
        {
            title: "Contract Robotics",
            description: "Automated template generation and AI-powered contract review workflows.",
            emoji: "🤖",
            icon: "FileText"
        },
        {
            title: "Dynamic Entity Tracking",
            description: "Real-time compliance monitoring and corporate record management for global entities.",
            emoji: "💼",
            icon: "Shield"
        }
    ],

    // --- App Sidebar Navigation (Authenticated Dashboard) ---
    sidebarNav: [
        { to: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/user/matters", label: "Matters", icon: Gavel, managerOnly: true },
        { to: "/user/modules/hr/documents", label: "Documents", icon: FileText, managerOnly: true },
        { to: "/user/modules/hr/people", label: "People", icon: Users, managerOnly: true },
        { to: "/user/billing", label: "Billing", icon: Receipt, managerOnly: true },
        { to: "/user/calendar", label: "Calendar", icon: CalendarCheck },
        { to: "/user/modules/hr/tasks", label: "My Tasks", icon: FileText, userOnly: true },
        { to: "/user/modules/hr/performance", label: "Performance", icon: TrendingUp, managerOnly: true },
        { to: "/user/modules/hr/personal", label: "Personal Details", icon: User, managerOnly: true },
        { to: "/user/modules/hr/job-reference", label: "Reference", icon: Briefcase, managerOnly: true },
        { to: "/user/modules/hr/settings", label: "Settings", icon: Settings, managerOnly: true },
        { to: "/user/modules/hr/support", label: "Support", icon: LifeBuoy, managerOnly: true },
    ] as const,
} as const;

export type LegalModuleConfig = typeof legalModule;