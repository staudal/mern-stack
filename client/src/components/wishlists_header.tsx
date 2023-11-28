import { AddWishlistModal } from "./add_wishlist_modal";

export default function WishlistsHeader() {
	return (
		<div className="sm:flex sm:items-center">
			<div className="sm:flex-auto">
				<h1 className="text-lg font-semibold leading-6 text-gray-900">Your wishlists</h1>
			</div>
			<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
				<AddWishlistModal />
			</div>
		</div>
	);
}
