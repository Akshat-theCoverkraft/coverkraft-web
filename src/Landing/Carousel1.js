import React, { useState, useEffect } from 'react';
import './component/CSS/carousel1.css';
import API_URL from '../ServiceModule/Service';
import IMAGE_PATH from '../ServiceModule/imagePath';

const slideWidth = 30; // Width of each slide

const sleep = (ms = 0) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const createItem = (position, idx, items) => {
    const item = {
        styles: {
            transform: `translateX(${position * slideWidth}rem)`,
        },
        video: items[idx].video,
        subtitle: items[idx].subtitle,
    };

    switch (position) {
        case items.length - 1:
        case items.length + 1:
            item.styles = { ...item.styles, filter: 'grayscale(1)' };
            break;
        case items.length:
            break;
        default:
            item.styles = { ...item.styles, opacity: 0 };
            break;
    }

    return item;
};

const CarouselSlideItem = ({ pos, idx, activeIdx, items }) => {
    const item = createItem(pos, idx, items);

    return (
        <li className="carousel__slide-item" style={item.styles}>
            <div className="carousel__slide-item-img-link">
                <img src={IMAGE_PATH + item.video} alt={item.subtitle} />
            </div>
        </li>
    );
};

const Carousel1 = () => {
    const [items, setItems] = useState([]);
    const [carouselItems, setCarouselItems] = useState([]);
    const [isTicking, setIsTicking] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);

    useEffect(() => {
        // Fetch the data from the API
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}featureVideo/getAll`);
                const result = await response.json();
                if (result.status) {
                    setItems(result.data);
                    setCarouselItems([...Array(result.data.length * 2).keys()]); // Double the length for infinite scroll
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const bigLength = items.length * 2; // Adjust length for the duplicated array

    const prevClick = (jump = 3) => { // Adjusted jump for 3 items at a time
        if (!isTicking) {
            setIsTicking(true);
            setCarouselItems((prev) => {
                return prev.map((_, i) => prev[(i + jump) % bigLength]);
            });
        }
    };

    const nextClick = (jump = 3) => { // Adjusted jump for 3 items at a time
        if (!isTicking) {
            setIsTicking(true);
            setCarouselItems((prev) => {
                return prev.map((_, i) => prev[(i - jump + bigLength) % bigLength]);
            });
        }
    };

    const handleDotClick = (idx) => {
        if (idx < activeIdx) prevClick(activeIdx - idx);
        if (idx > activeIdx) nextClick(idx - activeIdx);
    };

    useEffect(() => {
        if (isTicking) sleep(300).then(() => setIsTicking(false));
    }, [isTicking]);

    useEffect(() => {
        setActiveIdx((carouselItems.length - (carouselItems[0] % items.length)) % items.length);
    }, [carouselItems]);

    return (
        <div className="carousel__wrap">
            <div className="carousel__inner">
                <button className="carousel__btn carousel__btn--prev" onClick={() => prevClick()}>
                    <i className="carousel__btn-arrow carousel__btn-arrow--left" />
                </button>
                <div className="carousel__container">
                    <ul className="carousel__slide-list">
                        {carouselItems.map((pos, i) => (
                            <CarouselSlideItem
                                key={i}
                                idx={i % items.length}
                                pos={pos}
                                activeIdx={activeIdx}
                                items={items}
                            />
                        ))}
                    </ul>
                </div>
                <button className="carousel__btn carousel__btn--next" onClick={() => nextClick()}>
                    <i className="carousel__btn-arrow carousel__btn-arrow--right" />
                </button>
                <div className="carousel__dots">
                    {items.slice(0, items.length).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handleDotClick(i)}
                            className={i === activeIdx ? 'dot active' : 'dot'}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Carousel1;
