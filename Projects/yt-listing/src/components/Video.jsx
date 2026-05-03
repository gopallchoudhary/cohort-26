import { useEffect, useState } from "react";
import "../styles/VideoListing.css";

const API_URL = "https://api.freeapi.app/api/v1/public/youtube/videos";

const Video = () => {
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				const response = await fetch(API_URL);
				const data = await response.json();
				setVideos(data.data.data);
			} catch (error) {
				console.error("Error fetching videos:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchVideos();
	}, []);

	const formatNumber = (num) => {
		if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
		if (num >= 1000) return (num / 1000).toFixed(1) + "K";
		return num
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now - date);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 1) return "Today";
		if (diffDays === 2) return "Yesterday";
		if (diffDays < 7) return `${diffDays} days ago`;
		if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
		if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
		return `${Math.floor(diffDays / 365)} years ago`;
	};

	if (loading) {
		return <div className="loading">Loading videos...</div>;
	}

	return (
		<div className="videos-container">
			{videos.map((video, index) => (
				<div key={index} className="video-card">
					<div className="video-thumbnail-wrapper">
						<img
							src={video.thumbnail}
							alt={video.title}
							className="video-thumbnail"
						/>
						<div className="video-duration">{video.duration}</div>
					</div>
					<div className="video-info">
						<div className="channel-avatar">
							<img
								src={video.channelThumbnail}
								alt={video.channelName}
								className="avatar-img"
								onError={(e) => {
									e.target.src = "https://via.placeholder.com/36";
								}}
							/>
						</div>
						<div className="video-details">
							<h3 className="video-title" title={video.title}>
								{video.title}
							</h3>
							<p className="channel-name">{video.channelName}</p>
							<div className="video-stats">
								<span className="stat">{formatNumber(video.views)} views</span>
								<span className="stat-separator">•</span>
								<span className="stat">{formatDate(video.publishedAt)}</span>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default Video;
