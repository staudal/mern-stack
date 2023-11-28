import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Form, FormField, FormItem, FormMessage, FormControl, FormLabel } from "./ui/form";
import { useMutation } from "@apollo/client";
import { CREATE_WISHLIST, GET_WISHLISTS_BY_USER } from "../queries";
import { useState, useContext, useEffect } from "react";
import toaster from "react-hot-toast";
import { UserContext } from "../App";
import { toast } from "react-hot-toast";

const formSchema = z.object({
	name: z.string().min(1, { message: "Required" }),
});

export function AddWishlistModal() {
	const userContext = useContext(UserContext);
	if (!userContext) return null;
	const { user } = userContext;
	const [createWishlist] = useMutation(CREATE_WISHLIST);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "n" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		mode: "onSubmit",
		defaultValues: {
			name: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		if (values.name === "") return;

		const toastId = toast.loading("Creating wishlist...");

		createWishlist({
			variables: {
				name: values.name,
				user_id: user?.id,
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
				toaster.success("Wishlist created!", { id: toastId });
			})
			.catch(() => {
				setOpen(false);
				toaster.error("Error creating wishlist", { id: toastId });
			});
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="default">Add wishlist</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add wishlist</DialogTitle>
					<DialogDescription>Fill out the form below to add a wishlist.</DialogDescription>
				</DialogHeader>
				<div className="flex items-center space-x-2 w-full">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
							<div className="flex flex-col gap-4">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<div className="flex justify-between items-end">
												<FormLabel>
													<p className="text-sm font-medium">Name</p>
												</FormLabel>
												<FormMessage />
											</div>
											<FormControl>
												<Input placeholder="Christmas 2024" {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
							<DialogFooter>
								<Button variant={"default"} type="submit">
									Add
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
}
