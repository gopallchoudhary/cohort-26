import "./App.css";
import Video from "./components/Video";

function App() {
	return (
		<div className="app">
			<header className="app-header">
				<h1>YouTube Listings</h1>
				<p className="header-subtitle">Discover trending videos</p>
			</header>
			<main className="app-main">
				<Video />
			</main>
		</div>
	);
}

export default App;
