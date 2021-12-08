import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import { LikeOutlined } from '@ant-design/icons';

ListReaction.propTypes = {
    type: PropTypes.string,
    isMyMessage: PropTypes.bool.isRequired,
    listReaction: PropTypes.array,
    onClickLike: PropTypes.func,
    onClickReaction: PropTypes.func,
    isLikeButton: PropTypes.bool,
};

ListReaction.defaultProps = {
    type: '',
    onClick: null,
    listReaction: [],
    onClickLike: null,
    onClickReaction: null,
    isLikeButton: true

};


function ListReaction({ type, isMyMessage, listReaction, onClickLike, onClickReaction, isLikeButton }) {


    const handleClickLike = () => {
        if (onClickLike) {
            onClickLike()
        }
    }

    const handleClickReaction = (ele) => {
        onClickReaction(ele)
    }


    return (
        <>
            {
                isLikeButton ? (
                    <div
                        className={`reaction ${isMyMessage ? 'left' : 'right'} ${type} `}
                    >
                        {
                            <div className="reaction-thumbnail">
                                <div onClick={handleClickLike} >
                                    <LikeOutlined />
                                </div>

                                <div className="list_icon-reaction">
                                    {listReaction.map(
                                        (ele, index) => (
                                            <span
                                                key={index}
                                                onClick={() => handleClickReaction(ele)}
                                            >
                                                {ele}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        }
                    </div>
                ) : (

                    <div className="list_icon-reaction">
                        {listReaction.map(
                            (ele, index) => (
                                <span
                                    key={index}
                                    onClick={() => handleClickReaction(ele)}
                                >
                                    {ele}
                                </span>
                            )
                        )}
                    </div>
                )
            }

        </>
    )
}
export default ListReaction;