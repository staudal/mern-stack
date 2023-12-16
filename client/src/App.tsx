import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Wishlists from "./routes/wishlists";
import Navbar from "./components/navbar";
import Login from "./routes/login";
import Join from "./routes/join";
import ConfirmEmail from "./routes/confirm";
import * as Realm from "realm-web";
import { Toaster } from "react-hot-toast";
import { createContext, useState, useEffect, useRef } from "react";
import Wishlist from "./routes/wishlist";
import Profile from "./routes/profile";
import ResetPassword from "./routes/resetpassword";
import Account from "./routes/account";

type UserContextType = {
	isLoggedIn: boolean;
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
	user: Realm.User | null;
	setUser: React.Dispatch<React.SetStateAction<Realm.User | null>>;
	app: Realm.App;
	imageUrl: string;
	setImageUrl: React.Dispatch<React.SetStateAction<string>>;
	userEmail: string;
	setUserEmail: React.Dispatch<React.SetStateAction<string>>;
};

export const UserContext = createContext<UserContextType | null>(null);

export default function App() {
	const app = useRef(new Realm.App({ id: "application-0-lckby" }));
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState<Realm.User | null>(null);
	const [imageUrl, setImageUrl] = useState("");
	const [userEmail, setUserEmail] = useState("");

	useEffect(() => {
		if (app.current.currentUser) {
			setIsLoggedIn(true);
			setUser(app.current.currentUser);
			setImageUrl(app.current.currentUser.customData.profile_img_url as string);
		}
		setIsLoading(false);
	}, []);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, app: app.current, setUser, imageUrl, setImageUrl, userEmail, setUserEmail }}>
				<Router>
					{isLoggedIn && <Navbar />}
					<Routes>
						<Route path="/" element={<Wishlists />} />
						<Route path="/wishlist/:id" element={<Wishlist />} />
						<Route path="/login" element={<Login />} />
						<Route path="/join" element={<Join />} />
						<Route path="/confirm" element={<ConfirmEmail />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/account" element={<Account />} />
						<Route path="/resetpassword" element={<ResetPassword />} />
					</Routes>
				</Router>
				<Toaster position="top-center" />
			</UserContext.Provider>
		</div>
	);
}
