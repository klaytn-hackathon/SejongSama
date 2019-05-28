import { Injectable } from "@angular/core";

declare global {
  interface Window { 
    cav: any; 
    agContract: any;
  }
}

window.cav = window.cav || {};
window.agContract = window.agContract || {};

@Injectable()
export class AccountService {
  cav: any;
  auth: {
    accessType: 'keystore',
    keystore: '',
    password: ''
  };

  constructor() {
    this.cav = window.cav;    
  }

  start() {
    const walletFromSession = this.getSessionWalletInstance();
    if (walletFromSession) {
      try {
        this.cav.klay.accounts.wallet.add(JSON.parse(walletFromSession));     
      } catch (e) {
        sessionStorage.removeItem('walletInstance');
      }
    }
  }

  checkValidKeystore(keystore: any) {
    const parsedKeystore = JSON.parse(keystore);
    const isValidKeystore = parsedKeystore.version &&
      parsedKeystore.id &&
      parsedKeystore.address &&
      parsedKeystore.crypto;

    return isValidKeystore;
  }

  handleLogin() {
    if (this.auth.accessType === 'keystore') {
      try {
        const privateKey = this.cav.klay.accounts.decrypt(this.auth.keystore, this.auth.password).privateKey;
        this.integrateWallet(privateKey);
      } catch (e) {
        return false;
      }
    }
    return true;
  }

  handleLogout() {
    this.removeWallet();
  }

  getWallet() {
    if (this.cav.klay.accounts.wallet.length) {
      return this.cav.klay.accounts.wallet[0];
    }
  }

  getBalance(address: any) {
    return this.cav.klay.getBalance(address)
      .then((value) => {
        return value;
      });
  }

  setAuthKeystore(keystore: any) {
    this.auth = {
      accessType: 'keystore',
      keystore: keystore,
      password: ''
    };
  }
  
  setAuthPassword(password: any) {
    this.auth = {
      accessType: 'keystore',
      keystore: this.auth.keystore,
      password: password
    };
  }

  integrateWallet(privateKey) {
    const walletInstance = this.cav.klay.accounts.privateKeyToAccount(privateKey);
    this.cav.klay.accounts.wallet.add(walletInstance)
    sessionStorage.setItem('walletInstance', JSON.stringify(walletInstance));    
  }

  reset() {
    this.auth = {
      accessType: 'keystore',
      keystore: '',
      password: ''
    };
  }

  removeWallet() {
    this.cav.klay.accounts.wallet.clear();
    sessionStorage.removeItem('walletInstance');
    this.reset();
  }

  getSessionWalletInstance() {
    return sessionStorage.getItem('walletInstance');
  }

  isAuthenticated() {
    return !!this.getSessionWalletInstance();
  }
}