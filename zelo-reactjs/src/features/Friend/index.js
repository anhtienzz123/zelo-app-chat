import { CaretDownOutlined, FilterOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, Menu, Row, Spin } from 'antd';
import conversationApi from 'api/conversationApi';
import ICON_CONTACT from 'assets/images/icon/contacts_icon.png';
import ICON_FRIEND from 'assets/images/icon/icon_friend.png';
import ICON_GROUP from 'assets/images/icon/icon_group.png';
import FilterContainer from 'components/FilterContainer';
import { getValueFromKey } from 'constants/filterFriend';
import SearchContainer from 'features/Chat/containers/SearchContainer';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { useDispatch, useSelector } from 'react-redux';
import { sortGroup } from 'utils/groupUtils';
import HeaderFriend from './components/HeaderFiend';
import ListContact from './components/ListContact';
import ListFriend from './components/ListFriend';
import ListGroup from './components/ListGroup';
import ListMyFriendRequest from './components/ListMyRequestFriend';
import ListRequestFriend from './components/ListRequestFriend';
import SuggestList from './components/SuggestList';
import {
    fetchFriends,
    fetchListGroup,
    fetchListMyRequestFriend,
    fetchListRequestFriend,
    fetchPhoneBook,
    fetchSuggestFriend,
} from './friendSlice';
import FRIEND_STYLE from './friendStyle';
import './style.scss';

Friend.propTypes = {
    socket: PropTypes.object,
};

Friend.defaultProps = {
    socket: {},
};

