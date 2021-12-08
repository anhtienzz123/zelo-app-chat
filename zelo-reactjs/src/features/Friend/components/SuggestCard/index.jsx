import React from 'react';
import PropTypes from 'prop-types';
import PersonalIcon from 'features/Chat/components/PersonalIcon'
import './style.scss';
import { Button, message } from 'antd';
import friendApi from 'api/friendApi';
import { useDispatch, useSelector } from 'react-redux';
import { updateSuggestFriend } from '../../friendSlice';

SuggestCard.propTypes = {
    data: PropTypes.object,
    onClick: PropTypes.func,
};

SuggestCard.defaultProps = {
    data: {},
    onClick: null,
};

function SuggestCard({ data, onClick }) {


    const handleOnClick = () => {
        if (onClick) {
            onClick(data)
        }
    }



    return (
        <div className='suggest_card' onClick={handleOnClick}>
            <div className="suggest_card-img">
                <PersonalIcon
                    avatar={data.avatar}
                    name={data.name}
                    demention={90}
                    color={data.avatarColor}
                />
            </div>
            <div className="suggest_card-info">
                <strong className='suggest_card-info--name'>
                    {data.name}
                </strong>
                <span className='suggest_card-info--common'>
                    {`${data.numberCommonGroup} nhóm chung`}
                </span>
                <span className='suggest_card-info--common'>
                    {`${data.numberCommonFriend} bạn chung`}
                </span>

            </div>


        </div>
    );
}

export default SuggestCard;