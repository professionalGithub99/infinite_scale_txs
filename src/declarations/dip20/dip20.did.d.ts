import type { Principal } from '@dfinity/principal';
export interface Block {
  'interest' : bigint,
  'hasInterestAccrued' : boolean,
  'number' : bigint,
  'timestamp' : Time,
}
export type BorrowError = { 'InvalidDelta' : [bigint, string] } |
  { 'NotAuthorized' : [Principal, string] } |
  { 'NoLiquidity' : [bigint, string] } |
  { 'Other' : string } |
  { 'TransferFailed' : string } |
  { 'InsufficientFunds' : string };
export type BorrowResult = { 'ok' : BorrowSuccess } |
  { 'err' : BorrowError };
export type BorrowSuccess = bigint;
export interface Metadata {
  'fee' : bigint,
  'decimals' : number,
  'owner' : Principal,
  'logo' : string,
  'name' : string,
  'totalSupply' : bigint,
  'symbol' : string,
}
export type Time = bigint;
export interface Token {
  'allowance' : (arg_0: Principal, arg_1: Principal) => Promise<bigint>,
  'approve' : (arg_0: Principal, arg_1: bigint) => Promise<TxReceipt>,
  'balanceOf' : (arg_0: Principal) => Promise<bigint>,
  'borrow' : (arg_0: bigint) => Promise<BorrowResult>,
  'burn' : (arg_0: Principal, arg_1: bigint) => Promise<TxReceipt>,
  'calcExchangeRate' : () => Promise<bigint>,
  'decimals' : () => Promise<bigint>,
  'exchangeRateCurrent' : () => Promise<bigint>,
  'getAllowanceSize' : () => Promise<bigint>,
  'getApprovedBal' : (arg_0: Principal) => Promise<[] | [bigint]>,
  'getBalancesSize' : () => Promise<bigint>,
  'getBorrowBal' : (arg_0: Principal) => Promise<[] | [bigint]>,
  'getCash' : () => Promise<bigint>,
  'getHolders' : (arg_0: bigint, arg_1: bigint) => Promise<
      Array<[Principal, bigint]>
    >,
  'getLBBalance' : (arg_0: Principal) => Promise<Array<bigint>>,
  'getLastBlock' : () => Promise<Block>,
  'getLendingBal' : (arg_0: Principal) => Promise<[] | [bigint]>,
  'getMetadata' : () => Promise<Metadata>,
  'getNotInteractedCount' : () => Promise<bigint>,
  'getSupplyBorrowRate' : () => Promise<[bigint, bigint, bigint]>,
  'getTokenFee' : () => Promise<bigint>,
  'getTokenInfo' : () => Promise<TokenInfo>,
  'getUserApprovals' : (arg_0: Principal) => Promise<
      Array<[Principal, bigint]>
    >,
  'getdecimals' : () => Promise<number>,
  'getfiat' : () => Promise<number>,
  'historySize' : () => Promise<bigint>,
  'liquidate' : (arg_0: Principal, arg_1: Principal) => Promise<undefined>,
  'logo' : () => Promise<string>,
  'mint' : (arg_0: bigint) => Promise<TxReceipt>,
  'name' : () => Promise<string>,
  'reedem' : (arg_0: bigint) => Promise<BorrowResult>,
  'repay' : (arg_0: Principal, arg_1: bigint) => Promise<BorrowResult>,
  'setFee' : (arg_0: bigint) => Promise<undefined>,
  'setFeeTo' : (arg_0: Principal) => Promise<undefined>,
  'setLogo' : (arg_0: string) => Promise<undefined>,
  'setName' : (arg_0: string) => Promise<undefined>,
  'setOwner' : (arg_0: Principal) => Promise<undefined>,
  'symbol' : () => Promise<string>,
  'topUp' : () => Promise<bigint>,
  'totalBorrows' : () => Promise<bigint>,
  'totalReserves' : () => Promise<bigint>,
  'totalSupply' : () => Promise<bigint>,
  'transfer' : (arg_0: Principal, arg_1: bigint) => Promise<TxReceipt>,
  'transferFrom' : (
      arg_0: Principal,
      arg_1: Principal,
      arg_2: bigint,
    ) => Promise<TxReceipt>,
  'update_fiat' : (arg_0: number) => Promise<number>,
}
export interface TokenInfo {
  'holderNumber' : bigint,
  'deployTime' : Time,
  'metadata' : Metadata,
  'historySize' : bigint,
  'cycles' : bigint,
  'feeTo' : Principal,
}
export type TxReceipt = { 'Ok' : bigint } |
  {
    'Err' : { 'InsufficientAllowance' : null } |
      { 'InsufficientBalance' : null } |
      { 'ErrorOperationStyle' : null } |
      { 'Unauthorized' : null } |
      { 'LedgerTrap' : null } |
      { 'ErrorTo' : null } |
      { 'Other' : string } |
      { 'BlockUsed' : null } |
      { 'AmountTooSmall' : null }
  };
export interface _SERVICE extends Token {}
