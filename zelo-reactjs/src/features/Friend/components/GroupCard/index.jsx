import { Badge, Button, Dropdown, Menu } from 'antd';
import SubMenuClassify from 'components/SubMenuClassify';
import ConversationAvatar from 'features/Chat/components/ConversationAvatar';
import { fetchListMessages, setCurrentConversation } from 'features/Chat/slice/chatSlice';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import classifyUtils from 'utils/classifyUtils';
import './style.scss';

GroupCard.propTypes = {
    data: PropTypes.object,
    onRemove: PropTypes.func,
};

GroupCard.defaultProps = {
    data: {},
    onRemove: null

};

function GroupCard({ data, onRemove }) {
    const { classifies } = useSelector(state => state.chat);
    const [classify, setClassify] = useState(null);
    const history = useHistory();
    const dispatch = useDispatch();



    useEffect(() => {
        if (classifies.length > 0) {
            setClassify(classifyUtils.getClassifyOfObject(data._id, classifies));
        }
    }, [classifies]);


    const handleOnSelectMenu = ({ key }) => {

        if (key === '2') {
            if (onRemove) {
                onRemove(key, data._id);
            }
        }

    }


    const menu = (
        <Menu onClick={handleOnSelectMenu}>

            <SubMenuClassify
                data={classifies}
                idConver={data._id}
            />

            <Menu.Item key="2" danger>
                <span className="menu-item--highlight">Rời nhóm</span>
            </Menu.Item>
        </Menu>
    );


    const handleOnClick = async () => {

        dispatch(fetchListMessages({ conversationId: data._id, size: 10 }));
        dispatch(setCurrentConversation(data._id));
        history.push({
            pathname: '/chat',
        });
    }

    console.log('data card', data);


    const mainCard = (
        <Dropdown overlay={menu} trigger={['contextMenu']}>
            <div className='group-card' >

                <div className="group-card__avatar-group">
                    <ConversationAvatar
                        avatar={data.avatar}
                        demension={52}
                        type={data.type}
                        totalMembers={data.totalMembers}
                        isGroupCard={true}
                        sizeAvatar={48}
                        frameSize={96}

                    />

                </div>

                <div className="group-card__name-group">
                    {data.name}
                </div>

                <div className="group-card__total-member">
                    {`${data.totalMembers} thành viên`}
                </div>
                <div className="group-card__interact">
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button
                            type='text'
                            icon={<BsThreeDotsVertical />}
                        />
                    </Dropdown>
                </div>


            </div>
        </Dropdown>
    )



    return (
        <div onClick={handleOnClick}>
            {classify ? (<Badge.Ribbon text={classify.name} color={classify.color.code} placement='start'>
                {mainCard}
            </Badge.Ribbon>) : (
                mainCard
            )}
        </div>


    );
}

export default GroupCard;