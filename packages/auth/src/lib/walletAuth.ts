import datamodels from '@usher.so/datamodels';
import { Wallet } from '@usher.so/shared';

import { Auth } from './auth.js';
import { AuthOptions } from './options.js';

const { WalletAliases } = datamodels;

type MagicWallet = {
  arweave?: {
    address: string;
    data: string;
  };
};

const CERAMIC_MAGIC_WALLETS_KEY = 'magicWallets';

/**
 * A class representing a single authentication (wallet connection)
 */
export class WalletAuth extends Auth {
  protected _wallet: Wallet;

  constructor(wallet: Wallet, options?: AuthOptions) {
    super(WalletAliases, options);
    this._wallet = wallet;
  }

  public get wallet() {
    return this._wallet;
  }

  public get address() {
    return this._wallet.address;
  }

  public get id() {
    const wallet = this._wallet;
    const id = [wallet.chain, wallet.address].join(':');
    return id;
  }

  public async connect(sig: Uint8Array) {
    await this.authenticate(this.id, sig);
  }

  public getMagicWallets() {
    return this._store.get(CERAMIC_MAGIC_WALLETS_KEY);
  }

  public addMagicWallet(wallet: MagicWallet) {
    return this._store.merge(CERAMIC_MAGIC_WALLETS_KEY, wallet);
  }
}
