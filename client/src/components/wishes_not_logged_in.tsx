import { useQuery } from "@apollo/client";
import { GET_WISHES_BY_WISHLIST } from "../queries";
import { Button } from "./ui/button";

interface WishesProps {
	wishlist_id: string;
}

interface WishType {
	id: string;
	name: string;
	img_url: string;
	description: string;
	link: string;
	price: number;
	order: number;
}

export default function WishesNotLoggedIn({ wishlist_id }: WishesProps) {
	const { loading, error, data } = useQuery(GET_WISHES_BY_WISHLIST, {
		variables: { id: wishlist_id },
	});

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error</p>;

	const items: WishType[] = data?.wishesByWishlist || [];

	function getHostname(link: string) {
		try {
			return new URL(link).hostname.replace("www.", "");
		} catch {
			return "Error occurred";
		}
	}

	return (
		<div>
			<div className="grid grid-cols-3 gap-6">
				{items.map((wish: WishType) => (
					<div
						key={wish.id}
						className="relative group bg-white rounded-md shadow-md flex flex-col justify-between transition h-full hover:scale-105 duration-300 hover:shadow-lg"
					>
						<div>
							<div>
								<img src={wish.img_url} alt={wish.name} className="w-full object-cover h-60 rounded-t-md" />
								<div className="p-6 flex flex-col gap-2">
									<h1 className="text-lg text-center font-semibold leading-6 text-gray-900 line-clamp-1">{wish.name}</h1>
									<p className="text-center text-sm text-gray-500 line-clamp-2">{wish.description}</p>
								</div>
							</div>
						</div>
						<div className="flex justify-between p-4 border-t border-gray-300">
							<p className="text-sm text-gray-500">{getHostname(wish.link)}</p>
							<p className="text-sm text-gray-500">{new Intl.NumberFormat("da-DK", { style: "currency", currency: "DKK" }).format(wish.price)}</p>
						</div>
						<div className="absolute inset-0 bg-white bg-opacity-5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
							<Button variant={"default"} onClick={() => window.open(wish.link, "_blank")}>
								Open link
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
