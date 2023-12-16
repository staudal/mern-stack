import * as React from "react";

import { useContext } from "react";
import { cn } from "../../lib/lib";
import { FaGithub } from "react-icons/fa";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { UserContext } from "../../App";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
	token: string | null;
	tokenId: string | null;
}

export function PasswordResetForm({ className, ...props }: UserAuthFormProps) {
	const userContext = useContext(UserContext);
	if (!userContext) return null;
	const { app, isLoggedIn } = userContext;
	const [password, setPassword] = React.useState("");
	const [passwordConfirm, setPasswordConfirm] = React.useState("");
	const navigate = useNavigate();

	React.useEffect(() => {
		if (isLoggedIn) {
			navigate("/");
		} else if (!props.token || !props.tokenId) {
			navigate("/login");
			toast.error("Invalid password reset link!");
		}
	}, [isLoggedIn]);

	async function onSubmit(event: React.SyntheticEvent) {
		event.preventDefault();
		const toastId = toast.loading("Resetting password...");
		if (password !== passwordConfirm) {
			toast.error("Passwords do not match!", { id: toastId });
			return;
		}
		await app.emailPasswordAuth
			.resetPassword({ token: props.token, tokenId: props.tokenId, password: password })
			.then(() => {
				toast.success("Password reset!", { id: toastId });
				navigate("/login");
			})
			.catch((err) => {
				const errorMessageParts = err.message.split(":");
				let specificErrorMessage = errorMessageParts[errorMessageParts.length - 1].trim();
				specificErrorMessage = specificErrorMessage.split(" (")[0];
				specificErrorMessage = specificErrorMessage.charAt(0).toUpperCase() + specificErrorMessage.slice(1);
				toast.error(specificErrorMessage, { id: toastId });
			});
	}

	return (
		<div className={cn("grid gap-6", className)} {...props}>
			<form onSubmit={onSubmit}>
				<div className="grid gap-2">
					<div className="grid gap-1">
						<Label className="sr-only" htmlFor="email">
							Email
						</Label>
						<Input
							id="password"
							placeholder="New Password"
							type="password"
							autoCapitalize="none"
							autoCorrect="off"
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Input
							id="password"
							placeholder="Confirm Password"
							type="password"
							autoCapitalize="none"
							autoCorrect="off"
							onChange={(e) => setPasswordConfirm(e.target.value)}
						/>
					</div>
					<Button>Reset Password</Button>
				</div>
			</form>
			{/* <div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">Or continue with</span>
				</div>
			</div>
			<Button variant="outline" type="button">
				<FaGithub className="mr-2 h-4 w-4" />
				Github
			</Button> */}
		</div>
	);
}
