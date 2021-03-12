import React, { Component } from 'react';

import Request from './Request';

export default class Table extends Component {
  state = {
    requests: null,
  };

  componentDidMount = () => {
    this.fetchRequests();

    this.props.contract.events.RequestStatusUpdated(
      { verifier: this.props.user },
      (err, result) => {
        if (err) {
          return console.error(err);
        }
        this.fetchRequests();
      }
    );

    this.props.contract.events.RequestGenerated(
      { verifier: this.props.user },
      (err, result) => {
        if (err) {
          return console.error(err);
        }
        this.fetchRequests();
      }
    );
  };

  createRequests() {
    const req = [];
    if (this.state.requests != null) {
      const {
        0: owner,
        1: docName,
        2: properties,
        3: status,
      } = this.state.requests;

      for (let index = 0; index < owner.length; index++) {
        let ele = [
          owner[index],
          docName[index],
          properties[index],
          status[index],
        ];
        req.push(ele);
      }
    }
    return req;
  }

  fetchRequests = async () => {
    // Get requests from contract.
    await this.props.contract.methods
      .getVerifierRequests()
      .call({ from: this.props.user })
      .then((requests) => {
        this.setState({ requests });
      });
  };

  render() {
    return (
      <div className='flex flex-col mt-10 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 font-Poppins'>
        <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
            <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-200'>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {this.createRequests().map((ele, i) => {
                    return (
                      <Request
                        key={i}
                        owner={ele[0]}
                        docName={ele[1]}
                        properties={JSON.parse(ele[2])}
                        status={ele[3]}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
