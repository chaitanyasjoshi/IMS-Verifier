import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'animate.css';

import auth from '../utils/auth';

import Request from './Request';
import Navbar from './Navbar';
import { ReactComponent as NoRequests } from '../assets/no_requests.svg';

export default class Table extends Component {
  state = {
    user: null,
    contract: null,
    requests: [],
  };

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
      });
    });

    this.setState(
      { user: auth.getUser(), contract: auth.getContract() },
      () => {
        this.fetchRequests();

        this.state.contract.events.RequestStatusUpdated(
          { filter: { verifier: this.state.user }, fromBlock: 'latest' },
          (err, result) => {
            if (err) {
              return console.error(err);
            }
            this.fetchRequests();
          }
        );

        this.state.contract.events.RequestGenerated(
          { filter: { verifier: this.state.user }, fromBlock: 'latest' },
          (err, result) => {
            if (err) {
              return console.error(err);
            }
            this.fetchRequests();
          }
        );
      }
    );
  };

  fetchRequests = async () => {
    // Get requests from contract.
    await this.state.contract.methods
      .getVerifierRequests()
      .call({ from: this.state.user })
      .then(
        ({ 0: owner, 1: ownerUname, 2: docName, 3: properties, 4: status }) => {
          const req = [];

          for (let index = 0; index < owner.length; index++) {
            let ele = [
              owner[index],
              ownerUname[index],
              docName[index],
              properties[index],
              status[index],
            ];
            req.push(ele);
          }

          this.setState({ requests: req });
        }
      );
  };

  render() {
    return (
      <div>
        <Navbar user={this.state.user} history={this.props.history} />
        <div className='flex flex-col mt-10 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 font-Poppins'>
          <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
            <div className='py-2 min-w-full sm:px-6 lg:px-8'>
              {this.state.requests.length === 0 ? (
                <div className='flex flex-col items-center justify-center'>
                  <NoRequests className='h-96 w-96' />
                  <p className='p-5 text-4xl font-medium'>No requests found!</p>
                  <p className='text-xl'>
                    Create verification requests to see them here
                  </p>
                  <Link
                    to='/dashboard'
                    className='p-10 text-xl text-indigo-600 cursor-pointer'
                  >
                    Request verification
                  </Link>
                </div>
              ) : (
                <div className='shadow border-b border-gray-200 sm:rounded-lg'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {this.state.requests.map((ele, i) => {
                        return (
                          <Request
                            key={i}
                            user={this.state.user}
                            owner={ele[0]}
                            ownerUname={ele[1]}
                            docName={ele[2]}
                            properties={ele[3]}
                            status={ele[4]}
                          />
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
