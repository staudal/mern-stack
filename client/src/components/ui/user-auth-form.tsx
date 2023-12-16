import * as React from "react";

import { useContext } from "react";
import { cn } from "../../lib/lib";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { UserContext } from "../../App";
import { toast } from "react-hot-toast";
import * as Realm from "realm-web";
import { useNavigate } from "react-router-dom";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
	const userContext = useContext(UserContext);
	if (!userContext) return null;
	const { setIsLoggedIn, app, isLoggedIn, setUser, setImageUrl } = userContext;
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [showResetPasswordField, setShowResetPasswordField] = React.useState(false);
	const [resetEmail, setResetEmail] = React.useState("");
	const navigate = useNavigate();

	React.useEffect(() => {
		if (isLoggedIn) {
			navigate("/");
		}
	}, [isLoggedIn]);

	function handleShowResetPasswordField() {
		setShowResetPasswordField(!showResetPasswordField);
	}

	async function handleLogin(event: React.SyntheticEvent) {
		event.preventDefault();
		const toastId = toast.loading("Logging in...");
		await app
			.logIn(Realm.Credentials.emailPassword(email, password))
			.then(() => {
				setUser(app.currentUser);
				setIsLoggedIn(true);
				setImageUrl(app.currentUser?.customData.profile_img_url as string);
				navigate("/");
				toast.success("Logged in!", { id: toastId });
			})
			.catch((err) => {
				console.log(err);
				const errorMessageParts = err.message.split(":");
				let specificErrorMessage = errorMessageParts[errorMessageParts.length - 1].trim();
				specificErrorMessage = specificErrorMessage.split(" (")[0];
				specificErrorMessage = specificErrorMessage.charAt(0).toUpperCase() + specificErrorMessage.slice(1);
				toast.error(specificErrorMessage, { id: toastId });
			});
	}

	function handleResetPassword(event: React.FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		const toastId = toast.loading("Sending reset password email...");
		app.emailPasswordAuth
			.sendResetPasswordEmail({ email: resetEmail })
			.then(() => {
				toast.success("Email sent!", { id: toastId });
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
			{!showResetPasswordField ? (
				<form onSubmit={handleLogin}>
					<div className="grid gap-2">
						<div className="grid gap-1">
							<Label className="sr-only" htmlFor="email">
								Email
							</Label>
							<Input
								id="email"
								placeholder="Email"
								type="email"
								autoCapitalize="none"
								autoComplete="email"
								autoCorrect="off"
								onChange={(e) => setEmail(e.target.value)}
							/>
							<Input
								id="password"
								placeholder="Password"
								type="password"
								autoCapitalize="none"
								autoComplete="password"
								autoCorrect="off"
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<Button type="submit">Sign In</Button>
					</div>
				</form>
			) : (
				<form onSubmit={handleResetPassword}>
					<div className="grid gap-2">
						<div className="grid gap-1">
							<Label className="sr-only" htmlFor="email">
								Email
							</Label>
							<Input
								id="email"
								placeholder="Email"
								type="email"
								autoCapitalize="none"
								autoComplete="email"
								autoCorrect="off"
								onChange={(e) => setResetEmail(e.target.value)}
							/>
						</div>
						<Button type="submit">Reset Password</Button>
					</div>
				</form>
			)}
			<button onClick={handleShowResetPasswordField} className="text-sm text-slate-700 hover:underline">
				Forgot password?
			</button>
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
