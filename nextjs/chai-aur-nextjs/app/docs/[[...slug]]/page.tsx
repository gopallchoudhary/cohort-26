type Props = {
	params: {
		slug?: string[];
	};
};

export default function DocsPage({ params }: Props) {
	const slug = params.slug;
	

	if (!slug) {
		return <h1>Docs Home Page</h1>;
	}

	return (
		<div>
			<h1>Nested Docs Page</h1>
			<p>{slug.join(" / ")}</p>
		</div>
	);
}
