import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import { UserContext } from "../App";

const ConfirmEmail = () => {
	const userContext = useContext(UserContext);
	if (!userContext) return null;
	const { app, userEmail } = userContext;

	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		// 1. Get the token and tokenId from the URL query parameters
		const params = new URLSearchParams(location.search);
		const tokenParam = params.get("token") as string;
		const tokenIdParam = params.get("tokenId") as string;
		// 2. Call Realm.App.emailPasswordAuth.confirmUser(token, tokenId)
		if (tokenParam && tokenIdParam) {
			const toastId = toast.loading("Confirming email...");
			async function confirmEmail() {
				await app.emailPasswordAuth
					.confirmUser({ token: tokenParam, tokenId: tokenIdParam })
					.then(() => {
						localStorage.removeItem("status");
						navigate("/login");
						console.log("Email confirmed!");
						toast.success("Email confirmed!", { id: toastId });
					})
					.catch((err) => {
						const errorMessageParts = err.message.split(":");
						let specificErrorMessage = errorMessageParts[errorMessageParts.length - 1].trim();
						specificErrorMessage = specificErrorMessage.split(" (")[0];
						specificErrorMessage = specificErrorMessage.charAt(0).toUpperCase() + specificErrorMessage.slice(1);
						toast.error(specificErrorMessage, { id: toastId });
						localStorage.removeItem("status");
						navigate("/join");
					});
			}
			confirmEmail();
		}

		if (localStorage.getItem("status") === null) {
			navigate("/");
		}
	}, []);

	async function handleResendConfirmationMail() {
		const toastId = toast.loading("Sending confirmation email...");
		await app.emailPasswordAuth
			.resendConfirmationEmail({ email: userEmail })
			.then(() => {
				toast.success("Confirmation email sent!", { id: toastId });
			})
			.catch((err) => {
				const errorMessageParts = err.message.split(":");
				let specificErrorMessage = errorMessageParts[errorMessageParts.length - 1].trim();
				specificErrorMessage = specificErrorMessage.split(" (")[0];
				specificErrorMessage = specificErrorMessage.charAt(0).toUpperCase() + specificErrorMessage.slice(1);
				toast.error(specificErrorMessage, { id: toastId });
			});
	}

	if (localStorage.getItem("status") === "pending") {
		return (
			<div className="flex flex-col min-h-screen items-center justify-center px-6 lg:px-8">
				<div className="bg-slate-100 p-10 border rounded-md space-y-4">
					<div className="sm:mx-auto sm:w-full sm:max-w-sm">
						<h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">Confirm your email address</h2>
					</div>
					<div className="sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
						<p className="text-center text-sm leading-5 text-slate-900 leading-5">
							Please check your email for a confirmation link. If you did not receive an email, please click the button below.
						</p>
						<Button variant="default" className="w-full" onClick={handleResendConfirmationMail}>
							Resend confirmation email
						</Button>
					</div>
				</div>
			</div>
		);
	}
};

export default ConfirmEmail;
