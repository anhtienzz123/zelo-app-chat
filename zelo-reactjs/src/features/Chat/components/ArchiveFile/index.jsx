import { CaretDownOutlined } from '@ant-design/icons';
import FileItem from 'components/FileItem';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import './style.scss';

ArchiveFile.propTypes = {
    viewMediaClick: PropTypes.func,
    items: PropTypes.array,

};

ArchiveFile.defaultProps = {
    viewMediaClick: null,
    items: [],

};

function ArchiveFile(props) {
    const { viewMediaClick, items } = props;
    const [isDrop, setIsDrop] = useState(true);
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
            viewMediaClick(2, 3);
        }
    };

    return (
        <div className='info_file'>
            <div className='info_file-header' onClick={handleOnClick}>
                <div className='info_file-header-title'>File</div>

                <div
                    className='info_file-header-icon'
                    style={isDrop ? {} : styleIconDrop}>
                    <CaretDownOutlined />
                </div>
            </div>

            <div
                className='info_file-interact'
                style={isDrop ? {} : styleInteract}
            >

                <div className='info_file-interact-file'>
                    {items.map((itemEle, index) => {
                        if (index < 3) {
                            return (
                                <FileItem
                                    key={index}
                                    file={itemEle}
                                />
                            )
                        }
                    })}
                </div>

                <div className='info_file-interact-button'>
                    <button onClick={handleViewAllOnClick}>Xem Tất cả</button>
                </div>
            </div>
        </div>
    );
}

export default ArchiveFile;
