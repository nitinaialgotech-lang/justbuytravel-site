import moment from 'moment';
import React, { useState } from 'react'

function getInitials(displayName) {
    if (!displayName || typeof displayName !== "string") return "?";
    const parts = displayName.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
    return (parts[0]?.[0] || "?").toUpperCase();
}

function ReviewAvatar({ photoUri, displayName, size = 40 }) {
    const [broken, setBroken] = useState(false);
    const showPhoto = photoUri && !broken;
    const initials = getInitials(displayName);
    if (showPhoto) {
        return (
            <img
                src={photoUri}
                width={size}
                height={size}
                alt={displayName || "Reviewer"}
                onError={() => setBroken(true)}
                style={{ objectFit: "cover", borderRadius: "50%" }}
            />
        );
    }
    return (
        <span
            className="review_avatar_initials"
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                background: "#e0e0e0",
                color: "#555",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: Math.max(12, size * 0.4),
                fontWeight: 600,
            }}
        >
            {initials}
        </span>
    );
}

export default function HotelReviews({ reviews }) {
    return (
        <>
            <section className='review_section'>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            {
                                reviews?.map((item) => {
                                    return (
                                        <>

                                            <div className="review_box_section">
                                                <div className="review_head flex items-center gap-2">
                                                    <div className="usr_img">
                                                        <ReviewAvatar photoUri={item?.authorAttribution?.photoUri} displayName={item?.authorAttribution?.displayName} size={40} />

                                                    </div>
                                                    <div className="user_info">
                                                        <p className='m-0'>{item?.authorAttribution?.displayName}   <span>wrote a review {moment(item?.publishTime).format("DD MMM YYYY hh:mm A")}</span></p>
                                                    </div>
                                                </div>
                                                {/* ************* */}
                                                <div className="content">
                                                    <p>
                                                        {item?.text?.text}
                                                    </p>
                                                </div>

                                            </div>
                                            <hr></hr>
                                        </>
                                    )

                                })
                            }
                        </div>

                    </div>
                </div>

            </section>

        </>
    )
}
