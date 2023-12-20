import BN from "bn.js";

export function satoshisToAmount(val: number) {
  const num = new BN(val);
  return num.div(new BN(100000000)).toString(10);
}

export function amountToSaothis(val: any) {
  const num = new BN(val);
  return num.mul(new BN(100000000)).toNumber();
}