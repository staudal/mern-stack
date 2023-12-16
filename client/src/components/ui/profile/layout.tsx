import { SidebarNav } from "../profile/sidebar-nav";

const sidebarNavItems = [
	{
		title: "Profile",
		href: "/profile",
	},
	{
		title: "Account",
		href: "/account",
	},
	{
		title: "Appearance",
		href: "/examples/forms/appearance",
	},
	{
		title: "Notifications",
		href: "/examples/forms/notifications",
	},
	{
		title: "Display",
		href: "/examples/forms/display",
	},
];

interface SettingsLayoutProps {
	children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
	return (
		<>
			<div className="mx-auto max-w-7xl py-6 px-6 lg:px-8 gap-6 flex flex-col">
				<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
					<aside className="-mx-4 lg:w-1/5">
						<SidebarNav items={sidebarNavItems} />
					</aside>
					<div className="flex-1 lg:max-w-2xl">{children}</div>
				</div>
			</div>
		</>
	);
}
