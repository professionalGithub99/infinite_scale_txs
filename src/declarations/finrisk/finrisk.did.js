export const idlFactory = ({ IDL }) => {
  const AccountIdentifier__1 = IDL.Vec(IDL.Nat8);
  const DecodeError = IDL.Variant({ 'msg' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Vec(IDL.Nat8), 'err' : DecodeError });
  const Token = IDL.Principal;
  const TxReceipt = IDL.Variant({
    'Ok' : IDL.Nat,
    'Err' : IDL.Variant({
      'InsufficientAllowance' : IDL.Null,
      'InsufficientBalance' : IDL.Null,
      'ErrorOperationStyle' : IDL.Null,
      'Unauthorized' : IDL.Null,
      'LedgerTrap' : IDL.Null,
      'ErrorTo' : IDL.Null,
      'Other' : IDL.Null,
      'BlockUsed' : IDL.Null,
      'AmountTooSmall' : IDL.Null,
    }),
  });
  const DepositErr = IDL.Variant({
    'TransferFailure' : IDL.Null,
    'ZeroDepositOrNoBlockFound' : IDL.Null,
    'BalanceLow' : IDL.Null,
    'BlockUsed' : IDL.Null,
  });
  const DepositReceipt = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : DepositErr });
  const BlockIndex = IDL.Nat64;
  const Memo = IDL.Nat64;
  const AccountIdentifier = IDL.Vec(IDL.Nat8);
  const Tokens = IDL.Record({ 'e8s' : IDL.Nat64 });
  const Operation = IDL.Variant({
    'Burn' : IDL.Record({ 'from' : AccountIdentifier, 'amount' : Tokens }),
    'Mint' : IDL.Record({ 'to' : AccountIdentifier, 'amount' : Tokens }),
    'Transfer' : IDL.Record({
      'to' : AccountIdentifier,
      'fee' : Tokens,
      'from' : AccountIdentifier,
      'amount' : Tokens,
    }),
  });
  const TimeStamp = IDL.Record({ 'timestamp_nanos' : IDL.Nat64 });
  const Transaction = IDL.Record({
    'memo' : Memo,
    'operation' : IDL.Opt(Operation),
    'created_at_time' : TimeStamp,
  });
  const Block = IDL.Record({
    'transaction' : Transaction,
    'timestamp' : TimeStamp,
    'parent_hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const GetBlocksArgs = IDL.Record({
    'start' : BlockIndex,
    'length' : IDL.Nat64,
  });
  const BlockRange = IDL.Record({ 'blocks' : IDL.Vec(Block) });
  const QueryArchiveError = IDL.Variant({
    'BadFirstBlockIndex' : IDL.Record({
      'requested_index' : BlockIndex,
      'first_valid_index' : BlockIndex,
    }),
    'Other' : IDL.Record({
      'error_message' : IDL.Text,
      'error_code' : IDL.Nat64,
    }),
  });
  const QueryArchiveResult = IDL.Variant({
    'Ok' : BlockRange,
    'Err' : QueryArchiveError,
  });
  const QueryArchiveFn = IDL.Func(
      [GetBlocksArgs],
      [QueryArchiveResult],
      ['query'],
    );
  const QueryBlocksResponse = IDL.Record({
    'certificate' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'blocks' : IDL.Vec(Block),
    'chain_length' : IDL.Nat64,
    'first_block_index' : BlockIndex,
    'archived_blocks' : IDL.Vec(
      IDL.Record({
        'callback' : QueryArchiveFn,
        'start' : BlockIndex,
        'length' : IDL.Nat64,
      })
    ),
  });
  const WithdrawErr = IDL.Variant({
    'TransferFailure' : IDL.Null,
    'BalanceLow' : IDL.Null,
  });
  const WithdrawReceipt = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : WithdrawErr });
  const Finrisk = IDL.Service({
    'account_test' : IDL.Func([IDL.Text], [AccountIdentifier__1, Result], []),
    'borrow' : IDL.Func([Token, IDL.Nat], [TxReceipt], []),
    'debug_accrue_interest' : IDL.Func(
        [Token, IDL.Nat, IDL.Nat, IDL.Nat, IDL.Nat, IDL.Nat, IDL.Nat, IDL.Nat],
        [IDL.Text],
        [],
      ),
    'debug_get_account_liquidity' : IDL.Func([IDL.Principal], [IDL.Text], []),
    'debug_get_exchange_rate' : IDL.Func([Token], [IDL.Text], ['query']),
    'deposit_dip' : IDL.Func([Token], [DepositReceipt], []),
    'deposit_icp' : IDL.Func(
        [BlockIndex, IDL.Variant({ 'Mint' : IDL.Null, 'Repay' : IDL.Null })],
        [DepositReceipt],
        [],
      ),
    'find_tx_id' : IDL.Func(
        [
          BlockIndex,
          IDL.Principal,
          IDL.Variant({ 'Mint' : IDL.Null, 'Repay' : IDL.Null }),
        ],
        [IDL.Bool],
        [],
      ),
    'generate_archive_canister' : IDL.Func([], [IDL.Principal], []),
    'get_market_balance' : IDL.Func(
        [Token, IDL.Principal],
        [IDL.Nat],
        ['query'],
      ),
    'get_market_borrow_balance' : IDL.Func(
        [Token, IDL.Principal],
        [IDL.Nat],
        ['query'],
      ),
    'get_off_ramp_balances' : IDL.Func([], [IDL.Text], []),
    'get_or_create_market' : IDL.Func(
        [
          Token,
          IDL.Nat,
          IDL.Nat,
          IDL.Nat,
          IDL.Nat,
          IDL.Nat,
          IDL.Nat,
          IDL.Nat,
          IDL.Nat,
        ],
        [IDL.Bool],
        [],
      ),
    'get_this_account_id_as_text' : IDL.Func([], [IDL.Text, IDL.Text], []),
    'icp_sent_from_principal' : IDL.Func(
        [
          BlockIndex,
          IDL.Principal,
          IDL.Variant({ 'Mint' : IDL.Null, 'Repay' : IDL.Null }),
        ],
        [IDL.Nat64],
        [],
      ),
    'liquidate' : IDL.Func(
        [Token, Token, IDL.Principal, IDL.Nat],
        [TxReceipt],
        [],
      ),
    'mint' : IDL.Func([Token, IDL.Nat], [TxReceipt], []),
    'redeem' : IDL.Func([Token, IDL.Nat], [TxReceipt], []),
    'repay' : IDL.Func([Token, IDL.Nat], [TxReceipt], []),
    'view_archive_principals' : IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    'view_blocks' : IDL.Func([BlockIndex], [QueryBlocksResponse], []),
    'withdraw_dip' : IDL.Func(
        [Token, IDL.Nat, IDL.Principal],
        [WithdrawReceipt],
        [],
      ),
    'withdraw_icp' : IDL.Func([IDL.Nat, IDL.Text], [WithdrawReceipt], []),
  });
  return Finrisk;
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
