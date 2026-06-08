import "./App.css";
import { Login } from "./components/Login";
import { SignUp } from "./components/SignUp";
function App() {
	return (
		<>
			<div className="flex justify-center items-center h-screen w-full bg-linear-to-r from-blue-500 to-purple-500">
				{/* <SignUp /> */}
				<Login/>
			</div>
		</>
	);
}

export default App;
