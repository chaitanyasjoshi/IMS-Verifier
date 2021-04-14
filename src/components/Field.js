import React, { useState, useEffect } from 'react';

export default function Field(props) {
  const [ischecked, setChecked] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    setChecked(false);
    setValue('');
  }, [props.docName]);

  return (
    <div className='mt-2 flex items-center'>
      <div className='flex items-center h-5'>
        <input
          id={`${props.label.replace(/\s/g, '')}`}
          name={`${props.label.replace(/\s/g, '')}`}
          type='checkbox'
          checked={ischecked}
          onChange={(event) => {
            setChecked(!ischecked);
            props.handlePropChange(event, props.index);
          }}
          className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded'
        />
      </div>
      <div className='ml-3 text-sm'>
        <label
          htmlFor={`${props.label.replace(/\s/g, '')}`}
          className='font-medium text-gray-700'
        >
          {props.label}
        </label>
      </div>
      <input
        type={`${props.label.toLowerCase().includes('date') ? 'date' : 'text'}`}
        name={`verify${props.label.replace(/\s/g, '')}`}
        id={`verify${props.label.replace(/\s/g, '')}`}
        autoComplete='off'
        placeholder='Add value to be verified'
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          props.handleValueChange(event, props.index);
        }}
        disabled={!ischecked}
        className={`${
          !ischecked ? 'disabled:opacity-60 cursor-not-allowed' : ''
        } mt-1 ml-3 focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border-gray-300 rounded-md`}
      />
    </div>
  );
}
