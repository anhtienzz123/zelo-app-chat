import { SearchOutlined } from '@ant-design/icons';
import { Checkbox, Col, Divider, Input, message, Modal, Row } from 'antd';
import conversationApi from 'api/conversationApi';
import messageApi from 'api/messageApi';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import ConversationAvatar from '../ConversationAvatar';
import ItemsSelected from '../ItemsSelected';
import PersonalIcon from '../PersonalIcon';
import './style.scss';

ModalShareMessage.propTypes = {
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
};

function ModalShareMessage({ visible, onCancel, idMessage }) {

    const [itemSelected, setItemSelected] = useState([]);
    const [frInput, setFrInput] = useState('');
    const [conversations, setConversations] = useState([]);
    const [checkList, setCheckList] = useState([]);
    const [loading, setLoading] = useState(false);





    const fetchData = async (name = '', type = 0) => {
        const data = await conversationApi.fetchListConversations(name, type);
        const tempdata = [];
        data.forEach((ele) => {
            if (ele.lastMessage) {
                tempdata.push(ele);
            }
        });
        setConversations(tempdata);

    }

    useEffect(() => {
        if (visible) {
            fetchData()
        } else {
            setFrInput('');
            setCheckList([]);
            setItemSelected([]);
        }
    }, [visible])


    const handleCancel = () => {

        if (onCancel) {
            onCancel();
        }
    }

    const handleOk = async () => {
        setLoading(true);
        try {
            itemSelected.forEach(async (ele) => {
                await messageApi.forwardMessage(idMessage, ele._id);
            })
            message.success('Chuyển tiếp tin nhắn thành công');

        } catch (error) {
            message.error('Đã có lỗi xảy ra');

        }
        setLoading(false);

        handleCancel();

    }

    const handleSearch = (e) => {
        const value = e.target.value;
        setFrInput(value);

        if (!value && visible) {
            fetchData();
        } else {
            const tempConver = [...conversations];
            const realConver = [];
            tempConver.forEach((conver) => {
                const index = conver.name.search(value);
                if (index > -1) {
                    realConver.push(conver);
                }
            })
            setConversations(realConver);
        }


    }

    const handleChangeCheckBox = (e) => {
        const value = e.target.value;

        // check xem có trong checklist chưa
        const index = checkList.findIndex(element => element === value);
        let checkListTemp = [...checkList];
        let itemSelectedTemp = [...itemSelected];


        // nếu như đã có
        if (index !== -1) {
            itemSelectedTemp = itemSelectedTemp.filter(element => element._id !== value);

            checkListTemp = checkListTemp.filter(element => element !== value);

            // chưa có
        } else {
            checkListTemp.push(value);
            const index = conversations.findIndex(element => element._id === value);

            if (index !== -1) {
                itemSelectedTemp.push(conversations[index]);
            }
        }
        setCheckList(checkListTemp);
        setItemSelected(itemSelectedTemp);
        setFrInput('');
        fetchData();


    }

    const handleRemoveItem = (id) => {


        let checkListTemp = [...checkList];
        let itemSelectedTemp = [...itemSelected];

        itemSelectedTemp = itemSelectedTemp.filter(element => element._id !== id);

        checkListTemp = checkListTemp.filter(element => element !== id);

        setCheckList(checkListTemp);
        setItemSelected(itemSelectedTemp);

        setFrInput('');
        fetchData();


    }




    return (

        <Modal
            title="Chuyển tiếp tin nhắn"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText='Chia sẻ'
            cancelText='Hủy'
            confirmLoading={loading}
            centered
        >

            <div id="modal-share-message">
                <div className="search-friend-input">
                    <Input
                        size="middle"
                        placeholder="Nhập cuộc trò chuyện bạn muốn tìm kiếm"
                        style={{ width: '100%' }}
                        prefix={<SearchOutlined />}
                        onChange={handleSearch}
                        value={frInput}
                    />
                </div>

                <Divider />

                <div className="list-conver-interact">

                    <div className={`list-conver-interact--left  ${itemSelected.length > 0 ? '' : 'full-container'}  `}>
                        <div className="title-list-conver">
                            <span>Danh sách Cuộc trò chuyện</span>
                        </div>


                        <div className="checkbox-list-conver">
                            <Checkbox.Group
                                style={{ width: '100%' }}
                                // onChange={handleCheckBoxChange}
                                value={checkList}
                            >
                                <Row gutter={[0, 0]}>

                                    {conversations.map((element, index) => (
                                        <Col span={24} key={index}>
                                            <Checkbox
                                                // disabled={checkInitialValue(element._id)}
                                                value={element._id}
                                                onChange={handleChangeCheckBox}
                                            >
                                                <div className="item-checkbox">
                                                    {element.type ? (
                                                        <ConversationAvatar
                                                            totalMembers={element.totalMembers}
                                                            avatar={element.avatar}
                                                            type={element.type}
                                                            name={element.name}
                                                            demension={22}
                                                            sizeAvatar={40}
                                                            frameSize={36}
                                                            avatarColor={element.avatarColor}
                                                        />
                                                    ) : (
                                                        <PersonalIcon
                                                            demention={36}
                                                            avatar={element.avatar}
                                                            name={element.name}
                                                            color={element.avatarColor}

                                                        />
                                                    )}

                                                    <span className='item-name'>{element.name}</span>
                                                </div>
                                            </Checkbox>
                                        </Col>


                                    ))}

                                </Row>
                            </Checkbox.Group>

                        </div>
                    </div>


                    <div className={`list-conver-interact--right ${itemSelected.length > 0 ? '' : 'close'}`}>
                        <div className="title-list-conver-checked">
                            <strong>Đã chọn: {itemSelected.length > 0 && itemSelected.length}</strong>
                        </div>

                        <div className="checkbox-list-conver">
                            <ItemsSelected
                                items={itemSelected}
                                onRemove={handleRemoveItem}
                            />

                        </div>
                    </div>
                </div>

            </div>

        </Modal>
    );
}

export default ModalShareMessage;