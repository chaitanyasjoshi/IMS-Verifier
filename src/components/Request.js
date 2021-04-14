import { React, useState, useEffect } from 'react';
import multiavatar from '@multiavatar/multiavatar';

import { ReactComponent as Check } from '../assets/icons/check.svg';
import { ReactComponent as Cross } from '../assets/icons/cross.svg';
import { ReactComponent as Revoke } from '../assets/icons/revoke.svg';
import { ReactComponent as Lock } from '../assets/icons/lock.svg';

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
            <div className='text-sm text-gray-500'>{props.ownerUname}</div>
          </div>
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm font-medium text-gray-900'>{props.docName}</div>
      </td>
      {decryptedData ? (
        <td className='px-6 py-4 whitespace-nowrap'>
          {decryptedData.map((ele, i) => (
            <div key={i} className='grid grid-cols-7 gap-6'>
              <p className='text-sm text-gray-600 col-span-3'>{ele.label}</p>
              <p className='text-sm text-gray-600 col-span-3'>
                {ele.value ? ele.value : ''}
              </p>
              {ele.verified ? (
                <Check className='h-5 w-5 text-green-700 col-span-1' />
              ) : props.status === 'Approved' ? (
                <Cross className='h5 w-5 text-red-700 col-span-1' />
              ) : props.status === 'Revoked' ? (
                <Revoke className='h5 w-5 text-red-700 col-span-1' />
              ) : null}
            </div>
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
            <Lock className='h-4 w-4' />
            <span className='ml-1'>Decrypt request</span>
          </button>
        </td>
      )}

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
