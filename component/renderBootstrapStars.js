export const renderBootstrapStars = (rating) => {
    const stars = [];
    const value = Number(rating) || 0;
    const maxStars = 5;
    const fullStars = Math.floor(value);
    const hasHalfStar = value - fullStars >= 0.5;

    for (let i = 0; i < Math.min(fullStars, maxStars); i++) {
        stars.push(<i key={`full-${i}`} className="bi bi-star-fill"></i>);
    }

    if (hasHalfStar && stars.length < maxStars) {
        stars.push(<i key="half" className="bi bi-star-half"></i>);
    }

    while (stars.length < maxStars) {
        stars.push(<i key={`empty-${stars.length}`} className="bi bi-star"></i>);
    }

    return stars;
};