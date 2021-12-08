import { CloseCircleFilled, UsergroupAddOutlined } from '@ant-design/icons';
import { Avatar, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import PersonalIcon from '../PersonalIcon';
import './style.scss';
ItemsSelected.propTypes = {
    items: PropTypes.array,
};

ItemsSelected.defaultProps = {
    items: [],
};

function ItemsSelected({ items, onRemove }) {


    const handleRemoveSelect = (id) => {
        if (onRemove) {
            onRemove(id);
        }
    };

    return (
        <>
            {

                items && items.length > 0 &&
                items.map((item, index) => (
                    <div className="item-selected_wrapper">
                        <div className='item-selected--text' key={index}>
                            <div className='item-selected-avatar'>


                                {
                                    (!item.type) && (
                                        <PersonalIcon
                                            demention={20}
                                            avatar={item.avatar}
                                            name={item.name}
                                            color={item.avatarColor}
                                        />
                                    )
                                }


                                {
                                    (item.type && typeof item.avatar === 'string') && (
                                        <PersonalIcon
                                            demention={20}
                                            avatar={item.avatar}
                                            name={item.name}
                                            color={item.avatarColor}
                                        />
                                    )
                                }

                                {
                                    (item.type && typeof item.avatar === 'object') && (
                                        <Tooltip>
                                            <Avatar
                                                style={{ backgroundColor: '#f56a00' }}
                                                icon={<UsergroupAddOutlined />}
                                                size={20}
                                            />
                                        </Tooltip>
                                    )
                                }

                            </div>

                            <div className='item-selected-name'>
                                <span>{item.name}</span>
                            </div>



                        </div>

                        <div className='item-selected-remove' onClick={() => handleRemoveSelect(item._id)}>
                            <CloseCircleFilled />
                        </div>

                    </div>


                ))
            }

        </>

    );
}

export default ItemsSelected;