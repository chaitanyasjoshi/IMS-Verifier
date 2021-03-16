import React, { Component } from 'react';

import auth from '../utils/auth';

import Request from './Request';
import Navbar from './Navbar';

export default class Table extends Component {
  state = {
    user: null,
    contract: null,
    requests: [],
  };

  componentDidMount = () => {
    if (!auth.getContract()) {
      auth.init().then(() => {
        this.setState(
          { user: auth.getUser(), contract: auth.getContract() },
          () => {
            this.fetchRequests();

            this.state.contract.events.RequestStatusUpdated(
              { verifier: this.state.user },
              (err, result) => {
                if (err) {
                  return console.error(err);
                }
                this.fetchRequests();
              }
            );

            this.state.contract.events.RequestGenerated(
              { verifier: this.state.user },
              (err, result) => {
                if (err) {
                  return console.error(err);
                }
                this.fetchRequests();
              }
            );
          }
        );
      });
    } else {
      this.setState(
        { user: auth.getUser(), contract: auth.getContract() },
        () => {
          this.fetchRequests();

          this.state.contract.events.RequestStatusUpdated(
            { verifier: this.state.user },
            (err, result) => {
              if (err) {
                return console.error(err);
              }
              this.fetchRequests();
            }
          );

          this.state.contract.events.RequestGenerated(
            { verifier: this.state.user },
            (err, result) => {
              if (err) {
                return console.error(err);
              }
              this.fetchRequests();
            }
          );
        }
      );
    }
  };

  fetchRequests = async () => {
    // Get requests from contract.
    await this.state.contract.methods
      .getVerifierRequests()
      .call({ from: this.state.user })
      .then((requests) => {
        const req = [];
        const { 0: owner, 1: docName, 2: properties, 3: status } = requests;

        for (let index = 0; index < owner.length; index++) {
          let ele = [
            owner[index],
            docName[index],
            properties[index],
            status[index],
          ];
          req.push(ele);
        }
        this.setState({ requests: req });
      });
  };

  render() {
    return (
      <div>
        <Navbar user={this.state.user} history={this.props.history} />
        <div className='flex flex-col mt-10 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 font-Poppins'>
          <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
            <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
              <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {this.state.requests.map((ele, i) => {
                      return (
                        <Request
                          key={i}
                          user={this.state.user}
                          owner={ele[0]}
                          docName={ele[1]}
                          properties={ele[2]}
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
      </div>
    );
  }
}
