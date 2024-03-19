import React from 'react';
import { Form } from 'react-bootstrap';

function restrictNumber(e, integer=true) {
    let regex = /[^0-9]+$/g;
    if (!integer) regex = /[^0-9.]+$/g;
    e.target.value = e.target.value.replace(regex, "");
}

//Control input with validation (no negative numbers). Uses text input because I don't like the way number input works.
function FormNumber({placeholder, onChange, disabled=false, integer=true, id, required=false, value, controlled=true, min=0, max=99, autoFocus=false}) {
    if (controlled)
    {
        return (
            <Form.Control type="text" id={id} value={value ?? ""} required={required} disabled={disabled} placeholder={placeholder} pattern="[0-9]*[.]?[0-9]*" onChange={onChange} minLength={min} maxLength={max} onInput={e => restrictNumber(e, integer)} autoFocus={autoFocus}></Form.Control>
        )
    }
}

export default FormNumber;