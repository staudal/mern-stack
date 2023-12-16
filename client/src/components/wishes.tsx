import { ReactSortable } from "react-sortablejs";
import { useQuery, useMutation } from "@apollo/client";
import { GET_WISHES_BY_WISHLIST } from "../queries";
import { DialogCloseButton } from "./delete_wish_modal";
import { useEffect, useState } from "react";
import { UPDATE_WISH_ORDER } from "../queries";
import { cn } from "../lib/lib";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu";
import { EditWishModal } from "./editwishmodal";
import { Cog, Link, Trash2 } from "lucide-react";

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

export default function WishesLoggedIn({ wishlist_id }: WishesProps) {
	const { loading, error, data, refetch } = useQuery(GET_WISHES_BY_WISHLIST, {
		variables: { id: wishlist_id },
	});

	const [updateWishOrder] = useMutation(UPDATE_WISH_ORDER);
	const [items, setItems] = useState<WishType[]>([]);
	const [openDeleteWishModal, setOpenDeleteWishModal] = useState(false);
	const [openEditWishModal, setOpenEditWishModal] = useState(false);
	const [selectedWishId, setSelectedWishId] = useState<string | null>(null);
	const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

	useEffect(() => {
		if (data) {
			setItems(JSON.parse(JSON.stringify(data.wishesByWishlist)));
		}
	}, [data, isContextMenuOpen, selectedWishId]);

	function getHostname(link: string) {
		try {
			return new URL(link).hostname.replace("www.", "");
		} catch {
			return "Error occurred";
		}
	}

	const handleSortEnd = async (newItems: WishType[]) => {
		setItems(newItems);
		const wishesInput = newItems.map(({ id, name, img_url, description, link, price }, index) => ({
			id,
			name,
			img_url,
			description,
			link,
			price,
			order: index,
		}));

		try {
			await updateWishOrder({ variables: { wishlist_id, wishes: wishesInput } });
			// After the mutation is successful, you might want to refetch the data
			await refetch();
			console.log("Wish order updated:", wishesInput);
		} catch (error) {
			console.error("Error updating wish order:", error);
		}
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error</p>;

	return (
		<div>
			<ReactSortable list={items} setList={handleSortEnd} className="grid grid-cols-3 gap-6" animation={300}>
				{items.map((wish: any) => (
					<ContextMenu
						key={wish.id}
						onOpenChange={() => {
							setIsContextMenuOpen(!isContextMenuOpen);
							setSelectedWishId(wish.id);
						}}
					>
						<ContextMenuTrigger>
							<div
								className={cn("elative group bg-white rounded-md shadow-md flex flex-col justify-between cursor-grab transition h-full", {
									"scale-105": isContextMenuOpen && selectedWishId === wish.id,
								})}
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
							</div>
							{openDeleteWishModal && (
								<DialogCloseButton wish_id={selectedWishId as string} wishlist_id={wishlist_id} open={openDeleteWishModal} setOpen={setOpenDeleteWishModal} />
							)}
							{openEditWishModal && (
								<EditWishModal wish_id={selectedWishId as string} wishlist_id={wishlist_id} open={openEditWishModal} setOpen={setOpenEditWishModal} />
							)}
						</ContextMenuTrigger>
						<ContextMenuContent className="w-64">
							<ContextMenuItem className="hover:cursor-pointer" onClick={() => window.open(wish.link, "_blank")}>
								<Link className="mr-2 h-4 w-4" />
								<span>Open link</span>
							</ContextMenuItem>
							<ContextMenuItem
								className="hover:cursor-pointer"
								onClick={() => {
									setOpenEditWishModal(true);
									setSelectedWishId(wish.id);
								}}
							>
								<Cog className="mr-2 h-4 w-4" />
								<span>Edit</span>
							</ContextMenuItem>
							<ContextMenuItem
								className="hover:cursor-pointer"
								onClick={() => {
									setOpenDeleteWishModal(true);
									setSelectedWishId(wish.id);
								}}
							>
								<Trash2 className="mr-2 h-4 w-4" />
								<span>Delete</span>
							</ContextMenuItem>
						</ContextMenuContent>
					</ContextMenu>
				))}
			</ReactSortable>
		</div>
	);
}
