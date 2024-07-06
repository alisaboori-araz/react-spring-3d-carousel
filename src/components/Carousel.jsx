import React, { useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import Slide from "./Slide";
import leftNavigation from "../static/LeftNavigation.png";
import rightNavigation from "../static/RightNavigation.png";
import PropTypes from "prop-types";

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`;

const NavigationButtons = styled.div`
    position: relative;
    display: flex;
    height: 40px;
    margin: 0 auto;
    width: 20%;
    margin-top: 1rem;
    justify-content: space-between;

    img {
        height: 100%;
    }
`;

const DEFAULT_GO_TO_SLIDE_DELAY = 200;

function mod(a, b) {
    return ((a % b) + b) % b;
}

const Carousel = ({
    slides,
    goToSlide: propsGoToSlide,
    showNavigation,
    offsetRadius = 2,
    animationConfig = { tension: 120, friction: 14 },
    goToSlideDelay = DEFAULT_GO_TO_SLIDE_DELAY,
    offsetFn,
}) => {
    const [index, setIndex] = useState(0);
    const [goToSlide, setGoToSlide] = useState(null);
    const [newSlide, setNewSlide] = useState(false);

    const modBySlidesLength = useCallback(
        (index) => mod(index, slides.length),
        [slides.length]
    );

    const moveSlide = useCallback(
        (direction) => {
            setIndex((prevIndex) => modBySlidesLength(prevIndex + direction));
            setGoToSlide(null);
        },
        [modBySlidesLength]
    );

    const getShortestDirection = useCallback(
        (from, to) => {
            if (from > to) {
                return from - to > slides.length - 1 - from + to ? 1 : -1;
            } else if (to > from) {
                return to - from > from + slides.length - 1 - to ? -1 : 1;
            }
            return 0;
        },
        [slides.length]
    );

    const handleGoToSlide = useCallback(() => {
        if (typeof goToSlide !== "number") return;

        const targetSlide = mod(goToSlide, slides.length);

        if (targetSlide !== index) {
            const direction = getShortestDirection(index, targetSlide);
            const isFinished =
                modBySlidesLength(index + direction) === targetSlide;

            setIndex(modBySlidesLength(index + direction));
            setNewSlide(isFinished);
            setGoToSlide(isFinished ? null : targetSlide);
        }
    }, [
        goToSlide,
        index,
        slides.length,
        getShortestDirection,
        modBySlidesLength,
    ]);

    useEffect(() => {
        if (propsGoToSlide !== goToSlide) {
            setGoToSlide(propsGoToSlide);
            setNewSlide(true);
        }
    }, [propsGoToSlide]);

    useEffect(() => {
        let timeoutId;
        if (typeof goToSlide === "number") {
            if (newSlide) {
                handleGoToSlide();
            } else if (index !== goToSlide) {
                timeoutId = setTimeout(handleGoToSlide, goToSlideDelay);
            }
        }
        return () => clearTimeout(timeoutId);
    }, [goToSlide, index, newSlide, handleGoToSlide, goToSlideDelay]);

    const clampOffsetRadius = useCallback(
        (offsetRadius) => {
            const upperBound = Math.floor((slides.length - 1) / 2);
            return Math.min(Math.max(offsetRadius, 0), upperBound);
        },
        [slides.length]
    );

    const getPresentableSlides = useCallback(() => {
        const clampedOffsetRadius = clampOffsetRadius(offsetRadius);
        const presentableSlides = [];

        for (let i = -clampedOffsetRadius; i < 1 + clampedOffsetRadius; i++) {
            presentableSlides.push(slides[modBySlidesLength(index + i)]);
        }

        return presentableSlides;
    }, [slides, index, offsetRadius, clampOffsetRadius, modBySlidesLength]);

    const navigationButtons = showNavigation && (
        <NavigationButtons>
            <img
                src={leftNavigation}
                onClick={() => moveSlide(-1)}
                style={{ marginRight: "2rem" }}
                alt="Previous slide"
            />
            <img
                src={rightNavigation}
                onClick={() => moveSlide(1)}
                style={{ marginLeft: "2rem" }}
                alt="Next slide"
            />
        </NavigationButtons>
    );

    return (
        <>
            <Wrapper>
                {getPresentableSlides().map((slide, presentableIndex) => (
                    <Slide
                        key={slide.key}
                        content={slide.content}
                        onClick={slide.onClick}
                        offsetRadius={clampOffsetRadius(offsetRadius)}
                        index={presentableIndex}
                        animationConfig={animationConfig}
                        offsetFn={offsetFn}
                    />
                ))}
            </Wrapper>
            {navigationButtons}
        </>
    );
};

Carousel.propTypes = {
    slides: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.any,
            content: PropTypes.object,
        })
    ).isRequired,
    goToSlide: PropTypes.number,
    showNavigation: PropTypes.bool,
    offsetRadius: PropTypes.number,
    animationConfig: PropTypes.object,
    goToSlideDelay: PropTypes.number,
    offsetFn: PropTypes.func,
};

export default Carousel;
