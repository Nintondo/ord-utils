import type { UnspentOutput } from "./OrdTransaction.js";
import type { Network, Psbt } from "belcoinjs-lib";

export interface CreateSendTidecoin {
  utxos: UnspentOutput[];
  toAddress: string;
  toAmount: number;
  signTransaction: (psbt: Psbt) => Promise<void>;
  network: Network;
  changeAddress: string;
  receiverToPayFee?: boolean;
  feeRate?: number;
  pubkey: string;
  enableRBF?: boolean;
  calculateFee?: (tx: string, feeRate: number) => Promise<number>;
}
