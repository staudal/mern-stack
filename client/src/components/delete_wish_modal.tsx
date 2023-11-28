import { Button } from "./ui/button";
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
import { DELETE_WISH, GET_WISHES_BY_WISHLIST, GET_WISHLISTS_BY_USER } from "../queries";
import { useMutation } from "@apollo/client";
import { toast } from "react-hot-toast";
import { useContext, useState } from "react";
import { UserContext } from "../App";

interface Props {
	wish_id: string;
	wishlist_id: string;
}

export function DialogCloseButton({ wish_id, wishlist_id }: Props) {
	const userContext = useContext(UserContext);
	if (!userContext) return null;
	const { user } = userContext;

	const [deleteWish] = useMutation(DELETE_WISH);
	const [open, setOpen] = useState(false);

	function handleDeleteWish(id: string): void {
		const toastId = toast.loading("Loading...");
		deleteWish({
			variables: { id },
			refetchQueries: [
				{ query: GET_WISHES_BY_WISHLIST, variables: { id: wishlist_id } },
				{ query: GET_WISHLISTS_BY_USER, variables: { user_id: user?.id } },
			],
		})
			.then(() => {
				setOpen(false);
				toast.success("Wish deleted!", { id: toastId });
			})
			.catch(() => {
				setOpen(false);
				toast.error("Failed to delete wish", { id: toastId });
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
					<AlertDialogDescription>This action cannot be undone. This will permanently delete the wish.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction variant={"destructive"} onClick={() => handleDeleteWish(wish_id)}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
