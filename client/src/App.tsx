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

type UserContextType = {
	isLoggedIn: boolean;
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
	user: Realm.User | null;
	app: Realm.App;
};

export const UserContext = createContext<UserContextType | null>(null);

export default function App() {
	const app = useRef(new Realm.App({ id: "application-0-lckby" }));
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState<Realm.User | null>(null);

	useEffect(() => {
		if (app.current.currentUser) {
			setIsLoggedIn(true);
			setUser(app.current.currentUser);
		}
		setIsLoading(false);
	}, []);

	if (isLoading) {
		return <div>Loading...</div>; // Replace this with your actual loading component
	}

	return (
		<div>
			<UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, app: app.current }}>
				<Router>
					{isLoggedIn && <Navbar />}
					<Routes>
						<Route path="/" element={<Wishlists />} />
						<Route path="/wishlist/:id" element={<Wishlist />} />
						<Route path="/login" element={<Login />} />
						<Route path="/join" element={<Join />} />
						<Route path="/confirm" element={<ConfirmEmail />} />
					</Routes>
				</Router>
				<Toaster position="top-center" />
			</UserContext.Provider>
		</div>
	);
}
