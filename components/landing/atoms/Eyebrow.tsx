import React from "react";

export interface EyebrowProps {
	children: React.ReactNode;
	className?: string;
}

export default function Eyebrow({ children, className }: EyebrowProps) {
	return (
		<span
			className={`inline-flex bg-linear-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent ${className || ""}`}
		>
			{children}
		</span>
	);
}


