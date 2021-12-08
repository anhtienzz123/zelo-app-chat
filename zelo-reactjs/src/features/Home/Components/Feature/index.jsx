import PropTypes from 'prop-types';
import React from 'react';
import FeatureBox from '../FeatureBox';


Feature.propTypes = {
    data: PropTypes.array,
};

Feature.defaultProps = {
    data: [],
};

function Feature({ data }) {
    return (
        <section className="features" id="features">
            <h1 className="heading">Tính năng </h1>

            <div className="box-container">
                {data.map((ele, index) => (
                    <FeatureBox
                        data={ele}
                        key={index}
                    />
                ))}
            </div>
        </section>
    )
}

export default Feature
