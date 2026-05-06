import { useState } from "react";
import "../styles/ProductCard.css";

const ProductCard = ({ product }) => {
	const [imageIndex, setImageIndex] = useState(0);

	const discountedPrice = (
		product.price *
		(1 - product.discountPercentage / 100)
	).toFixed(2);

	const handlePrevImage = () => {
		setImageIndex(
			(prev) => (prev - 1 + product.images.length) % product.images.length,
		);
	};

	const handleNextImage = () => {
		setImageIndex((prev) => (prev + 1) % product.images.length);
	};

	return (
		<div className="product-card">
			<div className="product-image-container">
				<img
					src={product.images[imageIndex]}
					alt={product.title}
					className="product-image"
				/>
				{product.images.length > 1 && (
					<>
						<button
							className="image-nav-button prev"
							onClick={handlePrevImage}
							aria-label="Previous image"
						>
							❮
						</button>
						<button
							className="image-nav-button next"
							onClick={handleNextImage}
							aria-label="Next image"
						>
							❯
						</button>
					</>
				)}
				<div className="discount-badge">
					-{product.discountPercentage.toFixed(1)}%
				</div>
				{product.stock < 20 && <div className="stock-warning">Low Stock</div>}
			</div>

			<div className="product-info">
				<p className="product-brand">{product.brand}</p>
				<h3 className="product-title">{product.title}</h3>
				<p className="product-description">{product.description}</p>

				<div className="product-rating">
					<div className="stars">
						{"★".repeat(Math.floor(product.rating))}
						{"☆".repeat(5 - Math.floor(product.rating))}
					</div>
					<span className="rating-text">{product.rating}</span>
				</div>

				<div className="product-pricing">
					<span className="original-price">${product.price}</span>
					<span className="discounted-price">${discountedPrice}</span>
				</div>

				<div className="product-footer">
					<span className="stock-info">
						{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
					</span>
					<button className="add-to-cart-btn" disabled={product.stock === 0}>
						Add to Cart
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
