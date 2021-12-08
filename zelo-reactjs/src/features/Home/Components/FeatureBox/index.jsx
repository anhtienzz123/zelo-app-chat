import PropTypes from 'prop-types';
import React from 'react';

FeatureBox.propTypes = {
    data: PropTypes.object,
};

FeatureBox.defaultProps = {
    data: {},
};

function FeatureBox({ data }) {
    return (
        <div className="box">
            <img src={data.image} />
            <h3>{data.title}</h3>
            <p>
                {data.descrpition}
            </p>
        </div>
    );
}

export default FeatureBox;