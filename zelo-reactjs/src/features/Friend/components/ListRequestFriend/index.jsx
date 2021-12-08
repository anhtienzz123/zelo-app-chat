import { message } from 'antd';
import friendApi from 'api/friendApi';
import { fetchListFriends } from 'features/Chat/slice/chatSlice';
import { fetchFriends, fetchListRequestFriend, setAmountNotify } from 'features/Friend/friendSlice';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FriendCard from '../FriendCard';

ListRequestFriend.propTypes = {
    data: PropTypes.array,
};

ListRequestFriend.defaultProps = {
    data: [],
};


function ListRequestFriend({ data }) {
    const dispatch = useDispatch();

    const { amountNotify } = useSelector((state) => state.friend)




    const handeDenyRequest = async (value) => {
        await friendApi.deleteRequestFriend(value._id);
        dispatch(setAmountNotify(amountNotify - 1))
        dispatch(fetchListRequestFriend());

    }

    const handleOnAccept = async (value) => {
        await friendApi.acceptRequestFriend(value._id);
        dispatch(fetchListRequestFriend());
        dispatch(fetchFriends({ name: '' }));
        dispatch(fetchListFriends({ name: '' }));
        dispatch(setAmountNotify(amountNotify - 1))
        message.success('Thêm bạn thành công');
    }





    return (
        <div id='list-friend-card'>
            {(data && data.length > 0) &&
                data.map((ele, index) => (
                    <FriendCard
                        key={index}
                        data={ele}
                        onDeny={handeDenyRequest}
                        onAccept={handleOnAccept}
                    />

                ))
            }
        </div>
    );
}

export default ListRequestFriend;