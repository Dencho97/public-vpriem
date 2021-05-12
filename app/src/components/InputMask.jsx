import React, { forwardRef } from 'react';
import { Input } from 'antd';
import ReactInputMask from 'react-input-mask';
import PropTypes from 'prop-types';

const InputMask = forwardRef((props, ref) => (
    <ReactInputMask {...props}>
      {inputProps => <Input {...inputProps} ref={ref} disabled={props.disabled ? props.disabled : null} />}
    </ReactInputMask>
));

InputMask.propTypes = {
    disabled: PropTypes.bool,
    mask: PropTypes.string,
    maskChar: PropTypes.string,
    formatChars: PropTypes.object,
    alwaysShowMask: PropTypes.bool,
    inputRef: PropTypes.func
};

export default InputMask;
