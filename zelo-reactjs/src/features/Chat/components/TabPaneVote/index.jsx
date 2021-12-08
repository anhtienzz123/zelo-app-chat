import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import VoteMessage from '../MessageType/VoteMessage';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { fetchVotes, updateVote } from 'features/Chat/slice/chatSlice';
import { Button } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import voteApi from 'api/voteApi';

// TabPaneVote.propTypes = {
//     data: PropTypes.array,
// };

// TabPaneVote.defaultProps = {
//     data: [],
// };

function TabPaneVote() {

    const { currentConversation, votes, totalPagesVote } = useSelector(state => state.chat);

    const dispatch = useDispatch();
    const [query, setQuery] = useState({
        page: 0,
        size: 4
    })



    useEffect(() => {
        setQuery({
            page: 0,
            size: 4
        })
        dispatch(fetchVotes({
            conversationId: currentConversation,
            ...query
        }))
    }, [currentConversation]);




    const handleIncreasePage = async () => {
        const respone = await voteApi.getVotes(currentConversation, query.page + 1, query.size);
        const { data } = respone;
        console.log(data);
        dispatch(updateVote([...votes, ...data]));

        setQuery({
            size: query.size,
            page: query.page + 1
        })

    }





    return (
        <div id='tabpane-vote'>
            {votes.map((ele, index) => (
                <div key={index} className="tabpane-vote-item">
                    <VoteMessage
                        data={ele}
                    />
                </div>
            ))}

            {query.page + 1 < totalPagesVote && (
                <Button
                    icon={<CaretDownOutlined />}
                    block
                    type='primary'
                    onClick={handleIncreasePage}
                >
                    Xem thêm
                </Button>
            )}

        </div>
    );
}

export default TabPaneVote;