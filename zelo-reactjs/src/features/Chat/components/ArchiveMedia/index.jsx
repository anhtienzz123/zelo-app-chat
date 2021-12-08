import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import { CaretDownOutlined } from '@ant-design/icons';
import ImageItem from '../ImageItem';
import { Image } from 'antd';
import ModalVideoCustom from 'components/ModalVideoCustom';
import ThumbnailCustom from 'components/ThumbnailCustom';
ArchiveMedia.propTypes = {
    viewMediaClick: PropTypes.func,
    name: PropTypes.string,
    items: PropTypes.array,
};

ArchiveMedia.defaultProps = {
    viewMediaClick: null,
    name: '',
    items: [],

};

function ArchiveMedia(props) {
    const { viewMediaClick, name, items } = props;
    const [isDrop, setIsDrop] = useState(true);

    const [visible, setVisible] = useState(false);
    const [currentVideo, setCurrentVideo] = useState('');


    const styleIconDrop = {
        transform: 'rotate(-90deg)',
    };
    const styleInteract = {
        maxHeight: '0px',
    };

    const handleOnClick = () => {
        setIsDrop(!isDrop);
    };

    const handleViewAllOnClick = () => {
        if (viewMediaClick) {
            if (name === 'Ảnh') {
                viewMediaClick(2, 1);
            } else if (name === 'Video') {
                viewMediaClick(2, 2);
            }
        }
    };

    const handleVisibleModal = (url) => {
        setVisible(true);
        setCurrentVideo(url);

    }

    const handleOnClose = () => {
        setVisible(false);
        setCurrentVideo('');
    }

    return (
        <div className='info_media'>
            <div className='info_media-header' onClick={handleOnClick}>
                <div className='info_media-header-title'>{name}</div>

                <div
                    className='info_media-header-icon'
                    style={isDrop ? {} : styleIconDrop}>
                    <CaretDownOutlined />
                </div>
            </div>

            <div
                className='info_media-interact'
                style={isDrop ? {} : styleInteract}
            >

                <div className='info_media-interact-media'>
                    {name === 'Video' ? (
                        <>
                            {
                                items.map((ele, index) => (
                                    <ThumbnailCustom
                                        key={index}
                                        url={ele.content}
                                        onVisibleVideoModal={handleVisibleModal}
                                    />
                                ))
                            }
                        </>
                    ) : (
                        <Image.PreviewGroup>

                            {items.map((itemEle, index) => (
                                <ImageItem
                                    key={index}
                                    width={80}
                                    height={80}
                                    url={itemEle.content}
                                    type={name === 'Video' ? name.toLowerCase() : 'image'}
                                    onVisibleVideoModal={handleVisibleModal}
                                />
                            ))}

                        </Image.PreviewGroup>
                    )}




                </div>

                <div className='info_media-interact-button'>
                    <button onClick={handleViewAllOnClick}>Xem Tất cả</button>
                </div>
            </div>

            <ModalVideoCustom
                isVisible={visible}
                url={currentVideo}
                onClose={handleOnClose}
            />
        </div >
    );
}

export default ArchiveMedia;
