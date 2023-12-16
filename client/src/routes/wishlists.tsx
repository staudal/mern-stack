import { useContext, useEffect } from "react";
import WishlistsTable from "../components/wishlists_table";
import WishlistsHeader from "../components/wishlists_header";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function Wishlists() {
	const navigate = useNavigate();
	const userContext = useContext(UserContext);
	if (!userContext) return null;
	const { isLoggedIn } = userContext;

	useEffect(() => {
		if (!isLoggedIn) {
			navigate("/login");
		}
	}, [isLoggedIn]);

	return (
		<div>
			<div className="mx-auto max-w-7xl py-6 px-6 lg:px-8 gap-6 flex flex-col">
				<WishlistsHeader />
				<WishlistsTable />
			</div>
		</div>
	);
}
