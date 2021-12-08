import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Tooltip } from 'antd';
import getSummaryName from 'utils/nameHelper'

AvatarCustom.propTypes = {
    src: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    style: PropTypes.object,
    demention: PropTypes.number,
    size: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    color: PropTypes.string,
};


AvatarCustom.defaultProps = {
    src: "",
    name: "",
    style: {},
    color: "#408ec6"
};




function AvatarCustom(props) {

    const { src, name, style, color, ...rest } = props;


    return (
        <>
            {
                src ? (
                    <Avatar
                        {...props}
                    />
                ) : (
                    <Tooltip
                        title={name}
                        placement="top"

                    >
                        <Avatar
                            style={{ backgroundColor: color, ...style }}
                            {...rest}
                        >
                            {getSummaryName(name)}
                        </Avatar>
                    </Tooltip>
                )
            }
        </>
    );
}

export default AvatarCustom;