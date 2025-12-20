// src/config/modules/index.ts

import { hrModule } from "./hr.config";
import { legalModule } from "./legal.config";
// Add more modules here later

export const modules = {
    hr: hrModule,
    legal: legalModule,
} as const;

export type ModuleName = keyof typeof modules;

// === CORRECTED ModuleConfig with readonly where needed ===
export type ModuleConfig = {
    // General (all readonly because of `as const`)
    readonly name: string;
    readonly description: string;
    readonly url: string;
    readonly creator: string;
    readonly keywords: readonly string[];
    readonly contactEmail: string;
    readonly githubUrl: string;
    readonly twitterUrl: string;
    readonly websiteUrl: string;
    readonly version: string;

    // Branding
    readonly logo: {
        readonly text: string;
        readonly icon: string;
        readonly url: string;
        readonly favicon: string;
    };

    // Navigation (landing page)
    readonly nav: readonly { title: string; href: string }[];

    // Footer
    readonly footer: {
        readonly links: readonly {
            readonly title: string;
            readonly items: readonly { title: string; href: string }[];
        }[];
    };

    // SEO
    readonly seo: {
        readonly homepageTitle: string;
        readonly homepageDescription: string;
        readonly homepageOgImage: string;
        readonly titleTemplate: string;
        readonly descriptionDefault: string;
        readonly ogImageDefault: string;
        readonly twitterHandle: string;
        readonly siteName: string;
        readonly locale: string;
        readonly robots: { readonly index: boolean; readonly follow: boolean };
    };

    // Social
    readonly links: {
        readonly twitter: string;
        readonly github: string;
        readonly linkedin: string;
        readonly youtube: string;
        readonly discord: string;
        readonly producthunt: string;
    };

    // Support
    readonly support: {
        readonly email: string;
        readonly helpCenterUrl: string;
        readonly documentationUrl: string;
        readonly communityForumUrl: string;
        readonly statusPageUrl: string;
        readonly liveChat: {
            readonly enabled: boolean;
            readonly provider: "intercom" | "zendesk" | "crisp" | "tawk";
            readonly appId: string;
        };
        readonly ticketSystem: {
            readonly enabled: boolean;
            readonly endpoint: string;
        };
        readonly feedbackWidget: {
            readonly enabled: boolean;
            readonly position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
        };
        readonly faq: {
            readonly enabled: boolean;
            readonly items: readonly { question: string; answer: string }[];
        };
    };

    readonly sidebarNav: readonly {
        to: string;
        label: string;
        icon: React.ElementType;
        managerOnly?: boolean;
        userOnly?: boolean;
    }[];

    // Homepage Features
    readonly features?: readonly {
        readonly title: string;
        readonly description: string;
        readonly emoji: string;
        readonly icon: string;
    }[];
};

// Helper to get current module with correct return type
export const getCurrentModule = (name: ModuleName): ModuleConfig => modules[name];