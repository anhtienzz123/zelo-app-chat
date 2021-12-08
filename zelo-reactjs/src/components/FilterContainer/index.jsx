import { Tabs } from 'antd';
import ConverMutipleSearch from 'components/ConverMutipleSearch';
import ConverPersonalSearch from 'components/ConverPersonalSearch';
import PropTypes from 'prop-types';
import React from 'react';
import './style.scss';

FilterContainer.propTypes = {
    dataSingle: PropTypes.array,
    dataMutiple: PropTypes.array,
};

FilterContainer.defaultProps = {
    dataMutiple: [],
    dataSingle: []
};


function FilterContainer({ dataMutiple, dataSingle }) {

    const { TabPane } = Tabs;

    return (
        <div className='filter-container'>
            <Tabs defaultActiveKey="1" >
                <TabPane tab="Cá nhân" key="1">
                    <ConverPersonalSearch
                        data={dataSingle}
                    />
                </TabPane>
                <TabPane tab="Nhóm" key="2">
                    <ConverMutipleSearch
                        data={dataMutiple}
                    />
                </TabPane>
            </Tabs>
        </div>
    );
}

export default FilterContainer;