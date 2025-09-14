import React from "react";

export interface SectionTitleProps {
	children: React.ReactNode;
	className?: string;
}

export default function SectionTitle({ children, className }: SectionTitleProps) {
	return (
		<h2
			className={`animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-900),var(--color-brand-600),var(--color-gray-800),var(--color-purple-600),var(--color-gray-900))] bg-[length:200%_auto] bg-clip-text text-transparent font-nacelle text-3xl font-semibold md:text-4xl ${className || ""}`}
		>
			{children}
		</h2>
	);
}


