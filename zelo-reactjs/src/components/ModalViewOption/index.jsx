import { CaretRightOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Button, Checkbox, Form, Input, message, Modal, Spin } from 'antd';
import voteApi from 'api/voteApi';
import PersonalIcon from 'features/Chat/components/PersonalIcon';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { equalsArray } from 'utils/arrayHelper';
import MODAL_OPTION_STYLE from './ModalViewOptionStyle';
import './style.scss';

ModalViewOption.propTypes = {
    isModalVisible: PropTypes.bool,
    onCancel: PropTypes.func,
    data: PropTypes.object,
    onShowDetail: PropTypes.func,
};

ModalViewOption.defaultProps = {
    isModalVisible: false,
    onCancel: null,
    data: {},
    onShowDetail: null,
};

function ModalViewOption({ isModalVisible, onCancel, data, onShowDetail }) {
    const [form] = Form.useForm();
    const { memberInConversation } = useSelector(state => state.chat);

    const [infoVote, setInfoVote] = useState(data);
    const { user } = useSelector(state => state.global);
    const [checkList, setCheckList] = useState([]);
    const [valueForm, setValueForm] = useState(null);
    const preValue = useRef();
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        setInfoVote(data);
    }, [data]);



    useEffect(() => {
        if (isModalVisible) {
            preValue.current = getDefaultValues();
            setCheckList(getDefaultValues);

        } else {
            form.resetFields();
        }


    }, [isModalVisible]);


    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    }

    const handleShowDetail = () => {
        if (onShowDetail) {
            onShowDetail();
        }
    }



    function handleOk() {
        form.validateFields().then(async ({ options }) => {
            setConfirmLoading(true);
            try {
                if (preValue.current && !(equalsArray(preValue.current, checkList))) {
                    await voteApi.deleteSelect(infoVote._id, preValue.current)
                    await voteApi.selectVote(infoVote._id, checkList);
                    message.success('Cập nhật lựa chọn thành công');

                }

                if (options && options.length > 0) {

                    const newField = options.map(ele => ele.name);
                    const tempSelect = options.filter(ele => ele.checkbox === true);
                    const realSelect = tempSelect.map(ele => ele.name);

                    await voteApi.addVote(infoVote._id, newField);
                    await voteApi.selectVote(infoVote._id, realSelect);
                    message.success('Thêm lựa chọn thành công');

                }


                handleCancel();

            } catch (error) {
                message.error('Đã có lỗi xảy ra');

            }
            setConfirmLoading(false);



        }).catch((info) => {
            console.log('Validate Failed:', info);
        });

    }

    const getDefaultValues = () => {
        let temp = [];
        infoVote.options.forEach(option => {
            option.userIds.forEach(userId => {
                if (userId === user._id) {
                    temp.push(option.name);
                }
            })
        })
        return temp;
    }
    // console.log('getDefault ', getDefaultValues());








    const footer = (
        <div className="footer_wrapper">
            <div className="footer_right-btn">
                <Button onClick={handleCancel}>Hủy</Button>
                <Button
                    type="primary"
                    onClick={handleOk}
                    icon={<Spin spinning={confirmLoading} />}
                >
                    Xác nhận
                </Button>
            </div>
        </div >
    )




    const handleCheckboxChange = (values) => {
        setCheckList(values);

        let tempOptions = [...infoVote.options];


        let newOptions = tempOptions.map(ele => {

            let temp = ele.userIds.filter(ele => {
                return ele != user._id
            });

            return {
                ...ele,
                userIds: temp
            }
        });



        let options = newOptions.map(optionEle => {
            const flag = values.find(ele => optionEle.name === ele);
            if (flag) {
                let optionSearchTemp = { ...optionEle, userIds: [...optionEle.userIds] };
                optionSearchTemp.userIds.push(user._id);
                return optionSearchTemp;
            }
            return optionEle;
        });


        setInfoVote({ ...infoVote, options });

    }

    const getUserFromConver = (userId) => {
        return memberInConversation.find(ele => ele._id === userId);
    }



    const countingPercent = (amoutVote) => {

        const result = (amoutVote / getNumberJoinVote().length) * 100;
        if (isNaN(result)) {
            return 0;
        }
        return result;
    }




    const getNumberJoinVote = () => {
        let tempUserIds = [];
        infoVote.options.forEach((option) => {
            option.userIds.forEach((userId) => {
                tempUserIds.push(userId);
            })
        });

        let uniqueUser = tempUserIds.filter((c, index) => {
            return tempUserIds.indexOf(c) === index;
        });
        return uniqueUser;
    }


    const handleValueChange = (_, allValues) => {

        setValueForm(allValues);
    }

    const getMumberVotes = () => {
        const amount = infoVote.options.reduce((pre, cur) => {
            const amoutnPre = pre.userIds?.length || 0;
            const amountCur = cur.userIds.length || 0
            return (
                amoutnPre + amountCur
            )
        })
        return amount;
    }




    return (

        <Modal
            title="Bình chọn"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={footer}
            centered
            bodyStyle={MODAL_OPTION_STYLE.BODY_STYLE}
        >

            <div className='modal-view-option'>
                <div className="modal-view-option_title">
                    <h3>{infoVote?.content}</h3>
                    <small>Tạo bởi <strong>{infoVote?.user?.name}</strong> - Hôm qua</small>
                </div>

                {(getMumberVotes() && getMumberVotes()) > 0 && (
                    <p
                        className='overview-text'
                        onClick={handleShowDetail}
                    >
                        {`${getNumberJoinVote().length} người tham gia ${getMumberVotes()} lượt bình chọn `}<CaretRightOutlined />
                    </p>

                )}


                <div className="modal-view-option_list">

                    <Checkbox.Group onChange={handleCheckboxChange} value={getDefaultValues()}>

                        {infoVote.options.map((ele, index) => (
                            <div className="modal-view-option_item" key={index}>
                                <div className="modal-view-option_checkbox">
                                    <Checkbox value={ele.name} checked={true} >

                                        <div className="vote-message_item" >


                                            <span className="vote-message_name-option">
                                                {ele.name}
                                            </span>

                                            <strong className="vote-message_munber-voted">
                                                {ele.userIds.length}
                                            </strong>

                                            <div className="vote-message_progress" style={{ width: `${countingPercent(ele.userIds.length)}%` }} />

                                        </div>

                                    </Checkbox>
                                </div>






                                <div className="modal-view-option_avatar">
                                    <Avatar.Group
                                        maxCount={1}
                                        maxStyle={{
                                            color: '#f56a00',
                                            backgroundColor: '#fde3cf',
                                        }}
                                    >

                                        {(ele.userIds.length > 0 && memberInConversation.length > 0) && (
                                            ele.userIds.map((ele, index) => {
                                                {
                                                    if (getUserFromConver(ele)) {
                                                        return (
                                                            <PersonalIcon
                                                                key={index}
                                                                name={getUserFromConver(ele)?.name}
                                                                avatar={getUserFromConver(ele)?.avatar}
                                                                demention={32}
                                                                color={getUserFromConver(ele)?.avatarColor}

                                                            />
                                                        )
                                                    } else {
                                                        return (
                                                            <PersonalIcon
                                                                key={index}
                                                                noneUser={true}
                                                                demention={32}

                                                            />
                                                        )
                                                    }
                                                }

                                            })
                                        )}

                                    </Avatar.Group>
                                </div>

                            </div>
                        ))}
                    </Checkbox.Group>
                </div>



                <div className="modal-view-option_add">
                    <Form
                        name="dynamic_form_nest_item"
                        layout='vertical'
                        form={form}
                        onValuesChange={handleValueChange}
                    >


                        <Form.List
                            name="options"

                        >
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                                        <div className="modal-view-option_form">

                                            <div className="form-checkbox">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'checkbox']}
                                                    fieldKey={[fieldKey, 'checkbox']}
                                                    valuePropName="checked"
                                                >

                                                    <Checkbox />
                                                </Form.Item>
                                            </div>


                                            <div className="form-input">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'name']}
                                                    fieldKey={[fieldKey, 'name']}
                                                    validateTrigger={['onChange', 'onBlur']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            // whitespace: true,
                                                            message: "Nhập thông tin lựa chọn",
                                                        },
                                                        ({ getFieldValue }) => ({
                                                            validator(_, value) {

                                                                const tempValue = value ? value.toLowerCase() : value;
                                                                let count = 0;
                                                                getFieldValue('options').forEach(ele => {
                                                                    if (ele && ele.name.toLowerCase() === tempValue) {
                                                                        count += 1
                                                                    }
                                                                });

                                                                const checkDuplicate = infoVote.options.find(ele => ele.name.toLowerCase() === tempValue);

                                                                if (value && checkDuplicate) {

                                                                    return Promise.reject(new Error('Các lựa chọn không dược trùng nhau'));
                                                                }

                                                                if (value && count > 1) {

                                                                    return Promise.reject(new Error('Các lựa chọn không dược trùng nhau'));
                                                                }
                                                                return Promise.resolve();
                                                            },
                                                        }),
                                                    ]}

                                                >
                                                    <Input
                                                        spellCheck={false}
                                                        placeholder={`Lựa chọn ${infoVote && infoVote.options.length + index + 1}`}
                                                        style={{ width: '100%' }}
                                                        suffix={fields.length > 0 ? (
                                                            <MinusCircleOutlined
                                                                className="dynamic-delete-button"
                                                                onClick={() => remove(name)}
                                                            />
                                                        ) : null}
                                                    />

                                                    {/* <div className="hidden-avatar-temp"></div> */}



                                                </Form.Item>



                                            </div>



                                            {/* </div> */}

                                        </div>

                                    ))}
                                    <Form.Item>
                                        <Button
                                            type="default"
                                            onClick={() => add()}
                                            icon={<PlusOutlined />}

                                        >
                                            Thêm lựa chọn
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>

                    </Form>
                </div>
            </div>


        </Modal>

    );
}

export default ModalViewOption;