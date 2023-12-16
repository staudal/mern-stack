import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Form, FormField, FormItem, FormMessage, FormControl, FormLabel } from "./ui/form";
import { useMutation, useQuery } from "@apollo/client";
import { GET_WISHES_BY_WISHLIST, GET_WISHLISTS_BY_USER, GET_WISH_BY_ID, UPDATE_WISH } from "../queries";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { UserContext } from "../App";
import { Textarea } from "./ui/textarea";

interface Props {
	wish_id: string;
	wishlist_id: string;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
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

const formSchema = z.object({
	name: z.string().min(1, { message: "Required" }),
	description: z.string().min(1, { message: "Required" }),
	price: z.number().min(0, { message: "Required" }).default(0),
	link: z.string().url({ message: "Required" }),
	img_url: z.string().url({ message: "Required" }),
});

export function EditWishModal({ wish_id, wishlist_id, open, setOpen }: Props) {
	const userContext = useContext(UserContext);
	if (!userContext) return null;
	const { user } = userContext;

	const [updateWish] = useMutation(UPDATE_WISH);

	const [wish, setWish] = useState<WishType>({
		id: "",
		name: "",
		img_url: "",
		description: "",
		link: "",
		price: 0,
		order: 0,
	});

	const { data } = useQuery(GET_WISH_BY_ID, {
		variables: { id: wish_id },
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		mode: "onSubmit",
		defaultValues: {
			name: wish.name,
			description: wish.description,
			price: wish.price,
			link: wish.link,
			img_url: wish.img_url,
		},
	});

	useEffect(() => {
		if (data) {
			setWish(data.wish);

			// Set default values after wish is updated
			form.setValue("name", data.wish.name);
			form.setValue("description", data.wish.description);
			form.setValue("price", data.wish.price);
			form.setValue("link", data.wish.link);
			form.setValue("img_url", data.wish.img_url);
		}
	}, [data, form]);

	function onSubmit(values: z.infer<typeof formSchema>) {
		if (values.name === "" || values.description === "" || values.price === 0 || values.link === "" || values.img_url === "") {
			return;
		}

		const toastId = toast.loading("Editing wish...");

		updateWish({
			variables: {
				id: wish_id,
				wishlist_id: wishlist_id,
				name: values.name,
				description: values.description,
				price: values.price,
				link: values.link,
				img_url: values.img_url,
			},
			refetchQueries: [
				{
					query: GET_WISHES_BY_WISHLIST,
					variables: { id: wishlist_id },
				},
				{
					query: GET_WISHLISTS_BY_USER,
					variables: { user_id: user?.id },
				},
			],
		})
			.then(() => {
				setOpen(false);
				form.reset();
				toast.success("Wish edited!", { id: toastId });
			})
			.catch(() => {
				setOpen(false);
				toast.error("Error editing wish", { id: toastId });
			});
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Edit wish</DialogTitle>
					<DialogDescription>Edit something about your wish and click save</DialogDescription>
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
												<Input placeholder="Name" {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<div className="flex justify-between items-center">
												<FormLabel>
													<p className="text-sm font-medium">Description</p>
												</FormLabel>
												<FormMessage />
											</div>
											<FormControl>
												<Textarea placeholder="Description" {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="price"
									render={({ field }) => (
										<FormItem>
											<div className="flex justify-between items-center">
												<FormLabel>
													<p className="text-sm font-medium">Price</p>
												</FormLabel>
												<FormMessage />
											</div>
											<FormControl>
												<Input
													type="number"
													placeholder="Price"
													{...field}
													onChange={(e) => {
														if (e.target.value !== "") {
															form.setValue("price", parseFloat(e.target.value));
														} else {
															form.setValue("price", 0);
														}
													}}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="link"
									render={({ field }) => (
										<FormItem>
											<div className="flex justify-between items-center">
												<FormLabel>
													<p className="text-sm font-medium">Link</p>
												</FormLabel>
												<FormMessage />
											</div>
											<FormControl>
												<Input placeholder="Link" {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="img_url"
									render={({ field }) => (
										<FormItem>
											<div className="flex justify-between items-center">
												<FormLabel>
													<p className="text-sm font-medium">Image URL</p>
												</FormLabel>
												<FormMessage />
											</div>
											<FormControl>
												<Input placeholder="Image URL" {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
							<DialogFooter>
								<Button variant={"outline"} onClick={() => setOpen(false)}>
									Cancel
								</Button>
								<Button variant={"default"} type="submit">
									Save
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
}
