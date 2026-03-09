"use client"
import React, { useEffect, useMemo, useState } from 'react'
import './ImageGallery.css'

export default function ImageGallery({ images = [], hotelName = '' }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Helper function to get full resolution image URL from images_full
    const getImageUrl = (imageItem) => {
        if (!imageItem) return null;
        
        // If it's a string, return it directly (from images array)
        if (typeof imageItem === 'string') {
            return imageItem;
        }
        
        // If it's an object (from images_full), extract the original URL
        if (typeof imageItem === 'object' && imageItem !== null) {
            // images_full structure: { original: "url", thumbnail: "url", ... }
            return imageItem.original || imageItem.url || imageItem.thumbnail || null;
        }
        
        // If it's an array, get the first element
        if (Array.isArray(imageItem)) {
            const firstElement = imageItem[0];
            if (typeof firstElement === 'string') {
                return firstElement;
            }
            if (typeof firstElement === 'object' && firstElement !== null) {
                return firstElement.original || firstElement.url || firstElement.thumbnail || null;
            }
            return null;
        }
        
        return null;
    };

    const validImages = useMemo(() => {
        return images
            .map((img, index) => {
                const url = getImageUrl(img);
                return url ? { url, index } : null;
            })
            .filter((img) => img !== null && img.url && img.url.trim() !== '');
    }, [images]);

    const clampIndex = (idx) => {
        if (!validImages || validImages.length === 0) return 0;
        if (idx < 0) return 0;
        if (idx >= validImages.length) return validImages.length - 1;
        return idx;
    };

    const openLightbox = (index) => {
        setCurrentImageIndex(clampIndex(index));
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = 'unset';
    };

    const nextImage = (e) => {
        if (e) e.stopPropagation();
        setCurrentImageIndex((prev) => {
            if (!validImages || validImages.length === 0) return 0;
            const nextIndex = (prev + 1) % validImages.length;
            return nextIndex;
        });
    };

    const prevImage = (e) => {
        if (e) e.stopPropagation();
        setCurrentImageIndex((prev) => {
            if (!validImages || validImages.length === 0) return 0;
            const prevIndex = (prev - 1 + validImages.length) % validImages.length;
            return prevIndex;
        });
    };

    // Handle keyboard navigation
    useEffect(() => {
        if (!lightboxOpen) return;

        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
                return;
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                if (!validImages || validImages.length === 0) return;
                setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                if (!validImages || validImages.length === 0) return;
                setCurrentImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [lightboxOpen, validImages.length]);

    if (validImages.length === 0) {
        return null; // Don't render anything if no valid images
    }

    const safeCurrentImageIndex = clampIndex(currentImageIndex);
    const firstImage = validImages[0];
    const remainingImages = validImages.slice(1);
    const totalImages = validImages.length;
    const maxSmallImages = 3; // Maximum 3 small images
    const visibleSmallImages = Math.min(remainingImages.length, maxSmallImages);
    const lastVisibleSmallImageIndex = visibleSmallImages - 1;

    return (
        <>
            <div className="image-gallery">
                <div className="gallery-container">
                    {/* First big image - 50% */}
                    {firstImage && (
                        <div 
                            className="gallery-item gallery-item-large"
                            onClick={() => openLightbox(0)}
                        >
                            <div className="gallery-image-wrapper">
                                <img 
                                    src={firstImage.url} 
                                    alt={`${hotelName} - Image 1`}
                                    loading="eager"
                                />
                                <div className="gallery-overlay">
                                    <span className="gallery-icon">🔍</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Remaining images - 2 columns, 25% each */}
                    {remainingImages.length > 0 && (
                        <div className="gallery-items-small">
                            {remainingImages.slice(0, maxSmallImages).map((img, index) => {
                                const actualIndexInValidImages = index + 1; // Index in validImages array
                                const isLastVisibleImage = index === lastVisibleSmallImageIndex;
                                const remainingCount = totalImages - (1 + visibleSmallImages); // Total - (1 large + visible small)
                                
                                return (
                                    <div 
                                        key={`${img.url}-${index}`} 
                                        className="gallery-item gallery-item-small"
                                        onClick={() => openLightbox(actualIndexInValidImages)}
                                    >
                                        <div className="gallery-image-wrapper">
                                            <img 
                                                src={img.url} 
                                                alt={`${hotelName} - Image ${actualIndexInValidImages + 1}`}
                                                loading="lazy"
                                            />
                                            <div className="gallery-overlay">
                                                <span className="gallery-icon">🔍</span>
                                            </div>
                                            {/* Show image count on last visible small image if there are more images */}
                                            {isLastVisibleImage && remainingCount > 0 && (
                                                <div className="gallery-image-count">
                                                    +{remainingCount}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div className="lightbox" onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">
                        ×
                    </button>
                    <button 
                        className="lightbox-nav lightbox-prev" 
                        onClick={prevImage}
                        aria-label="Previous image"
                    >
                        ‹
                    </button>
                    <button 
                        className="lightbox-nav lightbox-next" 
                        onClick={nextImage}
                        aria-label="Next image"
                    >
                        ›
                    </button>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img 
                            key={safeCurrentImageIndex}
                            src={validImages[safeCurrentImageIndex]?.url} 
                            alt={`${hotelName} - Image ${safeCurrentImageIndex + 1}`}
                        />
                        <div className="lightbox-counter">
                            {safeCurrentImageIndex + 1} / {validImages.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

