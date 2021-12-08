import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import { Avatar, Tooltip } from 'antd';

ThumbnailMutiple.propTypes = {
    participants: PropTypes.number.isRequired,
};

ThumbnailMutiple.propTypes = {

};

const styleGroup3 = {
    position: 'relative',
    left: '50%',
    transform: 'translateX(-50%)'
}

const styleGroup2 = {
    display: 'flex',
    alignItems: 'center',
}

function ThumbnailMutiple(props) {
    const { participants } = props;
    return (
        <div id='thumbnail-mutiple'>
            {(() => {
                if (participants === 3) {
                    return (
                        <div className='conversation-item_box'>
                            <div className="left-side-box">
                                <div className="icon-users-group">
                                    <Avatar.Group
                                        maxCount={3}
                                        size={28}
                                        maxPopoverPlacement={false}
                                    >
                                        <Avatar
                                            size={28}
                                            src="https://vnn-imgs-f.vgcloud.vn/2019/10/09/23/bo-qua-lum-xum-huong-ly-ra-mat-mv-moi.jpg"
                                        />
                                        <Avatar
                                            size={28}
                                            src='data:image/jpeg;base64,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'
                                        />

                                        <Avatar
                                            size={28}
                                            style={styleGroup3}
                                            src="https://vnn-imgs-f.vgcloud.vn/2019/10/09/23/bo-qua-lum-xum-huong-ly-ra-mat-mv-moi.jpg"
                                        />

                                    </Avatar.Group>
                                </div>
                            </div>


                        </div>
                    )

                } else if (participants === 2) {
                    return (
                        <div className='conversation-item_box'>
                            <div className="left-side-box">
                                <div className="icon-users-group" style={styleGroup2}>
                                    <Avatar.Group
                                        maxCount={3}
                                        size={28}
                                        maxPopoverPlacement='none'
                                        vi
                                    >
                                        <Avatar
                                            size={28}
                                            src="https://vnn-imgs-f.vgcloud.vn/2019/10/09/23/bo-qua-lum-xum-huong-ly-ra-mat-mv-moi.jpg"
                                        />
                                        <Avatar
                                            size={28}
                                            src='data:image/jpeg;base64,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'
                                        />


                                    </Avatar.Group>
                                </div>
                            </div>


                        </div>
                    )
                } else {
                    return (
                        <div className='conversation-item_box'>
                            <div className="left-side-box">
                                <div className="icon-users-group">
                                    <div id='group-many-user'>

                                        <div className='per-user'>
                                            <Avatar
                                                size={28}
                                                src="https://vnn-imgs-f.vgcloud.vn/2019/10/09/23/bo-qua-lum-xum-huong-ly-ra-mat-mv-moi.jpg"
                                            />
                                        </div>

                                        <div className='per-user'>
                                            <Avatar
                                                size={28}
                                                src='data:image/jpeg;base64,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'
                                            />
                                        </div>

                                        <div className='per-user'>
                                            <Avatar
                                                size={28}
                                                style={{
                                                    backgroundColor: '#1890ff',
                                                }}
                                                src="https://vnn-imgs-f.vgcloud.vn/2019/10/09/23/bo-qua-lum-xum-huong-ly-ra-mat-mv-moi.jpg"
                                            />
                                        </div>
                                        <div className='per-user'>
                                            <Tooltip placement="top">
                                                <Avatar
                                                    style={{
                                                        backgroundColor: '#e8eaef',
                                                        color: '#848f9b'
                                                    }}
                                                    size={28}

                                                >
                                                    +2
                                                </Avatar>
                                            </Tooltip>
                                        </div>


                                    </div>
                                </div>
                            </div>



                        </div>
                    )

                }
            })()}




        </div>
    );
}

export default ThumbnailMutiple;