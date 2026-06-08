import "./App.css";
import { SignUp } from "./components/SignUp";
function App() {
	return (
		<>
			<div className="flex justify-center items-center h-screen w-full bg-gradient-to-r from-blue-500 to-purple-500">
				<SignUp />
			</div>
		</>
	);
}

export default App;
