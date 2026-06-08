import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
	const [title, setTitle] = useState("");

  
	async function registerUser() {
		const response = await axios.get(
			"https://jsonplaceholder.typicode.com/todos/1",
		);
		const data = await response.data;
		console.log(data);
		setTitle(data.title);
	}

	return (
		<>
			<div>
				<h1>data fetching</h1>
				<button onClick={() => registerUser()}>register user</button>
				{title}
			</div>
		</>
	);
}

export default App;
