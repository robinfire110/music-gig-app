import React, { useState } from 'react'
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

function Datepicker({ value, onChange }) {
    return (
        <div className='p-5'>
            <DateTimePicker onChange={onChange} value={value} />
        </div>
    )
}

export default Datepicker