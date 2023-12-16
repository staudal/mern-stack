import { useContext, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "./dropdown-menu";
import { UserContext } from "../../App";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function UserNav() {
	const userContext = useContext(UserContext);
	if (!userContext) return null;
	const { setIsLoggedIn, user, imageUrl } = userContext;
	const navigate = useNavigate();

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if ((e.key === "," && e.metaKey) || (e.key === "," && e.ctrlKey)) {
				e.preventDefault();
				navigate("/profile");
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	});

	async function logoutUser() {
		const toastId = toast.loading("Logging out...");
		await user
			?.logOut()
			.then(() => {
				setIsLoggedIn(false);
				toast.success("Logged out!", { id: toastId });
			})
			.catch(() => {
				toast.error("Failed to log out", { id: toastId });
			});
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-10 w-10 rounded-full">
					<Avatar className="h-10 w-10 shadow-sm">
						<AvatarImage className="border rounded-full" src={imageUrl} alt="@shadcn" />
						<AvatarFallback className="bg-slate-900 text-slate-50 hover:bg-slate-900/90">{user?.profile?.email?.slice(0, 2).toUpperCase()}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">Welcome</p>
						<p className="text-xs leading-none text-muted-foreground">{user?.profile.email}</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem className="hover:cursor-pointer" onClick={() => navigate("/profile")}>
						Settings
						{navigator.userAgent.includes("Mac OS X") ? <DropdownMenuShortcut>⌘,</DropdownMenuShortcut> : <DropdownMenuShortcut>Ctrl+,</DropdownMenuShortcut>}
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="hover:cursor-pointer" onClick={() => (logoutUser(), navigate("/login"))}>
					Log out
					{navigator.userAgent.includes("Mac OS X") ? <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> : <DropdownMenuShortcut>⇧+Ctrl+Q</DropdownMenuShortcut>}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
