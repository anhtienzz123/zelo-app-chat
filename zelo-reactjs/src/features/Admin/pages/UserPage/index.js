import { Divider, Input, message, Pagination } from 'antd';
import 'antd/dist/antd.css';
import adminApi from 'api/adminApi';
import { setLoading } from 'features/Account/accountSlice';
import UserTable from 'features/Admin/components/UserTable';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const { Search } = Input;

function UserPage(props) {
    const dispatch = useDispatch();
    const [dataSource, setDataSource] = useState({});
    const [query, setQuery] = useState({
        username: '',
        page: 0,
        size: 20,
    });

    const onchange = (page, _) => {
        setQuery({ ...query, page: page - 1 });
    };
    const onSearch = (value) => {
        setQuery({ ...query, username: value });
    };

    const handleUpdateDelete = async (id, isDeleted) => {
        try {
            dispatch(setLoading(true));
            await adminApi.delete(id, isDeleted);
            message.success('Đã đổi trạng thái', 5);
            setQuery({ ...query });
        } catch (error) {
            message.error(
                'Tài khoản đang đăng nhập....! không thể đổi trạng thái',
                5
            );
        }
        dispatch(setLoading(false));
    };

    useEffect(() => {
        adminApi
            .getListUsersByUserName(query.username, query.page, query.size)
            .then((res) => setDataSource(res));
    }, [query]);

    return (
        <div style={{ padding: '10px 20px' }}>
            <Divider orientation="left">Quản lý người dùng</Divider>

            <div style={{ textAlign: 'center' }}>
                <Search
                    placeholder="SĐT/Email người dùng"
                    onSearch={onSearch}
                    enterButton
                    style={{ width: '40%' }}
                />
            </div>

            <Divider></Divider>
            <div className="users-table">
                <UserTable
                    usersPage={dataSource}
                    onDeleteUStatusUpdate={handleUpdateDelete}
                />
            </div>
            <div style={{ textAlign: 'right', marginTop: '10px' }}>
                <Pagination
                    defaultCurrent={dataSource.page + 1}
                    total={dataSource.totalPages * 10}
                    onChange={onchange}
                />
            </div>
        </div>
    );
}
export default UserPage;
