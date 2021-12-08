import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import FriendCard from '../FriendCard';
import friendApi from 'api/friendApi';
import { fetchListMyRequestFriend } from 'features/Friend/friendSlice';
import { useDispatch } from 'react-redux';

ListMyFriendRequest.propTypes = {
    data: PropTypes.array,
};

function ListMyFriendRequest({ data }) {

    const dispatch = useDispatch();
    const handleRemoveMyRequest = async (value) => {
        await friendApi.deleteSentRequestFriend(value._id);
        dispatch(fetchListMyRequestFriend());
    }


    return (
        <div className='list-my-friend-request'>

            {(data && data.length > 0) &&
                data.map((ele, index) => (
                    <FriendCard
                        key={index}
                        isMyRequest={true}
                        data={ele}
                        onCancel={handleRemoveMyRequest}
                    />

                ))
            }


        </div>
    );
}

export default ListMyFriendRequest;