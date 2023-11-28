import React, { useContext } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command";
import { useQuery } from "@apollo/client";
import { GET_WISHLISTS_BY_USER } from "../../queries";
import { UserContext } from "../../App";
import { CommandLoading } from "cmdk";
import { useNavigate } from "react-router-dom";

export function Search({ open, setOpen }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
	const userContext = useContext(UserContext);
	if (!userContext) return null;
	const { user } = userContext;
	const navigate = useNavigate();

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const { loading, data, refetch } = useQuery(GET_WISHLISTS_BY_USER, {
		variables: { user_id: user?.id },
	});

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<CommandInput placeholder="Search for a wishlist" />
			<CommandEmpty>No results found</CommandEmpty>
			<CommandList>
				{loading && <CommandLoading>Fetching words…</CommandLoading>}
				<CommandGroup className="p-2" heading="Suggestions">
					{data &&
						data.wishlistsByUser &&
						data.wishlistsByUser.map((item: any) => (
							<CommandItem onSelect={() => (setOpen(false), refetch(), navigate(`/wishlist/${item.id}`))} key={item.id}>
								{item.name}
							</CommandItem>
						))}
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
