import { Carousel } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import SliderItem from '../SliderItem';

function Slider() {

    const { features } = useSelector(state => state.home);


    return (

        <Carousel autoplay dots={false}>
            {features.map((ele, index) => (

                <SliderItem
                    key={index}
                    src={ele.image}
                    title={ele.title}
                    detail={ele.descrpition}
                />

            ))}
        </Carousel>
    );
}

export default Slider;
