import React, { useState } from 'react';

const SafeImage = ({ src, alt, className, style, loading = 'lazy' }) => {
    const [error, setError] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const placeholder = 'https://i.ibb.co/LDB2brRC/Untitled-design-6.png'; // Using the logo or a generic placeholder

    const handleError = () => {
        setError(true);
    };

    const handleLoad = () => {
        setLoaded(true);
    };

    return (
        <img
            src={error || !src ? placeholder : src}
            alt={alt}
            className={`${className} ${loaded ? 'loaded' : 'loading'}`}
            style={{ 
                ...style, 
                opacity: loaded ? 1 : 0.5,
                transition: 'opacity 0.3s ease-in-out'
            }}
            onError={handleError}
            onLoad={handleLoad}
            loading={loading}
        />
    );
};

export default SafeImage;
