import React, { Component } from 'react';

export default class Dashboard extends Component {
  state = {
    tempContract: {},
    templates: [],
    fields: [],
    docIssuer: '',
    ownerAddress: '',
    docName: '',
    request: [],
  };

  componentDidMount() {
    this.fetchTemplates();
  }

  fetchTemplates = async () => {
    const tempContract = await this.props.contract.methods
      .getTemplates()
      .call();
    let templates = [];
    let fields = [];
    let docIssuer = '';

    if (tempContract) {
      const { 0: issuer, 1: name, 2: data } = tempContract;
      for (let index = 0; index < issuer.length; index++) {
        let ele = [issuer[index], name[index], data[index]];
        templates.push(ele);
      }

      fields = JSON.parse(data[0]);
      docIssuer = issuer[0];
    }
    this.setState({ tempContract, templates, fields, docIssuer });
  };

  handleDocNameChange(event) {
    const { 0: issuer, 1: name, 2: data } = this.state.tempContract;
    let fields = [];
    let docIssuer = '';
    let docName = event.target.value;

    for (let index = 0; index < name.length; index++) {
      if (name[index] === event.target.value) {
        fields = JSON.parse(data[index]);
        docIssuer = issuer[index];
        break;
      }
    }

    this.setState({ fields, docIssuer, docName });
  }

  handleOwnerChange(event) {
    let ownerAddress = event.target.value;
    this.setState(ownerAddress);
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

  render() {
    return (
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
                      <div key={i} className='mt-2 flex items-center'>
                        <div className='flex items-center h-5'>
                          <input
                            id={`${field.label.replace(/\s/g, '')}`}
                            name={`${field.label.replace(/\s/g, '')}`}
                            type='checkbox'
                            onClick={(event) => {
                              this.handlePropChange(event, i);
                            }}
                            className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded'
                          />
                        </div>
                        <div className='ml-3 text-sm'>
                          <label
                            htmlFor={`${field.label.replace(/\s/g, '')}`}
                            className='font-medium text-gray-700'
                          >
                            {field.label}
                          </label>
                        </div>
                        <input
                          type={`${
                            field.label.toLowerCase().includes('date')
                              ? 'date'
                              : 'text'
                          }`}
                          name='verifyVal'
                          id='verifyVal'
                          autoComplete='off'
                          placeholder='Add value to be verified'
                          onChange={(event) => {
                            this.handleValueChange(event, i);
                          }}
                          className='mt-1 ml-3 focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border-gray-300 rounded-md'
                        />
                      </div>
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
    );
  }
}
