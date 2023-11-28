import { AddWishModal } from "./add_wish_modal";

interface WishlistTableHeaderProps {
	wishlist_id: string;
	wishlist_name: string;
}

export default function WishlistHeader({ wishlist_id, wishlist_name }: WishlistTableHeaderProps) {
	return (
		<div className="sm:flex sm:items-center">
			<div className="sm:flex-auto">
				<h1 className="text-lg font-semibold leading-6 text-gray-900">{wishlist_name}</h1>
			</div>
			<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
				<AddWishModal wishlist_id={wishlist_id} />
			</div>
		</div>
	);
}
