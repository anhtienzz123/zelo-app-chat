import { Col, Radio, Row, Typography } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

GenderRadioField.propTypes = {};

GenderRadioField.defaultProps = {};

function GenderRadioField({ field }) {
    const { name, value } = field;

    const handleChange = (e) => {
        const selectedValue = e.target.value;

        const changeEvent = {
            target: {
                name: name,
                value: selectedValue,
            },
        };

        field.onChange(changeEvent);
    };

    return (
        <Radio.Group value={value} onChange={handleChange}>
            <Radio key={0} value={0}>
                Nam
            </Radio>

            <Radio key={1} value={1}>
                Nữ
            </Radio>
        </Radio.Group>
    );
}

export default GenderRadioField;
