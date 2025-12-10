import React from "react";

export interface FeatureItemProps {
	icon: React.ReactNode;
	title: string;
	description: string;
}

export default function FeatureItem({ icon, title, description }: FeatureItemProps) {
	return (
		<article className="bg-brand-50 rounded-2xl p-4 shadow-md">
			<div className="mb-3">{icon}</div>
			<h3 className="mb-1 font-nacelle text-[1rem] font-semibold text-ink">{title}</h3>
			<p className="text-gray-600">{description}</p>
		</article>
	);
}


