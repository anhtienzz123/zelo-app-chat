import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Col, message, Modal, Row } from 'antd';
import conversationApi from 'api/conversationApi';
import { fetchListGroup } from 'features/Friend/friendSlice';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { socket } from 'utils/socketClient';
import GroupCard from '../GroupCard';
import './style.scss';


ListGroup.propTypes = {
    data: PropTypes.array,
};

ListGroup.defaultProps = {
    data: []
};



function ListGroup({ data }) {
    const dispatch = useDispatch();

    const handleOnRemoveGroup = (key, id) => {
        confirm(id);
    }

    function confirm(id) {
        Modal.confirm({
            title: 'Cảnh báo',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có thực sự muốn rời khỏi nhóm',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await conversationApi.leaveGroup(id);
                    message.success(`Rời nhóm thành công`);
                    socket.emit('leave-conversation', id);
                    dispatch(fetchListGroup({ name: '', type: 2 }));
                } catch (error) {
                    message.error(`Rời nhóm thất bại`);
                }

            }
        });
    }

    return (

        <Row gutter={[16, 16]}>
            {data && data.length > 0 && (
                data.map((ele, index) => (
                    <Col
                        span={6}
                        xl={{ span: 6 }}
                        lg={{ span: 8 }}
                        md={{ span: 12 }}
                        sm={{ span: 12 }}
                        xs={{ span: 24 }}
                    >
                        <GroupCard
                            data={ele}
                            key={index}
                            onRemove={handleOnRemoveGroup}
                        />
                    </Col>
                )))}

        </Row>

    );
}

export default ListGroup;