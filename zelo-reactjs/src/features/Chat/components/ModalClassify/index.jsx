import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, InfoCircleFilled, LeftOutlined, PlusOutlined, TagTwoTone } from '@ant-design/icons';
import { Button, Input, message, Modal, Popover } from 'antd';
import Text from 'antd/lib/typography/Text';
import ClassifyApi from 'api/ClassifyApi';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchListClassify } from '../../slice/chatSlice';
import './style.scss';
ModalClassify.propTypes = {
    isVisible: PropTypes.bool,
    onCancel: PropTypes.func,
    onOpen: PropTypes.func,
};

ModalClassify.defaultProps = {
    isVisible: false,
    onCancel: null,
    onOpen: null,

};

function ModalClassify({ isVisible, onCancel, onOpen }) {

    const { classifies, colors } = useSelector(state => state.chat);
    const [isShowModalAdd, setIsShowModalAdd] = useState(false);
    const [nameTag, setNameTag] = useState('');
    const [color, setColor] = useState({});
    const [isShowError, setIsShowError] = useState(false);
    const [isModalEdit, setIsModalEdit] = useState(false);
    const dispatch = useDispatch();
    const previousName = useRef();
    // const [isVisiblePopup, setIsVisblePopup] = useState(false);

    useEffect(() => {
        if (colors.length > 0) {
            setColor(colors[0]);
        }
    }, [colors])


    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    }


    const handleCancelModalAdd = () => {
        setIsShowModalAdd(false);
    }

    const handleShowModalAdd = () => {
        setIsShowModalAdd(true);
        setIsModalEdit(false);
        setNameTag('');
        if (onCancel) {
            onCancel();
        }
    }

    const handleBackModal = () => {
        setIsShowModalAdd(false);
        setIsModalEdit(false);

        if (onOpen) {
            onOpen();
        }

    }

    const handleInputChange = (e) => {
        const value = e.target.value;
        const index = classifies.findIndex(ele => ele.name.toLowerCase() === value.toLowerCase());


        // !isModalEdit && 
        if (index >= 0) {
            if (!isModalEdit) {
                setIsShowError(true);
            } else {
                if (previousName.current.name.toLowerCase() !== classifies[index].name.toLowerCase()) {
                    setIsShowError(true);
                }
            }

        } else {
            setIsShowError(false);
        }
        setNameTag(value);

    }

    const handleClickColor = (color) => {
        setColor(color);

    }

    const handleCreateClassify = async () => {
        if (isModalEdit) {
            try {
                await ClassifyApi.updateClassify(previousName.current._id, nameTag, color._id);
                message.success('C???p nh???t th??nh c??ng');
                setIsShowModalAdd(false);
                dispatch(fetchListClassify());
                if (onOpen) {
                    onOpen();
                }
            } catch (error) {
                message.error('C???p nh???t th???t b???i');
            }
        } else {
            try {
                await ClassifyApi.addClassify(nameTag, color._id);
                message.success('Th??m th??nh c??ng');
                setIsShowModalAdd(false);
                dispatch(fetchListClassify());

            } catch (error) {
                message.error('Th??m th???t b???i');
            }
        }

        setIsModalEdit(false);

    }

    const content = (
        <div className="popup-change-color">
            <span>Thay ?????i m??u th???</span>
            <div className="list-color">
                {colors.length > 0 &&
                    colors.map((ele, index) => (
                        <div
                            key={index}
                            onClick={() => handleClickColor(ele)}
                            className="popup-color-item"
                            style={{ background: ele.code }}
                        />
                    ))
                }
            </div>

        </div>
    );

    const handleEditClasify = (value) => {
        setIsModalEdit(true);
        setIsShowModalAdd(true);
        if (onCancel) {
            onCancel();
        }
        setNameTag(value.name);
        setColor(value.color)
        previousName.current = value;
    }

    const handleDeleteClasify = async (value) => {
        try {
            await ClassifyApi.deleteClassify(value._id);
            message.success('X??a th??nh c??ng');
            dispatch(fetchListClassify());
        } catch (error) {
            message.error('X??a th???t b???i');
        }
    }

    function confirm(value) {
        Modal.confirm({
            title: 'C???nh b??o',
            icon: <ExclamationCircleOutlined />,
            content: `B???n c?? th???c s??? mu???n x??a ? `,
            okText: '?????ng ??',
            cancelText: 'H???y',
            onOk: () => {
                handleDeleteClasify(value)
            }
        });
    }


    return (
        <>
            <Modal
                visible={isVisible}
                title="Qu???n l?? th??? ph??n lo???i"
                onCancel={handleCancel}
                footer={null}
            >

                <div className="modal-classify_wrapper">
                    <span className='modal-classify_title'>Danh s??ch th??? ph??n lo???i</span>


                    <div className="modal-classify_list-classify">

                        {
                            classifies.map((ele, index) => (
                                <div className="modal-classify-item" key={index}>
                                    <div className="modal-classify-item--left">
                                        <div className="classify-item-tag">
                                            <TagTwoTone twoToneColor={ele.color.code} />
                                        </div>

                                        <div className="classify-item-name">
                                            {ele.name}
                                        </div>
                                    </div>

                                    <div className="modal-classify-item--right">
                                        <div className="classify-item-edit icon-classify" onClick={() => handleEditClasify(ele)}>
                                            <EditOutlined />
                                        </div>

                                        <div className="classify-item-remove icon-classify" onClick={() => confirm(ele)}>
                                            <DeleteOutlined />
                                        </div>
                                    </div>

                                    <div className="modal-classify-item-amount">
                                        2
                                    </div>
                                </div>
                            ))
                        }

                    </div>

                    <div className="modal-classify_add" onClick={handleShowModalAdd}>
                        <PlusOutlined />&nbsp;Th??m ph??n lo???i
                    </div>


                </div>


            </Modal>


            <Modal
                title={
                    <div className="modal-add_header">
                        <div className="modal-add_header--icon" onClick={handleBackModal}>
                            <LeftOutlined />
                        </div>
                        <span>{isModalEdit ? 'Chi Ti???t th??? ph??n lo???i' : 'Th??m th??? ph??n lo???i'}</span>
                    </div>
                }
                visible={isShowModalAdd}
                onOk={handleCreateClassify}
                onCancel={handleCancelModalAdd}
                okButtonProps={{ disabled: (nameTag.trim().length > 0 ? false : true) || isShowError || !(previousName.current?.name !== nameTag || previousName.current?.color._id !== color._id) }}
                okText={isModalEdit ? 'C???p nh???t' : 'Th??m ph??n lo???i'}
                cancelText='H???y'
            >
                <div className="modal-add-classify_wrapper">
                    <div className="modal-add-classify--title">
                        T??n th??? ph??n lo???i
                    </div>

                    <div className="modal-add-classify--input">
                        <Input
                            spellCheck={false}
                            value={nameTag}
                            size="middle"
                            placeholder="Nh???p t??n th??? ph??n lo???i"
                            onChange={handleInputChange}
                            suffix={
                                <div className="tag-select-icon">
                                    <Popover
                                        content={content}
                                        trigger="click"

                                    >
                                        <Button
                                            type="text"
                                            icon={<TagTwoTone twoToneColor={color.code} />}
                                        />
                                    </Popover>
                                </div>
                            }
                        />
                    </div>

                    <div className='check-name-classify'>
                        {isShowError && <Text type="danger"><InfoCircleFilled />T??n ph??n lo???i ???? t???n t???i</Text>}
                    </div>
                </div>
            </Modal>


        </>


    );
}

export default ModalClassify;