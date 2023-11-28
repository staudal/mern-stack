import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Realm from "realm-web";
import toast from "react-hot-toast";

const ConfirmEmail = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const app = new Realm.App({ id: "application-0-lckby" });
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

	if (localStorage.getItem("status") === "pending") {
		return (
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
					<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Confirm your email address</h2>
				</div>
				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<p className="text-center text-sm leading-5 text-gray-900">Please check your email for a confirmation link.</p>
				</div>
			</div>
		);
	}
};

export default ConfirmEmail;
