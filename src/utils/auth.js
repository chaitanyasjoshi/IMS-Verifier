import IdentityManagerContract from '../abis/IdentityManager.json';
import getWeb3 from './getWeb3';

class auth {
  constructor() {
    this.contract = null;
    this.user = null;
    this.init();
  }

  init = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = IdentityManagerContract.networks[networkId];
      const instance = new web3.eth.Contract(
        IdentityManagerContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state
      this.setContract(instance);
      this.setUser(accounts[0]);

      window.ethereum.on(
        'accountsChanged',
        async function (accounts) {
          auth.logout(() => {
            this.props.history.push('/');
          });
        }.bind(this)
      );
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  login = async (username) => {
    await this.contract.methods
      .login('Verifier', username)
      .call({ from: this.user })
      .then((success) => {
        if (success) {
          localStorage.setItem('authenticated', true);
        } else {
          localStorage.setItem('authenticated', false);
        }
      });
  };

  register = async (encryptionPublicKey, username) => {
    await this.contract.methods
      .register(encryptionPublicKey, 'Verifier', username)
      .send({ from: this.user });
  };

  logout(callback) {
    localStorage.setItem('authenticated', false);
    callback();
  }

  isAuthenticated() {
    return localStorage.getItem('authenticated') === 'true';
  }

  setContract(contract) {
    this.contract = contract;
  }

  setUser(user) {
    this.user = user;
  }

  getContract() {
    return this.contract;
  }

  getUser() {
    return this.user;
  }
}

export default new auth();
