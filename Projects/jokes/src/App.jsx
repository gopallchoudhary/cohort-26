import Joke from "./components/Joke";
import "./App.css";

function App() {
	return (
		<div className="app-container">
			<header className="app-header">
				<h1 className="app-title">😂 Joke Hub</h1>
				<p className="app-subtitle">Get your daily dose of laughter</p>
			</header>
			<main className="app-main">
				<Joke />
			</main>
		</div>
	);
}

export default App;
