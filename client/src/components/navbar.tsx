import { useContext, useState } from "react";
import { UserContext } from "../App";

import { MainNav } from "./ui/main-nav";
import { Search } from "./ui/search";
import { UserNav } from "./ui/user-nav";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const userContext = useContext(UserContext);
	if (!userContext) return null;
	const { isLoggedIn } = userContext;

	return (
		<div className="bg-white border-b">
			<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="flex h-16 items-center">
					<h2 className="text-lg font-semibold">WishR</h2>
					<MainNav className="mx-6" />
					<div className="ml-auto flex items-center space-x-4">
						<div className="flex-1 sm:grow-0 shadow-sm rounded-md relative w-full">
							<input
								className="flex rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 w-full sm:w-64 sm:pr-12 hover:bg-gray-100 hover:cursor-pointer transition-colors duration-200"
								placeholder="Search for a wishlist"
								type="search"
								onClick={() => setOpen(true)}
							/>
							<kbd className="pointer-events-none absolute right-2 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
								<span className="text-xs">⌘</span>K
							</kbd>
						</div>
						<Search open={open} setOpen={setOpen} />
						{isLoggedIn ? (
							<UserNav />
						) : (
							<Button variant="default" onClick={() => navigate("/login")}>
								Sign in
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
