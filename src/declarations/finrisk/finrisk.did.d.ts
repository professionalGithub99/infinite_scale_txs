import type { Principal } from '@dfinity/principal';
export type AccountIdentifier = Array<number>;
export type AccountIdentifier__1 = Array<number>;
export interface Block {
  'transaction' : Transaction,
  'timestamp' : TimeStamp,
  'parent_hash' : [] | [Array<number>],
}
export type BlockIndex = bigint;
export interface BlockRange { 'blocks' : Array<Block> }
export type DecodeError = { 'msg' : string };
export type DepositErr = { 'TransferFailure' : null } |
  { 'ZeroDepositOrNoBlockFound' : null } |
  { 'BalanceLow' : null } |
  { 'BlockUsed' : null };
export type DepositReceipt = { 'Ok' : bigint } |
  { 'Err' : DepositErr };
export interface Finrisk {
  'account_test' : (arg_0: string) => Promise<[AccountIdentifier__1, Result]>,
  'borrow' : (arg_0: Token, arg_1: bigint) => Promise<TxReceipt>,
  'debug_accrue_interest' : (
      arg_0: Token,
      arg_1: bigint,
      arg_2: bigint,
      arg_3: bigint,
      arg_4: bigint,
      arg_5: bigint,
      arg_6: bigint,
      arg_7: bigint,
    ) => Promise<string>,
  'debug_get_account_liquidity' : (arg_0: Principal) => Promise<string>,
  'debug_get_exchange_rate' : (arg_0: Token) => Promise<string>,
  'deposit_dip' : (arg_0: Token) => Promise<DepositReceipt>,
  'deposit_icp' : (
      arg_0: BlockIndex,
      arg_1: { 'Mint' : null } |
        { 'Repay' : null },
    ) => Promise<DepositReceipt>,
  'find_tx_id' : (
      arg_0: BlockIndex,
      arg_1: Principal,
      arg_2: { 'Mint' : null } |
        { 'Repay' : null },
    ) => Promise<boolean>,
  'generate_archive_canister' : () => Promise<Principal>,
  'get_market_balance' : (arg_0: Token, arg_1: Principal) => Promise<bigint>,
  'get_market_borrow_balance' : (arg_0: Token, arg_1: Principal) => Promise<
      bigint
    >,
  'get_off_ramp_balances' : () => Promise<string>,
  'get_or_create_market' : (
      arg_0: Token,
      arg_1: bigint,
      arg_2: bigint,
      arg_3: bigint,
      arg_4: bigint,
      arg_5: bigint,
      arg_6: bigint,
      arg_7: bigint,
      arg_8: bigint,
    ) => Promise<boolean>,
  'get_this_account_id_as_text' : () => Promise<[string, string]>,
  'icp_sent_from_principal' : (
      arg_0: BlockIndex,
      arg_1: Principal,
      arg_2: { 'Mint' : null } |
        { 'Repay' : null },
    ) => Promise<bigint>,
  'liquidate' : (
      arg_0: Token,
      arg_1: Token,
      arg_2: Principal,
      arg_3: bigint,
    ) => Promise<TxReceipt>,
  'mint' : (arg_0: Token, arg_1: bigint) => Promise<TxReceipt>,
  'redeem' : (arg_0: Token, arg_1: bigint) => Promise<TxReceipt>,
  'repay' : (arg_0: Token, arg_1: bigint) => Promise<TxReceipt>,
  'view_archive_principals' : () => Promise<Array<Principal>>,
  'view_blocks' : (arg_0: BlockIndex) => Promise<QueryBlocksResponse>,
  'withdraw_dip' : (arg_0: Token, arg_1: bigint, arg_2: Principal) => Promise<
      WithdrawReceipt
    >,
  'withdraw_icp' : (arg_0: bigint, arg_1: string) => Promise<WithdrawReceipt>,
}
export interface GetBlocksArgs { 'start' : BlockIndex, 'length' : bigint }
export type Memo = bigint;
export type Operation = {
    'Burn' : { 'from' : AccountIdentifier, 'amount' : Tokens }
  } |
  { 'Mint' : { 'to' : AccountIdentifier, 'amount' : Tokens } } |
  {
    'Transfer' : {
      'to' : AccountIdentifier,
      'fee' : Tokens,
      'from' : AccountIdentifier,
      'amount' : Tokens,
    }
  };
export type QueryArchiveError = {
    'BadFirstBlockIndex' : {
      'requested_index' : BlockIndex,
      'first_valid_index' : BlockIndex,
    }
  } |
  { 'Other' : { 'error_message' : string, 'error_code' : bigint } };
export type QueryArchiveFn = (arg_0: GetBlocksArgs) => Promise<
    QueryArchiveResult
  >;
export type QueryArchiveResult = { 'Ok' : BlockRange } |
  { 'Err' : QueryArchiveError };
export interface QueryBlocksResponse {
  'certificate' : [] | [Array<number>],
  'blocks' : Array<Block>,
  'chain_length' : bigint,
  'first_block_index' : BlockIndex,
  'archived_blocks' : Array<
    { 'callback' : QueryArchiveFn, 'start' : BlockIndex, 'length' : bigint }
  >,
}
export type Result = { 'ok' : Array<number> } |
  { 'err' : DecodeError };
export interface TimeStamp { 'timestamp_nanos' : bigint }
export type Token = Principal;
export interface Tokens { 'e8s' : bigint }
export interface Transaction {
  'memo' : Memo,
  'operation' : [] | [Operation],
  'created_at_time' : TimeStamp,
}
export type TxReceipt = { 'Ok' : bigint } |
  {
    'Err' : { 'InsufficientAllowance' : null } |
      { 'InsufficientBalance' : null } |
      { 'ErrorOperationStyle' : null } |
      { 'Unauthorized' : null } |
      { 'LedgerTrap' : null } |
      { 'ErrorTo' : null } |
      { 'Other' : null } |
      { 'BlockUsed' : null } |
      { 'AmountTooSmall' : null }
  };
export type WithdrawErr = { 'TransferFailure' : null } |
  { 'BalanceLow' : null };
export type WithdrawReceipt = { 'Ok' : bigint } |
  { 'Err' : WithdrawErr };
export interface _SERVICE extends Finrisk {}
