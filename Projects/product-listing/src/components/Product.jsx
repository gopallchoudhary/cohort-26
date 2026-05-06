import { useState, useEffect } from "react";

const Product = () => {
	const [product, setProduct] = useState({});
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const fetchProduct = async () => {
			const response = await fetch(
				"https://api.freeapi.app/api/v1/public/randomproducts",
			);
			const data = await response.json();
			setProduct(data.data.data);
			setLoading(false);
		};
		fetchProduct();
	}, []);
	return <div>Product</div>;
};

export default Product;
