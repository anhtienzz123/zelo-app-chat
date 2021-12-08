import React from 'react';
import PropTypes from 'prop-types';
import './style.scss'
import StickerItem from '../StickerItem';

ListSticker.propTypes = {
    data: PropTypes.array,
    onClose: PropTypes.func,
    onScroll: PropTypes.func,
};

ListSticker.propTypes = {
    data: [],
    onClose: null,
    onScroll: null

};


function ListSticker({ data, onClose, onScroll }) {
    return (
        <div id='sticker-list'>
            {data.map((ele, index) => (
                <StickerItem
                    key={index}
                    data={ele}
                    onClose={onClose}
                    onScroll={onScroll}
                />
            ))}

        </div>
    );
}

export default ListSticker;