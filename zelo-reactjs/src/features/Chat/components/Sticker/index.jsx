import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import { Tabs } from 'antd';
import { GiftOutlined, SmileOutlined } from '@ant-design/icons';
import ListSticker from '../ListSticker';

Sticker.propTypes = {
    data: PropTypes.array,
    onClose: PropTypes.func,
    onScroll: PropTypes.func,
};



Sticker.defaultProps = {
    data: [],
    onClose: null,
    onScroll: null
};

function Sticker({ data, onClose, onScroll }) {


    const handleOnClose = () => {
        if (onClose) {
            onClose()
        }
    };

    const { TabPane } = Tabs;

    function handleOnChange() {

    }

    return (
        <div id='sticker'>

            <Tabs defaultActiveKey="1" onChange={handleOnChange}>
                <TabPane
                    tab={
                        <span className='menu-item'><GiftOutlined /> STICKER</span>
                    }
                    key="1"
                >
                    <ListSticker
                        data={data}
                        onClose={handleOnClose}
                        onScroll={onScroll}
                    />
                </TabPane>
            </Tabs>
        </div>
    );
}

export default Sticker;