import { React, useState, useEffect } from 'react';
import multiavatar from '@multiavatar/multiavatar';

export default function Request(props) {
  const [decryptedData, setDecryptedData] = useState(null);

  useEffect(() => {
    setDecryptedData(null);
  }, [props.properties]);

  const decryptData = () => {
    window.ethereum
      .request({
        method: 'eth_decrypt',
        params: [props.properties, props.user],
      })
      .then((decryptedMessage) => {
        setDecryptedData(JSON.parse(decryptedMessage));
      })
      .catch((error) => console.log(error.message));
  };
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
      {decryptedData ? (
        <td className='px-6 py-4 whitespace-nowrap'>
          {decryptedData.map((ele, i) => (
            <p key={i} className='text-sm text-gray-600'>
              {ele.label}
            </p>
          ))}
        </td>
      ) : (
        <td className='px-6 py-4 whitespace-nowrap'>
          <button
            name='decrypt'
            id='decrypt'
            onClick={decryptData}
            className='flex items-center justify-between py-1 px-2 m-auto border border-transparent shadow-sm text-sm rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            <svg
              className='h-4 w-4'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                clipRule='evenodd'
              />
            </svg>
            <span className='ml-1'>Decrypt request</span>
          </button>
        </td>
      )}
      {decryptedData ? (
        <td className='px-6 py-4 whitespace-nowrap align-text-top'>
          {decryptedData.map((ele, i) => (
            <p key={i} className='text-sm text-gray-600'>
              {ele.value}
            </p>
          ))}
        </td>
      ) : null}
      {decryptedData ? (
        <td className='px-6 py-4 whitespace-nowrap'>
          {decryptedData.map((ele, i) =>
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
      ) : null}

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
