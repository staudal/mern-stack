import { Button } from "../button";
import { useContext, useState } from "react";
import { UserContext } from "../../../App";
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
} from "../alert-dialog";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export function AccountForm() {
	const userContext = useContext(UserContext);
	if (!userContext) return null;
	const { user, app, setIsLoggedIn } = userContext;

	const [open, setOpen] = useState(false);
	const navigate = useNavigate();

	function handleDeleteAccount() {
		if (!user) return;
		const toastId = toast.loading("Deleting account...");
		app
			.deleteUser(user)
			.then(() => {
				toast.success("Account deleted!", { id: toastId });
				setOpen(false);
				setIsLoggedIn(false);
				navigate("/login");
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
					<AlertDialogDescription>This will permanently delete your account.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant={"destructive"}
						onClick={() => {
							handleDeleteAccount();
						}}
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
