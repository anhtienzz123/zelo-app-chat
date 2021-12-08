import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
    Table,
    Breadcrumb,
    Divider,
    Form,
    Col,
    Row,
    Input,
    Select,
    DatePicker,
    Space,
    Tag,
    Button,
    Drawer,
    Tooltip,
    message,
    Upload,
    Popconfirm,
} from 'antd';
import adminApi from 'api/adminApi';
import { DeleteOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import './style.scss';

StickerPage.propTypes = {};
function StickerPage(props) {
    const stickers = props.location.state;
    const history = useHistory();
    const [dataSource, setDataSource] = useState([]);
    const [sticker, setSticker] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const match = useRouteMatch();

    function cancel(e) {
        console.log(e);
        message.error('Click on No');
    }
    function onShowSizeChange(page, pageSize) {
        console.log(page, pageSize);
    }
    const columns = [
        {
            title: 'Sticker',
            //dataIndex: 'stickers',
            key: 'stickers',
            render: (stickers) => (
                <span>
                    <a key={stickers}>
                        <img
                            width="125px"
                            height="75px"
                            src={stickers}
                            border="1px solid black"
                        />
                        <br />
                    </a>
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (stickers, data, row) => (
                <Space size="middle">
                    <Popconfirm
                        title="Bạn có muốn xoá ?"
                        onConfirm={() => handleDeleteSticker(stickers)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <a alt="xoá group sticker">
                            <DeleteOutlined />
                            Xoá Sticker{' '}
                        </a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    const handleGetAllGruopSricker = async () => {
        try {
            const list = await adminApi.getAllGroupSticker();
            return list;
        } catch (error) {}
    };

    useEffect(() => {
        handleGetAllGruopSricker()
            .then((result) => {
                setDataSource(result);
            })
            .catch((err) => {
                throw err;
            });
    }, []);

    const handleGetAllSricker = async () => {
        try {
            dataSource.map((result1) => {
                setSticker(result1.stickers);
                return result1.stickers;
            });
        } catch (error) {}
    };

    const handleDeleteSticker = (urlstickers) => {
        try {
            adminApi.deleteSticker(id, urlstickers);
            history.push(`/admin/stickers`);
            window.location.reload();
            message.success('Đã xoá sticker', 5);
        } catch (error) {
            message.error('chưa xoá được sticker', 5);
            console.log('fail ');
        }
    };

    const handleGetAll = async () => {
        try {
            console.log('sticker', sticker);
        } catch (error) {}
    };

    const { id } = match.params;
    return (
        <>
            <div className="ant-col-xs-8">
                <h1>DANH SÁCH STICKER</h1>
            </div>
            <Divider></Divider>
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item>&ensp; Admin</Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="/admin/stickers">Group Sticker</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="">Stickers</a>
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>

            <Divider></Divider>

            <Table
                dataSource={stickers}
                columns={columns}
                bordered
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    showSizeChanger: false,
                    onShowSizeChange: { onShowSizeChange },
                    onChange: (page, pageSize) => {
                        setPage(page);
                        setPageSize(pageSize);
                    },
                }}
                rowKey={(record) => record.stickers}
            ></Table>
        </>
    );
}

export default StickerPage;
