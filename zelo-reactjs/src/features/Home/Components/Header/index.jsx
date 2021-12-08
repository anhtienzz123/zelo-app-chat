import { DownloadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import React from 'react';
import Navbar from '../Navbar';



Header.propTypes = {
    data: PropTypes.object,
};


Header.defaultProps = {
    data: {}
};


function Header({ data }) {
    return (
        <>
            <Navbar />
            <section className="home" id="home">
                <div className="content">
                    <h3>
                        {data.title}
                        <br />
                        <span>{data.appname}</span>
                    </h3>
                    <p>
                        {data.description}
                    </p>
                    <a href={data.linkDownload} target='_blank' className="btn">
                        <DownloadOutlined /> Tải ngay phiên bản mobile
                    </a>
                </div>

                <div className="image">
                    <img src={data.image} />
                </div>
            </section>
        </>
    )
}

export default Header
