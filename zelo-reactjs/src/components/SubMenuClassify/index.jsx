import { TagFilled } from '@ant-design/icons';
import { Divider, Menu } from 'antd';
import ClassifyApi from 'api/ClassifyApi';
import { fetchListClassify } from 'features/Chat/slice/chatSlice';
import ModalClassify from 'features/Chat/components/ModalClassify';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

SubMenuClassify.propTypes = {
    data: PropTypes.array,
    idConver: PropTypes.string.isRequired,
};

SubMenuClassify.defaultProps = {
    data: []
};



function SubMenuClassify({ data, idConver }) {
    const { SubMenu } = Menu;
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();


    const handleClickClassify = async (id) => {
        await ClassifyApi.addClassifyForConversation(id, idConver);
        dispatch(fetchListClassify());

    }

    return (
        <SubMenu
            title={<span className="menu-item--highlight">Phân loại</span>}
            key="sub-1"
        >

            {
                data.length > 0 && (
                    data.map(ele => (
                        <Menu.Item
                            key={ele._id}
                            icon={<TagFilled style={{ color: `${ele.color.code}` }} />}
                            onClick={() => handleClickClassify(ele._id)}
                        >
                            {ele.name}
                        </Menu.Item>
                    ))
                )
            }

            <Divider style={{ margin: '1rem 2rem' }} />
            <Menu.Item
                key="0"
                icon={<TagFilled />}
                onClick={() => setVisible(true)}

            >
                <span className="menu-item--highlight">Quản lý thẻ phân loại</span>
            </Menu.Item>


            <ModalClassify
                isVisible={visible}
                onCancel={() => setVisible(false)}
                onOpen={() => setVisible(true)}
            />

        </SubMenu>
    );
}

export default SubMenuClassify;