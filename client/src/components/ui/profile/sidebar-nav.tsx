import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import { cn } from "../../../lib/lib";
import { buttonVariants } from "../button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
	items: {
		href: string;
		title: string;
	}[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
	const { pathname } = useLocation();

	return (
		<nav className={cn("flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1", className)} {...props}>
			{items.map((item) => (
				<Link
					key={item.href}
					to={item.href}
					className={cn(buttonVariants({ variant: "ghost" }), pathname === item.href ? "bg-gray-100 hover:bg-muted" : "hover:bg-gray-100", "justify-start")}
				>
					{item.title}
				</Link>
			))}
		</nav>
	);
}
