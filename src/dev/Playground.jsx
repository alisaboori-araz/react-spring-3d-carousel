import React, { useState } from "react";
import Carousel from "../components/Carousel";
import { v4 as uuidv4 } from "uuid";
import { config } from "react-spring";

const Example = () => {
    const [state, setState] = useState({
        goToSlide: 0,
        offsetRadius: 2,
        showNavigation: true,
        config: config.gentle,
        goToSlideDelay: 200,
    });

    const slides = [
        {
            content: (
                <img src="https://picsum.photos/800/801/?random" alt="1" />
            ),
        },
        {
            content: (
                <img src="https://picsum.photos/800/802/?random" alt="2" />
            ),
        },
        {
            content: (
                <img src="https://picsum.photos/600/803/?random" alt="3" />
            ),
        },
        {
            content: (
                <img src="https://picsum.photos/800/500/?random" alt="4" />
            ),
        },
        {
            content: (
                <img src="https://picsum.photos/800/804/?random" alt="6" />
            ),
        },
        {
            content: (
                <img src="https://picsum.photos/500/800/?random" alt="7" />
            ),
        },
        {
            content: (
                <img src="https://picsum.photos/800/600/?random" alt="8" />
            ),
        },
        {
            content: (
                <img src="https://picsum.photos/805/800/?random" alt="9" />
            ),
        },
    ].map((slide, index) => ({
        ...slide,
        key: uuidv4(),
        onClick: () => setState((prev) => ({ ...prev, goToSlide: index })),
    }));

    const onChangeInput = (e) => {
        const value =
            e.target.type === "checkbox"
                ? e.target.checked
                : parseInt(e.target.value, 10) || 0;
        setState((prev) => ({ ...prev, [e.target.name]: value }));
    };

    const setConfig = (newConfig) => {
        setState((prev) => ({ ...prev, config: newConfig }));
    };

    return (
        <div style={{ width: "80%", height: "500px", margin: "0 auto" }}>
            <Carousel
                slides={slides}
                goToSlide={state.goToSlide}
                goToSlideDelay={state.goToSlideDelay}
                offsetRadius={state.offsetRadius}
                showNavigation={state.showNavigation}
                animationConfig={state.config}
            />
            <div
                style={{
                    margin: "0 auto",
                    marginTop: "2rem",
                    width: "50%",
                    display: "flex",
                    justifyContent: "space-around",
                }}>
                <div>
                    <label>Go to slide: </label>
                    <input name="goToSlide" onChange={onChangeInput} />
                </div>
                <div>
                    <label>Go to slide delay: </label>
                    <input name="goToSlideDelay" onChange={onChangeInput} />
                </div>
                <div>
                    <label>Offset Radius: </label>
                    <input name="offsetRadius" onChange={onChangeInput} />
                </div>
                <div>
                    <label>Show navigation: </label>
                    <input
                        type="checkbox"
                        checked={state.showNavigation}
                        name="showNavigation"
                        onChange={onChangeInput}
                    />
                </div>
                <div>
                    <button
                        onClick={() => setConfig(config.gentle)}
                        disabled={state.config === config.gentle}>
                        Gentle Transition
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => setConfig(config.slow)}
                        disabled={state.config === config.slow}>
                        Slow Transition
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => setConfig(config.wobbly)}
                        disabled={state.config === config.wobbly}>
                        Wobbly Transition
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => setConfig(config.stiff)}
                        disabled={state.config === config.stiff}>
                        Stiff Transition
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Example;
