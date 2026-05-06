import { useState } from "react";
import ProductCard from "./ProductCard";
import { products } from "../data/products";
import "../styles/ProductListing.css";

const ProductListing = () => {
	const [filteredProducts, setFilteredProducts] = useState(products);
	const [sortBy, setSortBy] = useState("featured");

	const handleSort = (e) => {
		const value = e.target.value;
		setSortBy(value);

		let sorted = [...products];
		switch (value) {
			case "price-low":
				sorted.sort((a, b) => a.price - b.price);
				break;
			case "price-high":
				sorted.sort((a, b) => b.price - a.price);
				break;
			case "rating":
				sorted.sort((a, b) => b.rating - a.rating);
				break;
			case "newest":
				sorted.reverse();
				break;
			default:
				sorted = [...products];
		}
		setFilteredProducts(sorted);
	};

	return (
		<div className="product-listing">
			<div className="listing-header">
				<h1>Our Products</h1>
				<p>Explore our collection of premium laptops</p>
			</div>

			<div className="listing-controls">
				<div className="product-count">
					Showing {filteredProducts.length} products
				</div>
				<select value={sortBy} onChange={handleSort} className="sort-select">
					<option value="featured">Featured</option>
					<option value="price-low">Price: Low to High</option>
					<option value="price-high">Price: High to Low</option>
					<option value="rating">Top Rated</option>
					<option value="newest">Newest</option>
				</select>
			</div>

			<div className="products-grid">
				{filteredProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</div>
	);
};

export default ProductListing;
