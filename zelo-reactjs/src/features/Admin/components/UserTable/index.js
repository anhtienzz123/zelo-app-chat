import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Popconfirm, Table, Menu, Tag, Typography } from 'antd';
import commonFuc from 'utils/commonFuc';

const { Text } = Typography;

UserTable.propTypes = {
    usersPage: PropTypes.object,
    onDeleteUStatusUpdate: PropTypes.func,
};

UserTable.defaultProps = {
    usersPage: {},
};

function UserTable({ usersPage, onDeleteUStatusUpdate }) {
    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Tài khoản',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            render: (gender) => <>{gender ? <p>Nữ</p> : <p>Nam</p>}</>,
        },
        {
            title: 'Trạng thái kích hoạt',
            key: 'isActived',
            dataIndex: 'isActived',
            render: (isActived) => (
                <>
                    {isActived ? (
                        <Tag color="blue">Đã kích hoạt</Tag>
                    ) : (
                        <Tag color="red">Chưa kích hoạt </Tag>
                    )}
                </>
            ),
        },
        {
            title: 'Trạng thái tài khoản',
            key: 'isDeleted',
            dataIndex: 'isDeleted',
            render: (isDeleted, data) => (
                <Dropdown
                    overlay={
                        <Menu>
                            <Menu.Item>
                                <Popconfirm
                                    title={<Text>Bạn có chắc thay đổi ?</Text>}
                                    onConfirm={() =>
                                        onDeleteUStatusUpdate(
                                            data._id,
                                            isDeleted ? '0' : '1'
                                        )
                                    }
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    {isDeleted
                                        ? 'Kích hoạt'
                                        : 'Không kích hoạt'}
                                </Popconfirm>
                            </Menu.Item>
                        </Menu>
                    }
                    arrow
                >
                    {isDeleted ? (
                        <Tag color="red">Không kích hoạt</Tag>
                    ) : (
                        <Tag color="blue">Kích hoạt</Tag>
                    )}
                </Dropdown>
            ),
        },
        {
            title: 'Quyền hạn',
            dataIndex: 'isAdmin',
            key: 'isAdmin',
            render: (isAdmin) => <>{isAdmin ? <p>Admin</p> : <p>User</p>}</>,
        },
    ];

    return (
        <Table
            dataSource={commonFuc.addSTTForList(
                usersPage.data,
                usersPage.page * usersPage.size
            )}
            columns={columns}
            pagination={false}
            bordered
        ></Table>
    );
}

export default UserTable;
