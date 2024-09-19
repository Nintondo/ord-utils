import { address, Network, payments, Psbt, Transaction } from "belcoinjs-lib";
import BN from "bn.js";
import { AddressType, UnspentOutputBase } from "./OrdTransaction.js";
import { AddInputProps } from "./types.js";

export function satoshisToAmount(val: number) {
  const num = new BN(val);
  return num.div(new BN(100000000)).toString(10);
}

export function amountToSaothis(val: any) {
  const num = new BN(val);
  return num.mul(new BN(100000000)).toNumber();
}

export const calculateFee = async (
  psbt: Psbt,
  feeRate: number,
  address: string,
  signPsbtHex: (psbtHex: string) => Promise<string>
): Promise<number> => {
  psbt.addOutput({ address, value: 0 });
  psbt = Psbt.fromHex(await signPsbtHex(psbt.toHex()));
  psbt.finalizeAllInputs();
  const txSize = psbt.extractTransaction(true).toBuffer().length;
  const fee = Math.ceil(txSize * feeRate);
  return fee;
};

export const addPsbtInput = ({
  network,
  psbt,
  publicKey,
  utxo,
  sighashType,
}: AddInputProps) => {
  if (utxo.rawHex) {
  }
  const tx = Transaction.fromHex(utxo.rawHex);
  const outpoint = tx.outs[utxo.outputIndex];
  const addressStr = address.fromOutputScript(outpoint.script, network);
  const addressType = getAddressType(addressStr, network);

  let input: any = {
    hash: utxo.txId,
    index: utxo.outputIndex,
    nonWitnessUtxo: Buffer.from(utxo.rawHex, "hex"),
  };

  const witnessUtxo = getWintessUtxo(
    {
      ...utxo,
      satoshis: outpoint.value,
    },
    addressType,
    publicKey,
    network
  );

  if (typeof witnessUtxo !== "undefined") {
    input.witnessUtxo = witnessUtxo;
  }

  if (typeof sighashType !== "undefined") {
    input.sighashType = sighashType;
  }

  psbt.addInput(input);
};

export function getAddressType(
  addressStr: string,
  network: Network
): AddressType.P2WPKH | AddressType.P2PKH | AddressType.P2TR | undefined {
  try {
    const version = address.fromBase58Check(addressStr).version;
    if (version === network.pubKeyHash) return 0;
    if (version === network.scriptHash) return undefined;
  } catch {
    try {
      const version = address.fromBech32(addressStr).version;
      if (version === 0x00) return 1;
      if (version === 0x01) return 2;
    } catch {}
  }

  return undefined;
}

export const getWintessUtxo = (
  utxo: UnspentOutputBase,
  addressType: number | undefined,
  publicKeyStr: string,
  network: Network
) => {
  const pubkey = Buffer.from(publicKeyStr, "hex");

  switch (addressType) {
    case AddressType.P2TR:
      return {
        script: payments.p2tr({
          internalPubkey: toXOnly(pubkey),
          network,
        }).output!,
        value: utxo.satoshis,
      };
    case AddressType.P2WPKH:
      return {
        script: payments.p2wpkh({
          pubkey,
          network,
        }).output!,
        value: utxo.satoshis,
      };
    default:
      return undefined;
  }
};

const toXOnly = (pubKey: Buffer) =>
  pubKey.length === 32 ? pubKey : pubKey.slice(1, 33);
