import React, { useState, useEffect } from 'react';
import './TrendingMovies.css';

const TrendingMovies = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsToDisplay, setItemsToDisplay] = useState(5);

    const API_KEY = '4d039cadaa42a698f4bb258d94dc4181';
    const ENDPOINT = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=fr-FR`;
    const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch(ENDPOINT);
                const data = await response.json();
                if (data.results) {
                    setMovies(data.results);
                }
            } catch (error) {
                console.error("Error fetching trending movies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    useEffect(() => {
        const updateItemsToDisplay = () => {
            if (window.innerWidth >= 1200) setItemsToDisplay(5);
            else if (window.innerWidth >= 992) setItemsToDisplay(4);
            else if (window.innerWidth >= 768) setItemsToDisplay(3);
            else if (window.innerWidth >= 480) setItemsToDisplay(2);
            else setItemsToDisplay(1);
        };

        updateItemsToDisplay();
        window.addEventListener('resize', updateItemsToDisplay);
        return () => window.removeEventListener('resize', updateItemsToDisplay);
    }, []);

    useEffect(() => {
        if (movies.length > itemsToDisplay) {
            const interval = setInterval(() => {
                nextSlide();
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [movies.length, currentIndex, itemsToDisplay]);

    const nextSlide = () => {
        setCurrentIndex((prev) => {
            const maxIndex = movies.length - itemsToDisplay;
            return prev >= maxIndex ? 0 : prev + 1;
        });
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => {
            const maxIndex = movies.length - itemsToDisplay;
            return prev <= 0 ? maxIndex : prev - 1;
        });
    };

    if (loading) return (
        <div className="trending-movies-section container">
            <div className="trending-header">
                <h2>Tendances de la semaine</h2>
            </div>
            <div className="movies-carousel-wrapper">
                <div className="movies-track">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="movie-card-item" style={{ flex: `0 0 ${100 / itemsToDisplay}%` }}>
                            <div className="movie-card-inner skeleton"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (movies.length === 0) return null;

    return (
        <section className="trending-movies-section container">
            <div className="trending-header">
                <h2>Tendances de la semaine</h2>
            </div>

            <div className="movies-carousel-wrapper">
                <button className="carousel-nav-btn prev" onClick={prevSlide}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>

                <div 
                    className="movies-track"
                    style={{
                        transform: `translateX(-${currentIndex * (100 / itemsToDisplay)}%)`
                    }}
                >
                    {movies.map((movie) => (
                        <div 
                            key={movie.id} 
                            className="movie-card-item"
                            style={{ flex: `0 0 ${100 / itemsToDisplay}%` }}
                        >
                            <div className="movie-card-inner">
                                <div className="vod-badge">VOD</div>
                                <img 
                                    src={movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'} 
                                    alt={movie.title} 
                                    className="movie-poster"
                                    loading="lazy"
                                />
                                <div className="movie-overlay">
                                    <h4 className="movie-title">{movie.title || movie.name}</h4>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="carousel-nav-btn next" onClick={nextSlide}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>
            </div>
        </section>
    );
};

export default TrendingMovies;
