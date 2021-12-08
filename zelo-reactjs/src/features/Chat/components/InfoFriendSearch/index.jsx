import { ExclamationCircleOutlined, KeyOutlined, UserDeleteOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Dropdown, Menu, message, Modal, Tag } from 'antd';
import conversationApi from 'api/conversationApi';
import PropTypes from 'prop-types';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { useDispatch, useSelector } from 'react-redux';
import InfoTitle from '../InfoTitle';
import PersonalIcon from '../PersonalIcon';
import './style.scss';
InfoFriendSearch.propTypes = {
    onBack: PropTypes.func,
    members: PropTypes.array,
    onChoseUser: PropTypes.func,
};

InfoFriendSearch.defaultProps = {
    onBack: null,
    members: [],
    onChoseUser: null
};

function InfoFriendSearch(props) {
    const { onBack, members, onChoseUser } = props;
    const { user } = useSelector(state => state.global);
    const { currentConversation, conversations } = useSelector(state => state.chat);
    const { confirm } = Modal;
    const dispatch = useDispatch();
    const converData = conversations.find(ele => ele._id === currentConversation);
    const { managerIds, leaderId } = converData;


    const handleOnBack = (value) => {
        if (onBack) {
            onBack(value);
        }
    }


    const handleClickUser = (ele) => {
        if (onChoseUser) {
            onChoseUser(ele);
        }
    }

    // confirm xóa thành viên

    function showConfirm(value) {
        confirm({
            title: 'Cảnh báo',
            icon: <ExclamationCircleOutlined />,
            content: <span>Bạn có thực sự muốn xóa <b>{value.name}</b> khỏi nhóm </span>,
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                removeMember(value._id);
            },
        });
    }

    // Call api xóa thành viên

    async function removeMember(idMember) {
        try {
            await conversationApi.deleteMember(currentConversation, idMember);
            message.success('Xóa thành công');
        } catch (error) {
            message.error('Xóa thất bại');
        }
    }

    const handleInteractMember = async ({ _, key }, value) => {
        if (key === "1") {
            console.log('values', value)
            showConfirm(value);
        }
        if (key === "2") {
            handleAddLeader(value._id);
        }

        if (key === "3") {
            handleDeleteLeader(value._id);
        }

    }

    const handleAddLeader = async (id) => {
        try {
            await conversationApi.addManagerGroup(currentConversation, [id]);
            message.success('Thêm thành công');

        } catch (error) {
            message.error('Thêm thất bại');
        }
    }

    const handleDeleteLeader = async (id) => {
        try {
            await conversationApi.deleteManager(currentConversation, [id]);
            message.success('Gỡ thành công');
        } catch (error) {
            message.error('Gỡ thất bại');
        }
    }



    const menu = (value) => (
        <Menu onClick={(e) => handleInteractMember(e, value)}>

            {(value._id !== user._id) && (
                <>
                    {

                        (((leaderId === user._id) || (managerIds.find(ele => ele === user._id))) && (
                            <Menu.Item icon={<UserDeleteOutlined />} key="1" danger>
                                <span className="menu-icon">Xóa khỏi nhóm</span>
                            </Menu.Item>
                        ))
                    }



                    {
                        ((leaderId === user._id && !managerIds.find(ele => ele === value._id)) && (
                            <Menu.Item icon={<KeyOutlined />} key="2" >
                                <span className="menu-icon">Thêm phó nhóm </span>
                            </Menu.Item>
                        ))
                    }


                    {
                        (((leaderId === user._id) && (managerIds.find(ele => ele === value._id))) && (
                            <Menu.Item icon={<UserSwitchOutlined />} key="3" >
                                <span className="menu-icon">Gỡ quyền phó nhóm </span>
                            </Menu.Item>
                        ))
                    }
                </>
            )}

        </Menu>
    );
    return (
        <div id='info_friend-search'>
            <div className="info_friend-search--title">
                <InfoTitle
                    isBack={true}
                    text="Thành viên"
                    onBack={handleOnBack}
                    isSelect={false}
                />
            </div>

            <Scrollbars
                autoHide={true}
                autoHideTimeout={1000}
                autoHideDuration={200}
                style={{ width: '100%' }}

            >

                <div className="info_friend-search-content">


                    <div className="info_friend-searchbar-and-title">
                        <div className="info_friend-search-title">
                            <strong>{`Danh sách thành viên (${members.length})`}</strong>
                        </div>
                        {/* 
                        <div className="info_friend-searchbar">
                            <Input placeholder="Tìm kiếm thành viên" prefix={<SearchOutlined />} />
                        </div> */}

                        <div className="info_friend-list">
                            {
                                members.map((ele, index) => (
                                    <Dropdown key={index} overlay={() => menu(ele)} trigger={['contextMenu']}>
                                        <div className="info_friend-item" onClick={() => handleClickUser(ele)}>
                                            <div className="info_friend-item-leftside">
                                                <div className="info_friend-item-leftside-avatar">
                                                    <PersonalIcon
                                                        avatar={ele.avatar}
                                                        demention={40}
                                                        name={ele.name}
                                                        color={ele.avatarColor}
                                                        isHost={(ele._id === leaderId || managerIds.find(managerId => managerId === ele._id))}

                                                    />
                                                </div>

                                                <div className="info_friend-item-leftside-name">
                                                    <strong>{ele.name}</strong>
                                                    {/* <span>Trưởng Nhóm</span> */}
                                                </div>



                                            </div>
                                            <div className={`info_friend-item-rightside ${(ele._id === user._id) && 'hidden'} `}>
                                                {ele.isFriend ? (
                                                    <Tag color="#87d068">Bạn bè</Tag>
                                                ) : (
                                                    <Tag color="#f5d003">Người lạ</Tag>
                                                )}
                                            </div>
                                        </div>
                                    </Dropdown>


                                ))
                            }
                            {/* 
                            {tempMembers} */}

                        </div>
                    </div>
                </div>
            </Scrollbars >


        </div >
    );
}

export default InfoFriendSearch;