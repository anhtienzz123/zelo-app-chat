import { AlignLeftOutlined, AppstoreAddOutlined, SearchOutlined, UserAddOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Input, message, Radio } from 'antd';
import userApi from 'api/userApi';
import ModalAddFriend from 'components/ModalAddFriend';
import UserCard from 'components/UserCard';
import ModalClassify from 'features/Chat/components/ModalClassify';
import ModalCreateGroup from 'features/Chat/components/ModalCreateGroup';
import { createGroup } from 'features/Chat/slice/chatSlice';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { useDispatch, useSelector } from 'react-redux';
import './style.scss';
SearchContainer.propTypes = {
    onVisibleFilter: PropTypes.func,
    onSearchChange: PropTypes.func,
    valueText: PropTypes.string,
    onSubmitSearch: PropTypes.func,
    isFriendPage: PropTypes.bool,
    onFilterClasify: PropTypes.func,
    valueClassify: PropTypes.string.isRequired,
};

SearchContainer.defaultProps = {
    onVisibleFilter: null,
    valueText: '',
    onSearchChange: null,
    onSubmitSearch: null,
    isFriendPage: false,
    onFilterClasify: null
};

function SearchContainer({ valueText, onSearchChange, onSubmitSearch, isFriendPage, onFilterClasify, valueClassify }) {
    const [isModalCreateGroupVisible, setIsModalCreateGroupVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const { classifies } = useSelector(state => state.chat);
    const [isShowModalClasify, setIsShowModalClasify] = useState(false);
    const [isShowModalAddFriend, setShowModalAddFriend] = useState(false);
    const [userIsFind, setUserIsFind] = useState({});
    const [visibleUserCard, setVisbleUserCard] = useState(false);
    const refDebounce = useRef(null)
    const dispatch = useDispatch();



    // -----  HANDLE MODAL CLASSIFY

    const handleCreateClasify = () => {
        setIsShowModalClasify(true);
    }

    const handleCancelClassifyModal = () => {
        setIsShowModalClasify(false);
    }

    const handleOpenModalClassify = () => {
        setIsShowModalClasify(true)
    }

    // ------ 



    const handleOnChange = (e) => {
        const value = e.target.value;
        console.log('value', value);
        if (onFilterClasify) {
            onFilterClasify(value)
        }
    };



    // --- HANDLE CREATE GROUP

    const handleCreateGroup = () => {
        setIsModalCreateGroupVisible(true);
    }


    const handleCancelModalCreatGroup = (value) => {
        setIsModalCreateGroupVisible(value);
    }

    const handleOklModalCreatGroup = (value) => {
        setConfirmLoading(true);
        dispatch(createGroup(value));
        setConfirmLoading(false);
        setIsModalCreateGroupVisible(false);
    }

    // -----



    // HANDLE ADD FRIEND

    const handleOpenModalAddFriend = () => {
        setShowModalAddFriend(true);
    }

    const handeCancelModalAddFriend = () => {
        setShowModalAddFriend(false);
    }

    const handFindUser = async (value) => {
        try {
            const user = await userApi.fetchUser(value);
            setUserIsFind(user);
            setVisbleUserCard(true);
            setShowModalAddFriend(false);
        } catch (error) {
            message.error('Không tìm thấy người dùng');
        }
    }
    const handOnSearchUser = (value) => {
        handFindUser(value);
    }


    const handleOnEnter = (value) => {
        handFindUser(value);
    }

    // ------------



    const handleCancelModalUserCard = () => {
        setVisbleUserCard(false);
    }

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (onSearchChange) {
            onSearchChange(value)
        }


        if (refDebounce.current) {
            clearTimeout(refDebounce.current);
        }
        refDebounce.current = setTimeout(() => {
            if (onSubmitSearch) {
                onSubmitSearch()
            }
        }, 400)

        // setValueInput(value);

    }




    return (
        <div id='search-wrapper'>
            <div className="search-main">
                <div className="search-top">
                    <div className="search-top_input-search">
                        <Input
                            placeholder="Tìm kiếm"
                            prefix={<SearchOutlined />}
                            onChange={handleInputChange}
                            value={valueText}
                            allowClear
                        />
                    </div>

                    <div className="search-top_add-friend" onClick={handleOpenModalAddFriend}>
                        <UserAddOutlined />
                    </div>

                    <div className="search-top_create-group" onClick={handleCreateGroup}>
                        <UsergroupAddOutlined />
                    </div>
                </div>

                {!isFriendPage && (
                    <>
                        {!(valueText.trim().length > 0) && (
                            <div className="search-bottom">
                                <div className='classify-title'>
                                    <div>
                                        <AlignLeftOutlined /> &nbsp;
                                        <span>Phân loại</span>
                                    </div>
                                    <div className='add-classify' onClick={handleCreateClasify}>
                                        <AppstoreAddOutlined />
                                    </div>

                                </div>
                                <div className='classify-element'>
                                    <Scrollbars
                                        autoHide={true}
                                        autoHideTimeout={1000}
                                        autoHideDuration={200}
                                        style={{ height: '42px', width: '100%' }}
                                    >

                                        <Radio.Group onChange={handleOnChange} value={valueClassify} size='small' >
                                            <Radio value={'0'}>Tất cả</Radio>
                                            {classifies.map((ele, index) => (
                                                <Radio key={index} value={ele._id}>{ele.name}</Radio>
                                            ))}
                                        </Radio.Group>
                                    </Scrollbars>

                                </div>
                            </div>
                        )}
                    </>
                )}



            </div>


            <ModalCreateGroup
                isVisible={isModalCreateGroupVisible}
                onCancel={handleCancelModalCreatGroup}
                onOk={handleOklModalCreatGroup}
                loading={confirmLoading}
            />


            <ModalClassify
                isVisible={isShowModalClasify}
                onCancel={handleCancelClassifyModal}
                onOpen={handleOpenModalClassify}
            />

            <ModalAddFriend
                isVisible={isShowModalAddFriend}
                onCancel={handeCancelModalAddFriend}
                onSearch={handOnSearchUser}
                onEnter={handleOnEnter}
            />

            <UserCard
                user={userIsFind}
                isVisible={visibleUserCard}
                onCancel={handleCancelModalUserCard}
            />

        </div>
    );
}

export default SearchContainer;