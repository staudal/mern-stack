import { useContext } from "react";
import DeleteWishlistModal from "./delete_wishlist_modal";
import { useQuery } from "@apollo/client";
import { GET_WISHLISTS_BY_USER } from "../queries";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { Button } from "./ui/button";

export default function WishlistsTable() {
	const userContext = useContext(UserContext);
	if (!userContext) return null;
	const { user } = userContext;

	const navigate = useNavigate();
	const { loading, error, data } = useQuery(GET_WISHLISTS_BY_USER, {
		variables: { user_id: user?.id },
	});

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error</p>;

	return (
		<div>
			<div className="-mx-4 border rounded-md bg-white sm:mx-0">
				<table className="min-w-full divide-y divide-gray-300" style={{ height: "1px" }}>
					<thead>
						<tr>
							<th scope="col" className="p-4 text-center text-sm font-semibold text-gray-900">
								#
							</th>
							<th scope="col" className="p-4 text-center text-sm font-semibold text-gray-900">
								Title
							</th>
							<th scope="col" className="p-4 text-center text-sm font-semibold text-gray-900">
								# of wishes
							</th>
							<th scope="col" className="p-4 text-center text-sm font-semibold text-gray-900">
								Average DKK
							</th>
							<th scope="col" className="p-4 text-center text-sm font-semibold text-gray-900">
								Date created
							</th>
						</tr>
					</thead>
					<tbody className="divide-y">
						{data?.wishlistsByUser?.map((wishlist: any, index: any) => (
							<tr key={wishlist.id} className="divide-x">
								<td className={"text-center relative p-3 text-sm"}>
									<div className="font-medium text-gray-900">{index + 1}</div>
								</td>
								<td className={"p-3 text-center text-sm text-gray-500"}>{wishlist.name}</td>
								<td className={"p-3 text-center text-sm text-gray-500"}>{wishlist.wishes.length}</td>
								<td className={"p-3 text-center text-sm text-gray-500"}>
									{wishlist.wishes.length > 0
										? new Intl.NumberFormat("da-DK", { style: "currency", currency: "DKK" }).format(
												wishlist.wishes.reduce((total: any, wish: any) => total + wish.price, 0) / wishlist.wishes.length
										  )
										: "0"}
								</td>
								<td className={"p-3 text-center text-sm text-gray-500"}>
									{wishlist.date_created && !isNaN(Number(wishlist.date_created))
										? new Date(Number(wishlist.date_created)).toLocaleDateString("da-DK", { day: "2-digit", month: "short", year: "numeric" })
										: "Invalid date"}
								</td>
								<td className={"grid grid-cols-2 h-full text-center text-sm font-medium p-2 gap-2"}>
									<Button variant={"default"} onClick={() => navigate(`/wishlist/${wishlist.id}`)}>
										Select
									</Button>
									<DeleteWishlistModal wishlist_id={wishlist.id} />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
