import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Form, FormField, FormItem, FormMessage, FormControl, FormLabel } from "./ui/form";
import { useMutation } from "@apollo/client";
import { CREATE_WISH, GET_WISHES_BY_WISHLIST, GET_WISHLISTS_BY_USER } from "../queries";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { UserContext } from "../App";

interface Props {
	wishlist_id: string;
}

const formSchema = z.object({
	name: z.string().min(1, { message: "Required" }),
	description: z.string().min(1, { message: "Required" }),
	price: z.number().min(0, { message: "Required" }).default(0),
	link: z.string().url({ message: "Required" }),
	img_url: z.string().url({ message: "Required" }),
});

export function AddWishModal({ wishlist_id }: Props) {
	const userContext = useContext(UserContext);
	if (!userContext) return null;
	const { user } = userContext;

	const [createWish] = useMutation(CREATE_WISH);
	const [open, setOpen] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		mode: "onSubmit", // change this to "onSubmit"
		defaultValues: {
			name: "",
			description: "",
			price: 0,
			link: "",
			img_url: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		if (values.name === "" || values.description === "" || values.price === 0 || values.link === "" || values.img_url === "") {
			return;
		}

		const toastId = toast.loading("Creating wish...");

		createWish({
			variables: {
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
				toast.success("Wish created!", { id: toastId });
			})
			.catch(() => {
				setOpen(false);
				toast.error("Error creating wish", { id: toastId });
			});
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="default">Add wish</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add wish</DialogTitle>
					<DialogDescription>Fill out the form below to add a wish to your wishlist.</DialogDescription>
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
												<Input placeholder="Description" {...field} />
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
