import { CheckCircleTwoTone, FireOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

AboutWebApp.propTypes = {
    data: PropTypes.object,
};


AboutWebApp.defaultProps = {
    data: {}
};



function AboutWebApp({ data }) {
    return (
        <section className="about" id="about">
            <h1 className="heading">Ứng dụng</h1>

            <div className="column">
                <div className="image">
                    <img src={data.image} />
                </div>

                <div className="content">
                    <h3>{data.title}</h3>

                    {data.desciption && data.desciption.map((ele, index) => (
                        <p key={index}>
                            <CheckCircleTwoTone />&nbsp;{ele}
                        </p>
                    ))}

                    <div className="buttons">
                        <Link to='/account/login' className="btn">
                            <FireOutlined /> Trải nghiệm phiên bản web
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutWebApp
