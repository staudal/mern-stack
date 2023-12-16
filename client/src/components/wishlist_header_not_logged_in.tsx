interface WishlistTableHeaderProps {
	wishlist_name: string;
}

export default function WishlistHeaderNotLoggedIn({ wishlist_name }: WishlistTableHeaderProps) {
	return (
		<div className="sm:flex sm:items-center items-center flex flex-row justify-between">
			<h1 className="text-lg font-semibold leading-6 text-gray-900">{wishlist_name}</h1>
			<p className="text-center text-gray-500">Hover over a wish and click open link to see more details.</p>
		</div>
	);
}
