import type { UnspentOutput } from "./OrdTransaction.js";
import type { Psbt } from "belcoinjs-lib";

export interface CreateSendTidecoin {
  utxos: UnspentOutput[];
  toAddress: any;
  toAmount: number;
  signTransaction: (psbt: Psbt) => Promise<void>;
  network: any;
  changeAddress: string;
  receiverToPayFee?: boolean;
  feeRate?: number;
  pubkey: string;
  enableRBF?: boolean;
}
