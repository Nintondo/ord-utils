import type { UnspentOutput } from "./OrdTransaction.js";
import type { Network, Psbt } from "belcoinjs-lib";

interface CreateSendBase {
  utxos: UnspentOutput[];
  toAddress: string;
  enableRBF?: boolean;
  signTransaction: (psbt: Psbt) => Promise<void>;
  changeAddress: string;
  feeRate?: number;
  network: Network;
  pubkey: string;
  calculateFee?: (tx: string, feeRate: number) => Promise<number>;
}

export interface CreateSendTidecoin extends CreateSendBase {
  toAmount: number;
  receiverToPayFee?: boolean;
}

export interface CreateSendOrd extends CreateSendBase {
  outputValue: number;
}
