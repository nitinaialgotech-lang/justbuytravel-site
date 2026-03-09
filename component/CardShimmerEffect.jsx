import React from 'react'

export default function CardShimmerEffect() {
    return (
        <>
            <div className="card_col">
                <div className="recommend_card_box card_rounded recomand_card_shadow margin_lr">
                    <div className="card_box">
                        {/* IMAGE */}
                        <div
                            className="card_box_img card_rounded relative overflow-hidden shimmer-bg shimmer-min-250"
                        />

                        {/* DETAILS */}
                        <div className="card_box_detail card_rounded relative">
                            {/* TITLE */}
                            <div className="shimmer-bg shimmer-rounded shimmer-75x18" />

                            {/* SPACING */}
                            <div className="shimmer-spacer-10" />

                            {/* RATING + BUTTON */}
                            <div className="price_book flex justify-between items-center">
                                {/* RATING */}
                                <div className="flex gap-1 items-center">
                                    <div className="shimmer-bg shimmer-rounded shimmer-60x14" />
                                    <div className="shimmer-bg shimmer-rounded shimmer-40x14" />
                                </div>

                                {/* BUTTON */}
                                <div className="shimmer-bg shimmer-rounded shimmer-90x28" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
