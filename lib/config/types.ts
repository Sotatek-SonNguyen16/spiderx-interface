export type AppEnvironment = "development" | "staging" | "production";

export interface AppBranding {
	name: string;
	shortName?: string;
	tagline?: string;
	description: string;
	domain: string;
	siteUrl: string;
	supportEmail?: string;
	contactEmail?: string;
	twitter?: string;
	github?: string;
	linkedin?: string;
	logo: {
		light: string;
		dark?: string;
		square?: string;
	};
}

export interface AppSeo {
	defaultTitle: string;
	defaultDescription: string;
	titleTemplate?: string;
	keywords?: string[];
	ogImage?: string;
	twitterHandle?: string;
}

export interface AppConfig {
	env: AppEnvironment;
	branding: AppBranding;
	seo: AppSeo;
	urls: {
		site: string;
		app?: string;
		api?: string;
		terms?: string;
		privacy?: string;
		status?: string;
		helpCenter?: string;
	};
	analytics?: {
		googleAnalyticsId?: string;
		posthogKey?: string;
		posthogHost?: string;
	};
}


