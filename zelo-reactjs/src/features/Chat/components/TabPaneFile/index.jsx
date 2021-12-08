import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Select, DatePicker } from 'antd';
import {
    FileExcelFilled,
    FilePdfFilled,
    FilePptFilled,
    FileWordFilled,
} from '@ant-design/icons';
import PersonalIcon from '../PersonalIcon';

const { Option } = Select;

TabPaneFile.propTypes = {};

function TabPaneFile(props) {
    const { RangePicker } = DatePicker;
    const dateFormat = 'DD/MM/YYYY';

    const handleDatePickerChange = (date, dateString) => {
        console.log('date', date);
        console.log('date String', dateString);
    };

    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    function onSearch(val) {
        console.log('search:', val);
    }

    return (
        <div id='tab-pane-file'>
            <Row gutter={[16, 8]}>
                <Col span={8}>
                    <Select
                        dropdownMatchSelectWidth={false}
                        optionLabelProp='label'
                        style={{ width: '100%' }}
                        onChange={handleChange}
                        placeholder='Loại'
                        optionFilterProp='children'
                        // onSearch={onSearch}
                        filterOption={(input, option) =>
                            option.value
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        }
                        filterSort={(optionA, optionB) =>
                            optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                        }>
                        <Option value='1' label='Hoàng Hạ Xuyên'>
                            <div className='option-item'>
                                <div className='icon-user-item'>
                                    <FilePdfFilled />
                                </div>

                                <div className='name-user-item'>PDF</div>
                            </div>
                        </Option>

                        <Option value='2' label='Word'>
                            <div className='option-item'>
                                <div className='icon-user-item'>
                                    <FileWordFilled />
                                </div>

                                <div className='name-user-item'>Word</div>
                            </div>
                        </Option>

                        <Option value='3' label='PowerPoint'>
                            <div className='option-item'>
                                <div className='icon-user-item'>
                                    <FilePptFilled />
                                </div>

                                <div className='name-user-item'>PowerPoint</div>
                            </div>
                        </Option>

                        <Option value='4' label='Excel'>
                            <div className='option-item'>
                                <div className='icon-user-item'>
                                    <FileExcelFilled />
                                </div>

                                <div className='name-user-item'>Excel</div>
                            </div>
                        </Option>
                    </Select>
                </Col>{' '}

                <Col span={8}>
                    <Select
                        dropdownMatchSelectWidth={false}
                        optionLabelProp='label'
                        showSearch
                        style={{ width: '100%' }}
                        onChange={handleChange}
                        placeholder='Người gửi'
                        optionFilterProp='children'
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                            option.value
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        }
                        filterSort={(optionA, optionB) =>
                            optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                        }>
                        <Option
                            value='1'
                            title='ádkljfklajskldjflkjaklsdf'
                            label='Hoàng Hạ Xuyên'>
                            <div className='option-item'>
                                <div className='icon-user-item'>
                                    <PersonalIcon demention={24} />
                                </div>

                                <div className='name-user-item'>
                                    Hoàng Hạ Xuyên
                                </div>
                            </div>
                        </Option>
                    </Select>
                </Col>
                {/* <Col span={8}>
                    <Select
                        style={{ width: '100%' }}
                        onChange={handleChange}
                        placeholder='Ngày gửi'>
                        <Option value={1}>Trong vòng 1 tuần</Option>
                        <Option value={2}>Trong vòng 1 tháng</Option>
                        <Option value={3}>Trong vòng 3 tháng </Option>
                    </Select>
                </Col> */}
                <Col span={24}>
                    <RangePicker
                        style={{ width: '100%' }}
                        placeholder={['Từ ngày', 'Đến ngày']}
                        format={dateFormat}
                        onChange={handleDatePickerChange}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default TabPaneFile;
