import React from "react";
import Eyebrow from "@/components/landing/atoms/Eyebrow";
import SectionTitle from "@/components/landing/atoms/SectionTitle";

export interface SectionHeaderProps {
	eyebrow?: React.ReactNode;
	title: React.ReactNode;
	description?: React.ReactNode;
	align?: "left" | "center";
	className?: string;
}

export default function SectionHeader({ eyebrow, title, description, align = "center", className }: SectionHeaderProps) {
	return (
		<div className={`mx-auto max-w-3xl ${align === "center" ? "text-center" : "text-left"} ${className || ""}`}>
			{eyebrow && (
				<div className={`inline-flex items-center gap-3 pb-3 ${align === "center" ? "justify-center" : ""}`}>
					<Eyebrow>{eyebrow}</Eyebrow>
				</div>
			)}
			<SectionTitle className="pb-4">{title}</SectionTitle>
			{description && <p className="text-lg text-gray-600">{description}</p>}
		</div>
	);
}


