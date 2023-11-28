import { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_WISHLIST, GET_WISHLISTS_BY_USER } from "../queries";
import { UserContext } from "../App";
import { toast } from "react-hot-toast";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

interface DeleteModalProps {
	wishlist_id: string;
}

export default function DeleteWishlistModal({ wishlist_id }: DeleteModalProps) {
	const [open, setOpen] = useState(false);

	const userContext = useContext(UserContext);
	if (!userContext) return null;
	const { user } = userContext;

	const [deleteWishlist] = useMutation(DELETE_WISHLIST);

	function handleDeleteWishlist(wishlist_id: string): void {
		const toastId = toast.loading("Deleting wishlist...");
		deleteWishlist({
			variables: {
				id: wishlist_id,
			},
			refetchQueries: [
				{
					query: GET_WISHLISTS_BY_USER,
					variables: { user_id: user?.id },
				},
			],
		})
			.then(() => {
				setOpen(false);
				toast.success("Wishlist deleted!", { id: toastId });
			})
			.catch((err) => {
				setOpen(false);
				toast.error(err.message, { id: toastId });
			});
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button variant="destructive">Remove</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>This action cannot be undone. This will permanently delete the wishlist.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction variant={"destructive"} onClick={() => handleDeleteWishlist(wishlist_id)}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
