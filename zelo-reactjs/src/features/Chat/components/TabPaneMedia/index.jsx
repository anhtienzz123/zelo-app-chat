import { Col, Row, Select } from 'antd';
import RangeCalendarCustom from 'components/RangeCalendarCustom';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import fileHelpers from 'utils/fileHelpers';
import PersonalIcon from '../PersonalIcon';
import './style.scss';

TabPaneMedia.propTypes = {
    members: PropTypes.array,
    onQueryChange: PropTypes.func,
};

TabPaneMedia.defaultProps = {
    members: [],
    onQueryChange: null,
};

function TabPaneMedia(props) {
    const { members, onQueryChange } = props;
    const { Option } = Select;

    const [sender, setSender] = useState('');
    const [query, setQuery] = useState({});
    const handleChange = (memberId) => {


        const index = members.findIndex(
            (memberEle) => memberEle._id == memberId
        );
        let queryTempt = {};

        if (index > -1) {
            setSender(members[index].name);
            queryTempt = {
                ...query,
                senderId: memberId,
            };
            setQuery(queryTempt);
        } else {
            setSender('');
            queryTempt = {
                ...query,
                senderId: '',
            };
            setQuery(queryTempt);
        }

        if (onQueryChange) onQueryChange(queryTempt);
    };


    const handleDatePickerChange = (date, dateString) => {
        const queryTempt = {
            ...query,
            ...fileHelpers.convertDateStringsToServerDateObject(dateString),
        };
        setQuery({ ...query, queryTempt });
        if (onQueryChange) onQueryChange(queryTempt);
    };


    return (
        <div id='tabpane-media'>
            <Row gutter={[16, 8]}>
                <Col span={24}>
                    <Select
                        dropdownMatchSelectWidth={false}
                        optionLabelProp='label'
                        showSearch
                        style={{ width: '100%' }}
                        onChange={handleChange}
                        placeholder='Người gửi'
                        optionFilterProp='children'
                        //onSearch={onSearch}
                        value={sender}
                        filterOption={(input, option) =>
                            option.value
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        }
                        filterSort={(optionA, optionB) =>
                            optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                        }
                        allowClear
                    >
                        {members.map((memberEle, index) => (
                            <Option key={index} value={memberEle._id}>
                                <div className='option-item'>
                                    <div className='icon-user-item'>
                                        <PersonalIcon
                                            demention={24}
                                            avatar={memberEle.avatar}
                                            name={memberEle.name}
                                        />
                                    </div>

                                    <div className='name-user-item'>
                                        {memberEle.name}
                                    </div>
                                </div>
                            </Option>
                        ))}
                    </Select>
                </Col>

                <Col span={24}>
                    <RangeCalendarCustom
                        style={{ width: '100%' }}
                        onChange={handleDatePickerChange}
                        allowClear={true}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default TabPaneMedia;