function Friend({ socket }) {
    const {
        requestFriends,
        myRequestFriend,
        groups,
        friends,
        phoneBook,
        isLoading,
        suggestFriends,
    } = useSelector((state) => state.friend);
    const { user } = useSelector((state) => state.global);

    const { isJoinFriendLayout } = useSelector((state) => state.global);
    const [subTab, setSubTab] = useState(0);
    const [currentFilterLeft, setCurrentFilterLeft] = useState('1');
    const [currentFilterRight, setCurrentFilterRight] = useState('1');
    const [groupCurrent, setGroupCurrent] = useState([]);
    const [keySort, setKeySort] = useState(1);
    const dispatch = useDispatch();
    const refFiller = useRef();

    // filter search
    const [visibleFilter, setVisbleFilter] = useState(false);
    const [valueInput, setValueInput] = useState('');
    const [singleConverFilter, setSingleConverFilter] = useState([]);
    const [mutipleConverFilter, setMutipleConverFilter] = useState([]);

    const [isActiveTab, setActiveTab] = useState(false);

    useEffect(() => {
        if (groups.length > 0) {
            const temp = sortGroup(groups, 1);
            setGroupCurrent(temp);
            refFiller.current = temp;
        }
    }, [groups]);

    useEffect(() => {
        if (subTab === 2) {
            dispatch(fetchPhoneBook());
        }
    }, [subTab]);

    useEffect(() => {
        dispatch(fetchListRequestFriend());
        dispatch(fetchListMyRequestFriend());
        dispatch(
            fetchFriends({
                name: '',
            })
        );
        dispatch(fetchListGroup({ name: '', type: 2 }));
        dispatch(fetchPhoneBook());
        dispatch(fetchSuggestFriend());
    }, []);

    const handleMenuLeftSelect = ({ _, key }) => {
        if (groups.length > 0) {
            setCurrentFilterLeft(key);
            if (key === '2') {
                const newGroup = groupCurrent.filter(
                    (ele) => ele.leaderId === user._id
                );

                setGroupCurrent(newGroup);
            }
            if (key === '1') {
                console.log(refFiller.current);
                setGroupCurrent(sortGroup(refFiller.current, keySort));
            }
        }
    };

    const handleMenuRightSelect = ({ _, key }) => {
        if (groups.length > 0) {
            setCurrentFilterRight(key);
            let newGroup = [];
            if (key === '2') {
                newGroup = sortGroup(groupCurrent, 0);
                setKeySort(0);
            }
            if (key === '1') {
                newGroup = sortGroup(groupCurrent, 1);
                setKeySort(1);
            }

            setGroupCurrent(newGroup);
        }
    };

    const menuLeft = (
        <Menu onClick={handleMenuLeftSelect}>
            <Menu.Item key="1">Tất cả</Menu.Item>
            <Menu.Item key="2">Nhóm tôi quản lý</Menu.Item>
        </Menu>
    );

    const menuRight = (
        <Menu onClick={handleMenuRightSelect}>
            <Menu.Item key="1">Theo tên nhóm từ (A-Z)</Menu.Item>
            <Menu.Item key="2">Theo tên nhóm từ (Z-A)</Menu.Item>
        </Menu>
    );

    const handleOnVisibleFilter = (value) => {
        if (value.trim().length > 0) {
            setVisbleFilter(true);
        } else {
            setVisbleFilter(false);
        }
    };

    const handleOnSearchChange = (value) => {
        setValueInput(value);
        handleOnVisibleFilter(value);
    };

    const handleOnSubmitSearch = async () => {
        try {
            const single = await conversationApi.fetchListConversations(
                valueInput,
                1
            );
            const mutiple = await conversationApi.fetchListConversations(
                valueInput,
                2
            );
            setSingleConverFilter(single);
            setMutipleConverFilter(mutiple);
        } catch (error) {}
    };

    return (
        <Spin spinning={isLoading}>
            <div id="main-friend_wrapper">
                <Row gutter={[0, 0]}>
                    <Col
                        span={5}
                        xl={{ span: 5 }}
                        lg={{ span: 6 }}
                        md={{ span: 7 }}
                        sm={{ span: isActiveTab ? 0 : 24 }}
                        xs={{ span: isActiveTab ? 0 : 24 }}
                    >
                        <div className="main-friend_sidebar">
                            <div className="main-friend_sidebar_search-bar">
                                <SearchContainer
                                    onSearchChange={handleOnSearchChange}
                                    valueText={valueInput}
                                    onSubmitSearch={handleOnSubmitSearch}
                                    isFriendPage={true}
                                />
                            </div>

                            {visibleFilter ? (
                                <FilterContainer
                                    dataSingle={singleConverFilter}
                                    dataMutiple={mutipleConverFilter}
                                    valueText={valueInput}
                                />
                            ) : (
                                <>
                                    <div className="divider-layout">
                                        <div></div>
                                    </div>

                                    <div className="main-friend_sidebar_bottom">
                                        <div
                                            className="main-friend_sidebar_option main-friend_sidebar_option--add-fiend"
                                            onClick={() => {
                                                setSubTab(0);
                                                setActiveTab(true);
                                            }}
                                        >
                                            <div className="main-friend_sidebar_option_img">
                                                <img
                                                    src={ICON_FRIEND}
                                                    alt="ICON_FRIEND"
                                                />
                                            </div>

                                            <div className="main-friend_sidebar_option_text">
                                                Danh sách kết bạn
                                            </div>
                                        </div>

                                        <div
                                            className="main-friend_sidebar_option main-friend_sidebar_option--groups"
                                            onClick={() => {
                                                setSubTab(1);
                                                setActiveTab(true);
                                            }}
                                        >
                                            <div className="main-friend_sidebar_option_img">
                                                <img
                                                    src={ICON_GROUP}
                                                    alt="ICON_GROUP"
                                                />
                                            </div>

                                            <div className="main-friend_sidebar_option_text">
                                                Danh sách nhóm
                                            </div>
                                        </div>

                                        <div
                                            className="main-friend_sidebar_option main-friend_sidebar_option--contact"
                                            onClick={() => {
                                                setSubTab(2);
                                                setActiveTab(true);
                                            }}
                                        >
                                            <div className="main-friend_sidebar_option_img">
                                                <img
                                                    src={ICON_CONTACT}
                                                    alt="ICON_CONTACT"
                                                />
                                            </div>

                                            <div className="main-friend_sidebar_option_text">
                                                Danh bạ
                                            </div>
                                        </div>

                                        <div className="divider-layout">
                                            <div></div>
                                        </div>

                                        <div className="main-friend_sidebar_list-friend">
                                            <div className="main-friend_sidebar_list-friend_title">
                                                Bạn bè ({friends.length})
                                            </div>
                                            <ListFriend data={friends} />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </Col>

                    <Col
                        span={19}
                        xl={{ span: 19 }}
                        lg={{ span: 18 }}
                        md={{ span: 17 }}
                        sm={{ span: isActiveTab ? 24 : 0 }}
                        xs={{ span: isActiveTab ? 24 : 0 }}
                    >
                        <div className="main-friend_body">
                            <div className="main-friend_body__header">
                                <HeaderFriend
                                    onBack={() => setActiveTab(false)}
                                    subtab={subTab}
                                />
                            </div>
                            <div className="main-friend_body__section">
                                <div className="main-friend_body_item">
                                    <Scrollbars
                                        autoHide={true}
                                        autoHideTimeout={1000}
                                        autoHideDuration={200}
                                        style={{ height: '100%' }}
                                    >
                                        {subTab === 1 && (
                                            <>
                                                <div className="main-friend_body__filter">
                                                    <div className="main-friend_body__filter--left">
                                                        <Dropdown
                                                            overlay={menuLeft}
                                                            placement="bottomLeft"
                                                        >
                                                            <Button
                                                                icon={
                                                                    <CaretDownOutlined />
                                                                }
                                                                type="text"
                                                                style={
                                                                    FRIEND_STYLE.BUTTON_FILTER
                                                                }
                                                            >
                                                                {` ${getValueFromKey(
                                                                    'LEFT',
                                                                    currentFilterLeft
                                                                )} (${
                                                                    groupCurrent.length
                                                                })`}
                                                            </Button>
                                                        </Dropdown>
                                                    </div>

                                                    <div className="main-friend_body__filter--right">
                                                        <Dropdown
                                                            overlay={menuRight}
                                                            placement="bottomLeft"
                                                        >
                                                            <Button
                                                                icon={
                                                                    <FilterOutlined />
                                                                }
                                                                type="text"
                                                                style={
                                                                    FRIEND_STYLE.BUTTON_FILTER
                                                                }
                                                            >
                                                                {` ${getValueFromKey(
                                                                    'RIGHT',
                                                                    currentFilterRight
                                                                )}`}
                                                            </Button>
                                                        </Dropdown>
                                                    </div>
                                                </div>

                                                <div className="main-friend_body__list-group">
                                                    <ListGroup
                                                        data={groupCurrent}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {subTab === 0 && (
                                            <div className="main-friend_body_list-request">
                                                <div className="main-friend_body_title-list">
                                                    Lời mới kết bạn (
                                                    {requestFriends.length})
                                                </div>
                                                <ListRequestFriend
                                                    data={requestFriends}
                                                />

                                                <div className="main-friend_body_title-list">
                                                    Đã gửi yêu cầu kết bạn (
                                                    {myRequestFriend.length})
                                                </div>
                                                <ListMyFriendRequest
                                                    data={myRequestFriend}
                                                />

                                                <div className="main-friend_body_title-list">
                                                    Gợi ý kết bạn(
                                                    {suggestFriends.length})
                                                    <SuggestList
                                                        data={suggestFriends}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {subTab === 2 && (
                                            <div>
                                                <ListContact data={phoneBook} />
                                            </div>
                                        )}
                                    </Scrollbars>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </Spin>
    );
}

export default Friend;
