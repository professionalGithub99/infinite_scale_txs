import type { Principal } from '@dfinity/principal';
export interface Tx {
  'principle' : string,
  'action' : string,
  'asset' : string,
  'interest' : string,
  'date' : string,
  'fees' : string,
  'timestamp' : string,
  'price' : string,
  'amount' : string,
}
export interface _SERVICE {
  'addTx' : (
      arg_0: Principal,
      arg_1: string,
      arg_2: string,
      arg_3: string,
      arg_4: string,
      arg_5: string,
      arg_6: string,
      arg_7: string,
      arg_8: string,
      arg_9: string,
    ) => Promise<undefined>,
  'getTx' : (arg_0: Principal) => Promise<[] | [Array<Tx>]>,
}
