import { Spin } from 'antd';
import React from 'react';
import 'react-quill/dist/quill.snow.css'; // ES6
import { useDispatch, useSelector } from 'react-redux';
import AboutWebApp from './Components/AboutWebApp';
import Developer from './Components/Developer';
import Feature from './Components/Feature';
import Footer from './Components/Footer';
import Header from './Components/Header';
import './style.scss';

function Home(props) {
    const { developers, infoApp, isLoading, features, infoWebApps } =
        useSelector((state) => state.home);

    return (
        <Spin size="large" spinning={isLoading}>
            <div className="home_page">
                <Header data={infoApp} />
                <Feature data={features} />
                <AboutWebApp data={infoWebApps} />
                <Developer data={developers} />
                <Footer data={infoWebApps.additionalInfo} />
            </div>
        </Spin>
    );
}

export default Home;
