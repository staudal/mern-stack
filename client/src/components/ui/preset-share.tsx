import { CopyIcon } from "@radix-ui/react-icons";
import { CheckIcon } from "@heroicons/react/24/solid";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useState } from "react";

export function PresetShare({ wishlist_id }: { wishlist_id: string }) {
	const [isCopied, setIsCopied] = useState(false);

	const copyToClipboard = async (text: string) => {
		await navigator.clipboard.writeText(text);
		setIsCopied(true);

		// Change back to copy icon after 2 seconds
		setTimeout(() => {
			setIsCopied(false);
		}, 1000);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="secondary">Share</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-[520px]">
				<div className="flex flex-col space-y-2 text-center sm:text-left">
					<h3 className="text-lg font-semibold">Share your wishlist</h3>
					<p className="text-sm text-muted-foreground">Anyone who has this link can view your wishlist.</p>
				</div>
				<div className="flex items-center space-x-2 pt-4">
					<div className="grid flex-1 gap-2">
						<Label htmlFor="link" className="sr-only">
							Link
						</Label>
						<Input id="link" defaultValue={`https://wishr.netlify.app/wishlist/${wishlist_id}`} readOnly className="h-9" />
					</div>
					<Button type="submit" size="sm" className="px-3" onClick={() => copyToClipboard(`https://wishr.netlify.app/wishlist/${wishlist_id}`)}>
						<span className="sr-only">Copy</span>
						{isCopied ? <CheckIcon className="text-green-500 h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
