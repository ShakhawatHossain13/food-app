import React from "react";
import { useState } from "react";
import './style.css';
import homeslider from './home_slider.png';

type SliderDataType = {
    title: string;
};

const Slider: React.FC = () => {
    const [posts, setPost] = useState<SliderDataType[]>([])
    const [query, setQuery] = React.useState<string>("");

    const eventChange = () => {
        fetch("./food.json",
        ).then(posts => posts.json()).then(getPost => {
            setPost(getPost);

        }).catch((error) => {
            console.log(error);
        });
    }  

    let filteredPosts;
    filteredPosts = posts.filter((p) =>
        p.title.toLowerCase().includes(query));

    const eventOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value.toLowerCase())
    }

    console.log(filteredPosts);

    return (
        <React.Fragment>
            <section className="slider" style={{ background: `url(${homeslider}) fixed` }} >
                <div className="slider__row">
                    <div className="slider__row__main">
                        <h1 className="slider__row__main__title">Best Food waiting for your Belly</h1>
                        <div className="slider__row__main__search">
                            <input
                                className="slider__row__main__search__input"
                                name="searchInput"
                                type="text"
                                value=""
                                onChange={eventOnChange}
                                placeholder="Search"
                            />
                            <button className="slider__row__main__search__btn">Search</button>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
};

export default Slider;
