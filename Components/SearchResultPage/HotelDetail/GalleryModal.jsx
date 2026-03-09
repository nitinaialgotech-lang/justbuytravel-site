"use client";

import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "./GalleryModal.css";

function getImageSrc(item, maxWidth = 1920) {
    if (item?.type === "google") {
        return `/api/get-photo?name=${encodeURIComponent(item.name)}&maxWidthPx=${maxWidth}`;
    }
    return item?.url;
}

export default function GalleryModal({ isOpen, onClose, images, hotelName, initialIndex = 0, onViewDeals }) {
    const [activeIndex, setActiveIndex] = React.useState(initialIndex);
    const swiperRef = React.useRef(null);

    useEffect(() => {
        setActiveIndex(initialIndex);
        if (swiperRef.current?.swiper) {
            swiperRef.current.swiper.slideTo(initialIndex);
        }
    }, [initialIndex, isOpen]);

    const goPrev = useCallback(() => {
        swiperRef.current?.swiper?.slidePrev();
    }, []);

    const goNext = useCallback(() => {
        swiperRef.current?.swiper?.slideNext();
    }, []);

    const handleKeyDown = useCallback(
        (e) => {
            if (!isOpen) return;
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "ArrowRight") goNext();
        },
        [isOpen, onClose, goPrev, goNext]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const onSlideChange = (swiper) => {
        setActiveIndex(swiper.activeIndex);
    };

    if (!isOpen) return null;

    const total = images?.length || 0;
    const hasMultiple = total > 1;

    const modalContent = (
        <div className="gallery-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Image gallery">
            <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <header className="gallery-modal-header">
                    <div className="gallery-modal-title">
                        <h2 className="gallery-modal-hotel-name">{hotelName || "Photo Gallery"}</h2>
                        {total > 0 && (
                            <span className="gallery-modal-counter">
                                {activeIndex + 1} / {total}
                            </span>
                        )}
                    </div>
                    <div className="gallery-modal-actions">
                        {onViewDeals && (
                            <button
                                type="button"
                                className="gallery-modal-cta"
                                onClick={() => { onClose(); onViewDeals?.(); }}
                            >
                                View Deals
                            </button>
                        )}
                        <button
                            type="button"
                            className="gallery-modal-close"
                            onClick={onClose}
                            aria-label="Close gallery"
                        >
                            <IoClose size={28} />
                        </button>
                    </div>
                </header>

                {/* Main content */}
                <div className="gallery-modal-content">
                    {hasMultiple && (
                        <button
                            type="button"
                            className="gallery-modal-nav gallery-modal-nav-prev"
                            onClick={goPrev}
                            aria-label="Previous image"
                        >
                            <IoChevronBack size={28} />
                        </button>
                    )}

                    <div className="gallery-modal-main">
                        {!images?.length ? (
                            <div className="gallery-modal-empty">No images available</div>
                        ) : (
                            <Swiper
                                ref={swiperRef}
                                slidesPerView={1}
                                effect="fade"
                                fadeEffect={{ crossFade: true }}
                                modules={[EffectFade, Navigation]}
                                onSwiper={(swiper) => swiper.slideTo(initialIndex)}
                                onSlideChange={onSlideChange}
                                className="gallery-modal-swiper"
                                allowTouchMove={hasMultiple}
                            >
                                {images.map((item, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="gallery-modal-slide">
                                            <img
                                                src={getImageSrc(item, 1920)}
                                                alt={`${hotelName || "Hotel"} - ${index + 1}`}
                                                loading="eager"
                                                draggable={false}
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>

                    {hasMultiple && (
                        <button
                            type="button"
                            className="gallery-modal-nav gallery-modal-nav-next"
                            onClick={goNext}
                            aria-label="Next image"
                        >
                            <IoChevronForward size={28} />
                        </button>
                    )}
                </div>

                {/* Thumbnail strip */}
                {images?.length > 1 && (
                    <div className="gallery-modal-thumbnails">
                        <div className="gallery-modal-thumbnails-inner">
                            {images.map((item, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={`gallery-modal-thumb ${index === activeIndex ? "active" : ""}`}
                                    onClick={() => {
                                        swiperRef.current?.swiper?.slideTo(index);
                                    }}
                                >
                                    <img
                                        src={getImageSrc(item, 120)}
                                        alt=""
                                        loading="lazy"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return typeof document !== "undefined" ? createPortal(modalContent, document.body) : null;
}
