import PropTypes from 'prop-types';
import React from 'react';
import DevInfoBox from '../DevInfoBox';



Developer.propTypes = {
    data: PropTypes.array,
};


Developer.defaultProps = {
    data: []
};


function Developer({ data }) {
    return (
        <section className="review" id="developer">
            <h1 className="heading">Team phát triển </h1>

            <div className="box-container">
                {data.map((ele, index) => (
                    <DevInfoBox data={ele} key={index} />
                ))}

            </div>
        </section>
    )
}

export default Developer
