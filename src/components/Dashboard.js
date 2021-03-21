import React, { Component } from 'react';
import ReactNotification, { store } from 'react-notifications-component';
import { bufferToHex } from 'ethereumjs-util';
import { encrypt } from 'eth-sig-util';

import auth from '../utils/auth';
import 'react-notifications-component/dist/theme.css';
import 'animate.css';

import Field from './Field';
import Navbar from './Navbar';
export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.handleDocNameChange = this.handleDocNameChange.bind(this);
    this.handleOwnerChange = this.handleOwnerChange.bind(this);
    this.handlePropChange = this.handlePropChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);

    this.state = {
      user: null,
      contract: null,
      templates: [],
      fields: [],
      docIssuer: '',
      ownerAddress: '',
      docName: '',
      request: [],
    };
  }

  componentDidMount = () => {
    if (!auth.getContract()) {
      auth.init().then(() => {
        this.initialize();
      });
    } else {
      this.initialize();
    }
  };

  initialize = () => {
    window.ethereum.on('accountsChanged', async function (accounts) {
      auth.logout(() => {
        this.props.history.push('/');
        window.location.reload();
      });
    });

    this.setState(
      { user: auth.getUser(), contract: auth.getContract() },
      () => {
        this.fetchTemplates();

        this.state.contract.events.TemplateCreated((err, result) => {
          if (err) {
            return console.error(err);
          }
          this.fetchTemplates();
        });

        this.state.contract.events.RequestGenerated(
          { filter: { verifier: this.state.user } },
          (err, result) => {
            if (err) {
              return console.error(err);
            }
            store.addNotification({
              title: 'Verification',
              message: 'Verification request generated successfully',
              type: 'success', // 'default', 'success', 'info', 'warning'
              container: 'top-right', // where to position the notifications
              animationIn: ['animate__animated', 'animate__fadeInDown'], // animate.css classes that's applied
              animationOut: ['animate__animated', 'animate__fadeOutDown'], // animate.css classes that's applied
              dismiss: {
                duration: 3000,
                showIcon: true,
                pauseOnHover: true,
              },
            });
          }
        );
      }
    );
  };

  fetchTemplates = async () => {
    let templates = [];
    let fields = [];
    let docIssuer = '';
    let docName = '';
    await this.state.contract.methods
      .getTemplates()
      .call()
      .then(({ 0: issuer, 1: name, 2: data }) => {
        for (let index = 0; index < issuer.length; index++) {
          let ele = [issuer[index], name[index], data[index]];
          templates.push(ele);
        }

        fields = JSON.parse(data[0]);
        docIssuer = issuer[0];
        docName = name[0];
        this.setState({
          templates,
          fields,
          docIssuer,
          docName,
        });
      });
  };

  clearInputs = () => {
    this.setState({ ownerAddress: '', request: [] });
  };

  handleDocNameChange(event) {
    let docIssuer, docName, fields;
    let template = this.state.templates.filter(
      (template) => template[1] === event.target.value
    );

    docIssuer = template[0][0];
    docName = template[0][1];
    fields = JSON.parse(template[0][2]);
    this.setState({ fields, docIssuer, docName, request: [] });
  }

  handleOwnerChange(event) {
    let ownerAddress = event.target.value;
    this.setState({ ownerAddress });
  }

  handlePropChange(event, index) {
    let request = [...this.state.request];
    let label = this.state.fields[index].label;
    if (event.target.checked) {
      request.push({ label });
    } else {
      for (let i = 0; i < request.length; i++) {
        if (request[i].label === label) {
          request.splice(i, 1);
        }
      }
    }
    this.setState({ request });
  }

  handleValueChange(event, index) {
    let label = this.state.fields[index].label;
    let expValue = event.target.value;
    let request = [...this.state.request];
    for (let i = 0; i < request.length; i++) {
      if (request[i].label === label) {
        request[i] = { label, expValue };
        this.setState({ request });
        break;
      }
    }
  }

  requestVerification = async () => {
    if (this.state.ownerAddress === '') {
      store.addNotification({
        title: 'Invalid owner address',
        message: 'Owner address cannot be empty',
        type: 'danger', // 'default', 'success', 'info', 'warning'
        container: 'top-right', // where to position the notifications
        animationIn: ['animate__animated', 'animate__fadeInDown'], // animate.css classes that's applied
        animationOut: ['animate__animated', 'animate__fadeOutDown'], // animate.css classes that's applied
        dismiss: {
          duration: 3000,
          showIcon: true,
          pauseOnHover: true,
        },
      });
    } else if (this.state.request.length === 0) {
      store.addNotification({
        title: 'Invalid request',
        message: 'Please select atleast one field to request verification',
        type: 'danger', // 'default', 'success', 'info', 'warning'
        container: 'top-right', // where to position the notifications
        animationIn: ['animate__animated', 'animate__fadeInDown'], // animate.css classes that's applied
        animationOut: ['animate__animated', 'animate__fadeOutDown'], // animate.css classes that's applied
        dismiss: {
          duration: 3000,
          showIcon: true,
          pauseOnHover: true,
        },
      });
    } else {
      try {
        await this.state.contract.methods
          .getEncryptionPublicKey(this.state.ownerAddress)
          .call()
          .then((encryptionPublicKey) => {
            const encryptedDataOwner = bufferToHex(
              Buffer.from(
                JSON.stringify(
                  encrypt(
                    encryptionPublicKey,
                    { data: JSON.stringify(this.state.request) },
                    'x25519-xsalsa20-poly1305'
                  )
                ),
                'utf8'
              )
            );

            this.state.contract.methods
              .getEncryptionPublicKey(this.state.user)
              .call()
              .then((encryptionPublicKey) => {
                const encryptedDataVerifier = bufferToHex(
                  Buffer.from(
                    JSON.stringify(
                      encrypt(
                        encryptionPublicKey,
                        { data: JSON.stringify(this.state.request) },
                        'x25519-xsalsa20-poly1305'
                      )
                    ),
                    'utf8'
                  )
                );
                this.state.contract.methods
                  .requestVerification(
                    this.state.ownerAddress,
                    this.state.docName,
                    encryptedDataOwner,
                    encryptedDataVerifier
                  )
                  .send({ from: this.state.user }, (err, txnHash) => {
                    if (err) {
                      store.addNotification({
                        title: 'Transaction failed',
                        message: 'Sign the transaction to request verification',
                        type: 'danger', // 'default', 'success', 'info', 'warning'
                        container: 'top-right', // where to position the notifications
                        animationIn: [
                          'animate__animated',
                          'animate__fadeInDown',
                        ], // animate.css classes that's applied
                        animationOut: [
                          'animate__animated',
                          'animate__fadeOutDown',
                        ], // animate.css classes that's applied
                        dismiss: {
                          duration: 3000,
                          showIcon: true,
                          pauseOnHover: true,
                        },
                      });
                    } else {
                      this.clearInputs();
                    }
                  });
              });
          });
      } catch (error) {
        store.addNotification({
          title: 'Invalid owner address',
          message: 'Please check and correct owner address',
          type: 'danger', // 'default', 'success', 'info', 'warning'
          container: 'top-right', // where to position the notifications
          animationIn: ['animate__animated', 'animate__fadeInDown'], // animate.css classes that's applied
          animationOut: ['animate__animated', 'animate__fadeOutDown'], // animate.css classes that's applied
          dismiss: {
            duration: 3000,
            showIcon: true,
            pauseOnHover: true,
          },
        });
      }
    }
  };

  render() {
    return (
      <div>
        <Navbar user={this.state.user} history={this.props.history} />
        <ReactNotification className='font-Poppins' />
        <div className='mt-10 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 font-Poppins'>
          <div className='mt-10 sm:mt-0'>
            <div className='mt-5 md:mt-0 md:col-span-2'>
              <div className='shadow overflow-hidden sm:rounded-md'>
                <div className='px-4 py-5 bg-white sm:p-6'>
                  <div className='grid grid-cols-9 gap-6'>
                    <div className='col-span-9 sm:col-span-3'>
                      <label
                        htmlFor='ownerAddress'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Document owner address
                        <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='text'
                        name='ownerAddress'
                        id='ownerAddress'
                        autoComplete='off'
                        required
                        onChange={this.handleOwnerChange}
                        value={this.state.ownerAddress}
                        className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                      />
                    </div>

                    <div className='col-span-9 sm:col-span-3'>
                      <label
                        htmlFor='docName'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Document name
                      </label>
                      <select
                        id='docName'
                        name='docName'
                        autoComplete='off'
                        onChange={this.handleDocNameChange}
                        value={this.state.docName}
                        className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                      >
                        {this.state.templates.map((ele, i) => (
                          <option key={i}>{ele[1]}</option>
                        ))}
                      </select>
                    </div>

                    <div className='col-span-9 sm:col-span-3'>
                      <label
                        htmlFor='issuerAddress'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Issued by
                      </label>
                      <input
                        type='text'
                        name='issuerAddress'
                        id='issuerAddress'
                        autoComplete='off'
                        disabled
                        value={this.state.docIssuer}
                        className='mt-1 cursor-not-allowed disabled:opacity-60 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                      />
                    </div>

                    <div className='col-span-9'>
                      {this.state.fields.map((field, i) => (
                        <Field
                          key={i}
                          index={i}
                          label={field.label}
                          docName={this.state.docName}
                          handlePropChange={this.handlePropChange}
                          handleValueChange={this.handleValueChange}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className='px-4 py-3 bg-gray-100 text-right sm:px-6'>
                  <button
                    onClick={this.requestVerification}
                    className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  >
                    Request verification
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
