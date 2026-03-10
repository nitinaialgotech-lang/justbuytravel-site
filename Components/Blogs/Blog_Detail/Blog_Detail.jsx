"use client";
import React, { useEffect } from "react";
import gsap from "gsap";

const BlogDetailsShimmer = () => {
	return (
		<section>
			<div className="container">
				<div className="row">
					<div className="col-lg-12 p-0">
						{/* Image Shimmer */}
						<div className="blog_img blog_pb">
							<div className="shimmer-bg rounded-2xl shimmer-100p-420" />
						</div>

						{/* Content Shimmer */}
						<div className="blog_content blog_pb">
							{/* Paragraph lines */}
							{Array.from({ length: 8 }).map((_, i) => (
								<div
									key={i}
									className={`shimmer-line mb-3 ${i === 7 ? "shimmer-60p-16" : "shimmer-100p-16"}`}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default function Blog_detail({ content, blog_image, load }) {
	useEffect(() => {
		if (load) return;

		const timer = setTimeout(() => {
			const allDetails = document.querySelectorAll('.e-n-accordion-item');
			allDetails.forEach((details) => {
				details.setAttribute('open', '');
			});
		}, 100);
		return () => clearTimeout(timer);
	}, [load, content]);
	return (
		<>
			{/* ***************************** */}
			{load ? (
				<BlogDetailsShimmer />
			) : (
				<div className="container">
					<div className="row">
						<div className="col-lg-12 p-0">
							<div className="blog_img blog_pb">
								{Array.isArray(blog_image) &&
									blog_image.map((item, index) => (
										<img
											key={`blog-image-${item?.url || index}`}
											src={item?.url}
											alt=""
											className=""
										/>
									))}
							</div>
							<div
								className="blog_content  "
								dangerouslySetInnerHTML={{ __html: content }}
							>
								{/* ******************* */}
								{/* ******************* */}
							</div>
						</div>
					</div>
				</div>
			)}


		</>
	);
}
