import { useQuery } from "@apollo/client";
import WishesLoggedIn from "../components/wishes";
import { GET_WISHLIST } from "../queries";
import NotFound from "../components/notfound";
import { useContext } from "react";
import { UserContext } from "../App";
import WishesNotLoggedIn from "../components/wishes_not_logged_in";
import WishlistHeaderNotLoggedIn from "../components/wishlist_header_not_logged_in";
import WishlistHeaderLoggedIn from "../components/wishlist_header";

export default function Wishlist() {
	const userContext = useContext(UserContext);
	if (!userContext) return null;
	const { isLoggedIn } = userContext;

	// get id from url
	const url = window.location.href;
	const id = url.substring(url.lastIndexOf("/") + 1);

	const { loading, error, data } = useQuery(GET_WISHLIST, {
		variables: { id },
	});

	if (loading)
		return (
			<div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
				<h1>Loading...</h1>
			</div>
		);
	if (error) return <NotFound />;

	return (
		<div>
			<div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 gap-6 flex flex-col">
				{isLoggedIn ? (
					<WishlistHeaderLoggedIn wishlist_id={data.wishlist.id} wishlist_name={data.wishlist.name} />
				) : (
					<WishlistHeaderNotLoggedIn wishlist_name={data.wishlist.name} />
				)}
				{isLoggedIn ? <WishesLoggedIn wishlist_id={data.wishlist.id} /> : <WishesNotLoggedIn wishlist_id={data.wishlist.id} />}
			</div>
		</div>
	);
}
