import React from 'react';
import multiavatar from '@multiavatar/multiavatar';

export default function Request(props) {
  return (
    <tr>
      <td className='px-6 py-4 whitespace-nowrape'>
        <div className='flex items-center'>
          <div className='flex-shrink-0 h-10 w-10'>
            <span
              className='h-10 w-10 rounded-full'
              dangerouslySetInnerHTML={{
                __html: multiavatar(props.owner),
              }}
            />
          </div>
          <div className='ml-4'>
            <div className='text-sm font-medium text-gray-900'>
              {props.owner}
            </div>
            <div className='text-sm text-gray-500'>jane.cooper@example.com</div>
          </div>
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm font-medium text-gray-900'>{props.docName}</div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        {props.properties.map((ele, i) => (
          <p key={i} className='text-sm text-gray-600'>
            {ele.label}
          </p>
        ))}
      </td>
      <td className='px-6 py-4 whitespace-nowrap align-text-top'>
        {props.properties.map((ele, i) => (
          <p key={i} className='text-sm text-gray-600'>
            {ele.value}
          </p>
        ))}
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        {props.properties.map((ele, i) =>
          ele.verified ? (
            <svg
              key={i}
              className='h-5 w-5 text-green-700'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
          ) : props.status === 'Approved' ? (
            <svg
              key={i}
              className='h5 w-5 text-red-700'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                clipRule='evenodd'
              />
            </svg>
          ) : null
        )}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-center'>
        <span
          className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
            props.status === 'Requested'
              ? 'bg-yellow-100 text-yellow-800'
              : props.status === 'Approved'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {props.status}
        </span>
      </td>
    </tr>
  );
}
