import FileItem from 'components/FileItem';
import PropTypes from 'prop-types';
import React from 'react';
import './style.scss';

ContentTabPaneFile.propTypes = {
    items: PropTypes.array,
};

ContentTabPaneFile.defaultProps = {
    items: [],
};

function ContentTabPaneFile(props) {
    const { items } = props;


    return (
        <div id='conten-tabpane-file'>
            {items.map((itemEle, index) => (
                <FileItem
                    key={index}
                    file={itemEle}
                    inArchive={true}
                />
            ))}
        </div>
    );
}

export default ContentTabPaneFile;
