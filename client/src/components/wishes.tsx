import { useQuery } from "@apollo/client";
import { GET_WISHES_BY_WISHLIST } from "../queries";
import { useState } from "react";
import { DialogCloseButton } from "./delete_wish_modal";
import { Button } from "./ui/button";

interface WishesProps {
	wishlist_id: string;
}

export default function Wishes({ wishlist_id }: WishesProps) {
	const [, setIsDeleteModalOpen] = useState(false);

	const { loading, error, data } = useQuery(GET_WISHES_BY_WISHLIST, {
		variables: { id: wishlist_id },
	});

	function getHostname(link: string) {
		try {
			return new URL(link).hostname.replace("www.", "");
		} catch {
			return "Error occurred";
		}
	}

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error</p>;

	return (
		<div>
			<div className="grid grid-cols-3 gap-6">
				{data.wishesByWishlist.map((wish: any) => (
					<div
						key={wish.id}
						className="relative group bg-white rounded-md shadow-md transition-transform duration-500 ease-in-out transform hover:scale-105 flex flex-col justify-between"
					>
						<div>
							<div>
								<img src={wish.img_url} alt={wish.name} className="w-full object-cover h-60 rounded-t-md" />
								<div className="p-4">
									<h1 className="text-lg text-center font-semibold leading-6 text-gray-900 line-clamp-1">{wish.name}</h1>
									<p className="text-center text-sm text-gray-500 line-clamp-2">{wish.description}</p>
								</div>
							</div>
						</div>
						<div className="flex justify-between p-4 border-t border-gray-300">
							<p className="text-sm text-gray-500">{getHostname(wish.link)}</p>
							<p className="text-sm text-gray-500">{new Intl.NumberFormat("da-DK", { style: "currency", currency: "DKK" }).format(wish.price)}</p>
						</div>
						<div className="absolute gap-2 inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
							<Button variant={"default"} onClick={() => window.open(wish.link, "_blank")}>
								Visit
							</Button>
							<DialogCloseButton wish_id={wish.id} wishlist_id={wishlist_id} />
						</div>
						<div className="absolute inset-0 bg-white bg-opacity-5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
					</div>
				))}
			</div>
		</div>
	);
}
