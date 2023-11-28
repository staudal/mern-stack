import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import WishlistHeader from "../components/wishlist_header";
import Wishes from "../components/wishes";
import { GET_WISHLIST } from "../queries";

export default function Wishlist() {
	const navigate = useNavigate();
	const userContext = useContext(UserContext);
	if (!userContext) return null;
	const { isLoggedIn } = userContext;

	useEffect(() => {
		if (!isLoggedIn) {
			navigate("/login");
		}
	}, [isLoggedIn]);

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
	if (error) return <p>Error</p>;

	return (
		<div>
			<div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 gap-6 flex flex-col">
				<WishlistHeader wishlist_id={data.wishlist.id} wishlist_name={data.wishlist.name} />
				<Wishes wishlist_id={data.wishlist.id} />
			</div>
		</div>
	);
}
