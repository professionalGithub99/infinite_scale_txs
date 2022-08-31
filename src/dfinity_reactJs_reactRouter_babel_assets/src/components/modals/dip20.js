export const idlFactory = ({ IDL }) => {
    const TxReceipt = IDL.Variant({
      'Ok' : IDL.Nat,
      'Err' : IDL.Variant({
        'InsufficientAllowance' : IDL.Null,
        'InsufficientBalance' : IDL.Null,
        'ErrorOperationStyle' : IDL.Null,
        'Unauthorized' : IDL.Null,
        'LedgerTrap' : IDL.Null,
        'ErrorTo' : IDL.Null,
        'Other' : IDL.Text,
        'BlockUsed' : IDL.Null,
        'AmountTooSmall' : IDL.Null,
      }),
    });
    const BorrowSuccess = IDL.Nat;
    const BorrowError = IDL.Variant({
      'InvalidDelta' : IDL.Tuple(IDL.Int, IDL.Text),
      'NotAuthorized' : IDL.Tuple(IDL.Principal, IDL.Text),
      'NoLiquidity' : IDL.Tuple(IDL.Int, IDL.Text),
      'Other' : IDL.Text,
      'TransferFailed' : IDL.Text,
      'InsufficientFunds' : IDL.Text,
    });
    const BorrowResult = IDL.Variant({
      'ok' : BorrowSuccess,
      'err' : BorrowError,
    });
    const Time = IDL.Int;
    const Block = IDL.Record({
      'interest' : IDL.Nat,
      'hasInterestAccrued' : IDL.Bool,
      'number' : IDL.Nat,
      'timestamp' : Time,
    });
    const Metadata = IDL.Record({
      'fee' : IDL.Nat,
      'decimals' : IDL.Nat8,
      'owner' : IDL.Principal,
      'logo' : IDL.Text,
      'name' : IDL.Text,
      'totalSupply' : IDL.Nat,
      'symbol' : IDL.Text,
    });
    const TokenInfo = IDL.Record({
      'holderNumber' : IDL.Nat,
      'deployTime' : Time,
      'metadata' : Metadata,
      'historySize' : IDL.Nat,
      'cycles' : IDL.Nat,
      'feeTo' : IDL.Principal,
    });
    const Token = IDL.Service({
      'allowance' : IDL.Func(
          [IDL.Principal, IDL.Principal],
          [IDL.Nat],
          ['query'],
        ),
      'approve' : IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
      'balanceOf' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
      'borrow' : IDL.Func([IDL.Nat], [BorrowResult], []),
      'burn' : IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
      'calcExchangeRate' : IDL.Func([], [IDL.Nat], []),
      'decimals' : IDL.Func([], [IDL.Nat], ['query']),
      'exchangeRateCurrent' : IDL.Func([], [IDL.Nat], ['query']),
      'getAllowanceSize' : IDL.Func([], [IDL.Nat], ['query']),
      'getApprovedBal' : IDL.Func([IDL.Principal], [IDL.Opt(IDL.Nat)], ['query']),
      'getBalancesSize' : IDL.Func([], [IDL.Nat], ['query']),
      'getBorrowBal' : IDL.Func([IDL.Principal], [IDL.Opt(IDL.Nat)], ['query']),
      'getCash' : IDL.Func([], [IDL.Nat], []),
      'getHolders' : IDL.Func(
          [IDL.Nat, IDL.Nat],
          [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
          ['query'],
        ),
      'getLBBalance' : IDL.Func([IDL.Principal], [IDL.Vec(IDL.Nat)], ['query']),
      'getLastBlock' : IDL.Func([], [Block], ['query']),
      'getLendingBal' : IDL.Func([IDL.Principal], [IDL.Opt(IDL.Nat)], ['query']),
      'getMetadata' : IDL.Func([], [Metadata], ['query']),
      'getNotInteractedCount' : IDL.Func([], [IDL.Nat], ['query']),
      'getSupplyBorrowRate' : IDL.Func([], [IDL.Nat, IDL.Nat, IDL.Nat], []),
      'getTokenFee' : IDL.Func([], [IDL.Nat], ['query']),
      'getTokenInfo' : IDL.Func([], [TokenInfo], ['query']),
      'getUserApprovals' : IDL.Func(
          [IDL.Principal],
          [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
          ['query'],
        ),
      'getdecimals' : IDL.Func([], [IDL.Nat8], ['query']),
      'getfiat' : IDL.Func([], [IDL.Float64], ['query']),
      'historySize' : IDL.Func([], [IDL.Nat], ['query']),
      'liquidate' : IDL.Func([IDL.Principal, IDL.Principal], [], []),
      'logo' : IDL.Func([], [IDL.Text], ['query']),
      'mint' : IDL.Func([IDL.Nat], [TxReceipt], []),
      'name' : IDL.Func([], [IDL.Text], ['query']),
      'reedem' : IDL.Func([IDL.Nat], [BorrowResult], []),
      'repay' : IDL.Func([IDL.Principal, IDL.Nat], [BorrowResult], []),
      'setFee' : IDL.Func([IDL.Nat], [], ['oneway']),
      'setFeeTo' : IDL.Func([IDL.Principal], [], ['oneway']),
      'setLogo' : IDL.Func([IDL.Text], [], ['oneway']),
      'setName' : IDL.Func([IDL.Text], [], ['oneway']),
      'setOwner' : IDL.Func([IDL.Principal], [], ['oneway']),
      'symbol' : IDL.Func([], [IDL.Text], ['query']),
      'topUp' : IDL.Func([], [IDL.Nat], []),
      'totalBorrows' : IDL.Func([], [IDL.Nat], ['query']),
      'totalReserves' : IDL.Func([], [IDL.Nat], []),
      'totalSupply' : IDL.Func([], [IDL.Nat], ['query']),
      'transfer' : IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
      'transferFrom' : IDL.Func(
          [IDL.Principal, IDL.Principal, IDL.Nat],
          [TxReceipt],
          [],
        ),
      'update_fiat' : IDL.Func([IDL.Float64], [IDL.Float64], []),
    });
    return Token;
  };
  export const init = ({ IDL }) => {
    return [
      IDL.Text,
      IDL.Text,
      IDL.Text,
      IDL.Nat8,
      IDL.Nat,
      IDL.Principal,
      IDL.Nat,
    ];
  };
  