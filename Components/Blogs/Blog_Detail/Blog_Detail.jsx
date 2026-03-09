"use client"
import React, { useEffect } from 'react'
import gsap from "gsap";

const BlogDetailsShimmer = () => {
	return (
		<section>
			<div className="container">
				<div className="row">
					<div className="col-lg-12 p-0">

						{/* Image Shimmer */}
						<div className="blog_img blog_pb">
							<div
								className="shimmer-bg rounded-2xl shimmer-100p-420"
							/>
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

			)
			}













			{/* <div class="e-n-accordion" aria-label="Accordion. Open links with Enter or Space, close with Escape, and navigate with Arrow Keys">
						<details id="e-n-accordion-item-3430" class="e-n-accordion-item" open="">
				<summary class="e-n-accordion-item-title" data-accordion-index="1" tabindex="0" aria-expanded="true" aria-controls="e-n-accordion-item-3430">
					<span class="e-n-accordion-item-title-header"><div class="e-n-accordion-item-title-text"> 1. Is Thailand a good destination for budget travelers? </div></span>
							<span class="e-n-accordion-item-title-icon">
			<span class="e-opened"><svg aria-hidden="true" class="e-font-icon-svg e-fas-minus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
			<span class="e-closed"><svg aria-hidden="true" class="e-font-icon-svg e-fas-plus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
		</span>

						</summary>
				<div role="region" aria-labelledby="e-n-accordion-item-3430" class="elementor-element elementor-element-4d1aa70 e-con-full e-flex e-con e-child" data-id="4d1aa70" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-f307233 elementor-widget elementor-widget-text-editor" data-id="f307233" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p><span style="font-weight: 400;">Yes, Thailand is one of the best destinations for low budget travel. Street food is affordable, public transport is cheap, and many attractions cost very little. Hostels and guesthouses are widely available. Even island trips can be inexpensive if you choose the right locations and avoid peak season.</span></p>								</div>
				</div>
				</div>
					</details>
						<details id="e-n-accordion-item-3431" class="e-n-accordion-item" open="">
				<summary class="e-n-accordion-item-title" data-accordion-index="2" tabindex="-1" aria-expanded="false" aria-controls="e-n-accordion-item-3431">
					<span class="e-n-accordion-item-title-header"><div class="e-n-accordion-item-title-text"> 2. How much money do you need per day in Thailand? </div></span>
							<span class="e-n-accordion-item-title-icon">
			<span class="e-opened"><svg aria-hidden="true" class="e-font-icon-svg e-fas-minus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
			<span class="e-closed"><svg aria-hidden="true" class="e-font-icon-svg e-fas-plus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
		</span>

						</summary>
				<div role="region" aria-labelledby="e-n-accordion-item-3431" class="elementor-element elementor-element-af26682 e-con-full e-flex e-con e-child" data-id="af26682" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-96da1b9 elementor-widget elementor-widget-text-editor" data-id="96da1b9" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p><span style="font-weight: 400;">Budget travelers can comfortably spend between 30 and 50 dollars per day. This includes food, basic accommodation, local transport, and one or two attractions. Costs may vary between cities and islands, but Thailand consistently offers great value across all regions. Careful planning helps you save even more.</span></p>								</div>
				</div>
				</div>
					</details>
						<details id="e-n-accordion-item-3432" class="e-n-accordion-item" open="">
				<summary class="e-n-accordion-item-title" data-accordion-index="3" tabindex="-1" aria-expanded="false" aria-controls="e-n-accordion-item-3432">
					<span class="e-n-accordion-item-title-header"><div class="e-n-accordion-item-title-text"> 3. What is the cheapest month to visit Thailand? </div></span>
							<span class="e-n-accordion-item-title-icon">
			<span class="e-opened"><svg aria-hidden="true" class="e-font-icon-svg e-fas-minus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
			<span class="e-closed"><svg aria-hidden="true" class="e-font-icon-svg e-fas-plus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
		</span>

						</summary>
				<div role="region" aria-labelledby="e-n-accordion-item-3432" class="elementor-element elementor-element-7fb93a8 e-con-full e-flex e-con e-child" data-id="7fb93a8" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-d5b0b47 elementor-widget elementor-widget-text-editor" data-id="d5b0b47" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p><span style="font-weight: 400;">The cheapest months are May, June, and September. These months fall between major tourism seasons, which reduces hotel prices and flight costs. Weather may bring occasional rain, but most days remain warm and pleasant. Travelers who want low crowds and low costs find this period ideal.</span></p>								</div>
				</div>
				</div>
					</details>
						<details id="e-n-accordion-item-3433" class="e-n-accordion-item" open="">
				<summary class="e-n-accordion-item-title" data-accordion-index="4" tabindex="-1" aria-expanded="false" aria-controls="e-n-accordion-item-3433">
					<span class="e-n-accordion-item-title-header"><div class="e-n-accordion-item-title-text"> 4. Are Thai islands expensive for budget travelers? </div></span>
							<span class="e-n-accordion-item-title-icon">
			<span class="e-opened"><svg aria-hidden="true" class="e-font-icon-svg e-fas-minus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
			<span class="e-closed"><svg aria-hidden="true" class="e-font-icon-svg e-fas-plus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
		</span>

						</summary>
				<div role="region" aria-labelledby="e-n-accordion-item-3433" class="elementor-element elementor-element-8d5b884 e-con-full e-flex e-con e-child" data-id="8d5b884" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-f512cb5 elementor-widget elementor-widget-text-editor" data-id="f512cb5" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p><span style="font-weight: 400;">Some islands can be pricey, but many are very budget friendly. Koh Lanta, Koh Chang, and parts of Phuket offer low cost stays, cheap food, and free public beaches. Avoiding high end resorts and choosing local restaurants helps keep daily expenses low. Transport is also affordable.</span></p>								</div>
				</div>
				</div>
					</details>
						<details id="e-n-accordion-item-3434" class="e-n-accordion-item" open="">
				<summary class="e-n-accordion-item-title" data-accordion-index="5" tabindex="-1" aria-expanded="false" aria-controls="e-n-accordion-item-3434">
					<span class="e-n-accordion-item-title-header"><div class="e-n-accordion-item-title-text"> 5. Is Thailand safe for solo travelers on a budget? </div></span>
							<span class="e-n-accordion-item-title-icon">
			<span class="e-opened"><svg aria-hidden="true" class="e-font-icon-svg e-fas-minus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
			<span class="e-closed"><svg aria-hidden="true" class="e-font-icon-svg e-fas-plus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
		</span>

						</summary>
				<div role="region" aria-labelledby="e-n-accordion-item-3434" class="elementor-element elementor-element-8637edf e-flex e-con-boxed e-con e-child" data-id="8637edf" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-424f6e6 elementor-widget elementor-widget-text-editor" data-id="424f6e6" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p><span style="font-weight: 400;">Thailand is known for being safe and welcoming, even for solo travelers. Hostels provide social environments, transport is reliable, and locals are friendly. Basic precautions are still important, but most travelers feel comfortable exploring cities, markets, temples, and beaches on their own.</span></p>								</div>
				</div>
					</div>
				</div>
					</details>
					</div> */}

		</>
	)
}
