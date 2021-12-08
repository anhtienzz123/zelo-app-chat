import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // ES6

TextEditor.propTypes = {
    showFormat: PropTypes.bool,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    showLike: PropTypes.func,
    onSetValue: PropTypes.func,
    valueHtml: PropTypes.string,
};

TextEditor.defaultProps = {
    showFormat: null,
    onBlur: null,
    onFocus: null,
    showLike: null,
    onSetValue: null,
    valueHtml: '',
};

function TextEditor(props) {
    const ref = useRef();
    const { showFormat, onBlur, onFocus, showLike, valueHtml, onSetValue } =
        props;
    // const [value, setValue] = useState('');

    useEffect(() => {
        ref.current?.editor.root.setAttribute('spellcheck', 'false');
    }, []);

    const formats = [
        [{ header: '1' }, { header: '2' }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
        ],
    ];

    const handleFocus = () => {
        if (onFocus) {
            onFocus();
        }
    };

    const handleOnBlur = () => {
        if (onBlur) {
            onBlur();
        }
    };

    const style_MainEditor = {
        minHeight: '122px',
    };

    const regEx = new RegExp('^(<p><br></p>)+$');
    const handleOnChange = (content, delta, source, editor) => {

        if (onSetValue) {
            onSetValue(content);
        }
        if (showLike && !regEx.test(content)) {
            showLike(false);
        } else {
            showLike(true);
        }
    };

    const handleOnKeyDown = (event) => { };

    return (
        <div id='text-editor' style={showFormat ? style_MainEditor : undefined}>
            <ReactQuill
                ref={ref}
                theme='snow'
                value={valueHtml}
                onChange={handleOnChange}
                placeholder='Nhập tin nhắn'
                onFocus={handleFocus}
                onBlur={handleOnBlur}
                modules={{ toolbar: showFormat ? formats : false }}
                style={{ border: 'none', outline: 'none' }}
                onKeyDown={handleOnKeyDown}
            />
        </div>
    );
}

export default TextEditor;
