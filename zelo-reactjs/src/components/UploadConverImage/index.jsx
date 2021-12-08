import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import { useState } from 'react';
import { EditOutlined } from '@ant-design/icons';

UploadCoverImage.propTypes = {
    coverImg: PropTypes.string,
    getFile: PropTypes.func,
    isClear: PropTypes.bool,
};

UploadCoverImage.defaultProps = {
    coverImg: '',
    getFile: null,
    isClear: false
};


function UploadCoverImage({ coverImg, getFile, isClear }) {


    const [imagePreview, setImagePreview] = useState("");


    useEffect(() => {
        if (isClear) {
            setImagePreview('');
        }
    }, [isClear])

    const handleOnChange = (e) => {
        const files = e.target.files;

        const fileImage = files[0];
        const reader = new FileReader();
        if (fileImage && fileImage.type.match('image.*')) {

            reader.readAsDataURL(fileImage);
            reader.onloadend = function (e) {
                setImagePreview(reader.result);
            };

            if (getFile) {
                getFile(fileImage)
            }

        }
    }


    return (
        <div className='upload-cover_wrapper'>
            <div className="upload-cover_img">
                {(coverImg || imagePreview) ? (
                    <img
                        src={imagePreview ? imagePreview : coverImg}
                        alt=""
                    />
                ) : (
                    <label className='upload-cover_text-select' htmlFor="upload-cover_custom">
                        Chọn hình ảnh
                    </label>
                )}
            </div>

            <div className="upload-cover_icon">
                <label htmlFor="upload-cover_custom">
                    <EditOutlined style={{ fontSize: '13px' }} />
                </label>
                <input
                    id="upload-cover_custom"
                    type="file"
                    hidden
                    onChange={handleOnChange}
                    accept="image/*"
                />
            </div>
        </div>
    );
}

export default UploadCoverImage;