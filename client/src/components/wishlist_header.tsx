import { AddWishModal } from "./add_wish_modal";
import { PresetShare } from "./ui/preset-share";

interface WishlistTableHeaderProps {
	wishlist_id: string;
	wishlist_name: string;
}

export default function WishlistHeaderLoggedIn({ wishlist_id, wishlist_name }: WishlistTableHeaderProps) {
	return (
		<div className="sm:flex sm:items-center items-center flex flex-row justify-between">
			<h1 className="text-lg font-semibold leading-6 text-gray-900">{wishlist_name}</h1>
			<p className="text-center text-gray-500">Drag and drop to rearrange wishes. Right click to edit.</p>
			<div className="flex gap-2">
				<PresetShare wishlist_id={wishlist_id} />
				<AddWishModal wishlist_id={wishlist_id} />
			</div>
		</div>
	);
}
