import { useState, useEffect } from "react";
import "./Joke.css";

const Joke = () => {
	const [jokes, setJokes] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchJoke = async () => {
			try {
				const response = await fetch(
					"https://api.freeapi.app/api/v1/public/randomjokes",
				);
				const data = await response.json();
				setJokes(data.data.data);
				setIsLoading(false);
			} catch (error) {
				setIsLoading(false);
				console.error(error);
			}
		};
		fetchJoke();
	}, []);

	if (isLoading) {
		return <p className="joke-loading">Loading jokes...</p>;
	}

	return (
		<div className="joke-list">
			{jokes.map((joke) => (
				<article className="joke-card" key={joke.id}>
					<p className="joke-category">
						{joke.categories?.length ? joke.categories.join(", ") : "General"}
					</p>
					<p className="joke-content">{joke.content}</p>
				</article>
			))}
		</div>
	);
};

export default Joke;
