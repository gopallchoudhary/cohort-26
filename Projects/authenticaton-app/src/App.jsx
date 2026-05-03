import { useState, useEffect } from "react";

const API_BASE_URL = "https://api.freeapi.app/api/v1/users";

function App() {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(
		localStorage.getItem("accessToken") || null,
	);
	const [view, setView] = useState("login"); 

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	// Form states
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		role: "ADMIN", 
		username: "",
	});

	
	useEffect(() => {
		if (token) {
			fetchCurrentUser();
		}
	}, [token]);

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const clearMessages = () => {
		setError("");
		setSuccess("");
	};

	const apiCall = async (endpoint, method = "GET", body = null) => {
		const headers = {
			"Content-Type": "application/json",
		};

		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}

		const options = {
			method,
			headers,
		};

		if (body) {
			options.body = JSON.stringify(body);
		}

		const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
		const data = await response.json();

		if (!response.ok || !data.success) {
			throw new Error(
				data.message || "An error occurred processing your request.",
			);
		}

		return data;
	};

	const handleRegister = async (e) => {
		e.preventDefault();
		setLoading(true);
		clearMessages();

		try {
			await apiCall("/register", "POST", formData);
			setSuccess("Registration successful! You can now log in.");
			setView("login");
			setFormData({ ...formData, password: "" });
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		clearMessages();

		try {
			const data = await apiCall("/login", "POST", {
				username: formData.username,
				password: formData.password,
			});

			const accessToken = data.data.accessToken;
			localStorage.setItem("accessToken", accessToken);
			setToken(accessToken);
			setUser(data.data.user);
			setSuccess("Logged in successfully!");
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const fetchCurrentUser = async () => {
		setLoading(true);
		clearMessages();
		try {
			const data = await apiCall("/current-user", "GET");
			setUser(data.data);
		} catch (err) {
			setError("Session expired. Please log in again.");
			handleLogoutLocal();
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = async () => {
		setLoading(true);
		clearMessages();
		try {
			await apiCall("/logout", "POST");
			handleLogoutLocal();
			setSuccess("Logged out successfully.");
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleLogoutLocal = () => {
		localStorage.removeItem("accessToken");
		setToken(null);
		setUser(null);
		setFormData({ email: "", password: "", role: "ADMIN", username: "" });
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
			<div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
				{/* Header */}
				<div className="mb-6 text-center">
					<h1 className="text-2xl font-bold text-gray-800">
						{user
							? "Dashboard"
							: view === "login"
								? "Welcome Back"
								: "Create Account"}
					</h1>
				</div>

				{/* Alerts */}
				{error && (
					<div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm font-medium">
						{error}
					</div>
				)}
				{success && (
					<div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm font-medium">
						{success}
					</div>
				)}

				
				{user ? (
					<div className="space-y-6">
						<div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
							<div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3 uppercase">
								{user.username.charAt(0)}
							</div>
							<h2 className="text-xl font-semibold text-gray-800">
								@{user.username}
							</h2>
							<p className="text-gray-600">{user.email}</p>
							<span className="inline-block mt-2 px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-bold tracking-wide">
								{user.role}
							</span>
						</div>

						<button
							onClick={handleLogout}
							disabled={loading}
							className="w-full bg-red-500 text-white font-medium py-2.5 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
						>
							{loading ? "Logging out..." : "Log Out"}
						</button>
					</div>
				) : (
					/* Auth Forms */
					<form
						onSubmit={view === "login" ? handleLogin : handleRegister}
						className="space-y-4"
					>
						{view === "register" && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Email
								</label>
								<input
									type="email"
									name="email"
									required
									value={formData.email}
									onChange={handleInputChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
									placeholder="user@domain.com"
								/>
							</div>
						)}

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Username
							</label>
							<input
								type="text"
								name="username"
								required
								value={formData.username}
								onChange={handleInputChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
								placeholder="johndoe"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Password
							</label>
							<input
								type="password"
								name="password"
								required
								value={formData.password}
								onChange={handleInputChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
								placeholder="••••••••"
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 mt-2"
						>
							{loading
								? "Processing..."
								: view === "login"
									? "Log In"
									: "Register"}
						</button>

						<div className="text-center mt-4">
							<button
								type="button"
								onClick={() => {
									setView(view === "login" ? "register" : "login");
									clearMessages();
								}}
								className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
							>
								{view === "login"
									? "Don't have an account? Register here."
									: "Already have an account? Log in."}
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}

export default App;
