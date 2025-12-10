import { AppConfig, AppEnvironment } from "./types";

function getEnv(): AppEnvironment {
	if (process.env.NEXT_PUBLIC_APP_ENV === "staging") return "staging";
	if (process.env.NODE_ENV === "production") return "production";
	return "development";
}

const defaultSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
const siteDomain = process.env.NEXT_PUBLIC_SITE_DOMAIN || new URL(defaultSiteUrl).hostname;

const baseConfig: AppConfig = {
	env: getEnv(),
	branding: {
		name: "SpiderX",
		shortName: "SpiderX",
		tagline: "Web intelligence, automated.",
		description: "SpiderX is a SaaS platform for web automation and data workflows.",
		domain: siteDomain,
		siteUrl: defaultSiteUrl,
		supportEmail: "support@" + siteDomain,
		contactEmail: "hello@" + siteDomain,
		logo: {
			light: "/images/logo.svg",
			square: "/images/logo.svg",
		},
	},
	seo: {
		defaultTitle: "SpiderX",
		defaultDescription: "Web intelligence, automated.",
		titleTemplate: "%s | SpiderX",
		keywords: ["spiderx", "automation", "web", "data", "workflows"],
		ogImage: "/images/og-image.png",
	},
	urls: {
		site: defaultSiteUrl,
		app: process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, ""),
		api: process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, ""),
		terms: `${defaultSiteUrl}/legal/terms`,
		privacy: `${defaultSiteUrl}/legal/privacy`,
		status: process.env.NEXT_PUBLIC_STATUS_URL,
		helpCenter: process.env.NEXT_PUBLIC_HELP_CENTER_URL,
	},
	analytics: {
		googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
		posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
		posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST,
	},
};

export const config: AppConfig = baseConfig;

export type { AppConfig };


