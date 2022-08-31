export const idlFactory = ({ IDL }) => {
    const Market = IDL.Record({
      'token' : IDL.Text,
      'collateral' : IDL.Nat,
      'canister' : IDL.Text,
    });
    const AddError = IDL.Variant({
      'AlreadyExists' : IDL.Text,
      'NotSupported' : IDL.Text,
      'Other' : IDL.Text,
    });
    const AddResult = IDL.Variant({ 'ok' : IDL.Vec(Market), 'err' : AddError });
    const EnterError = IDL.Record({
      'kind' : IDL.Variant({
        'NotFound' : IDL.Null,
        'AlreadyIn' : IDL.Null,
        'Other' : IDL.Null,
        'InsufficientFunds' : IDL.Null,
      }),
      'message' : IDL.Text,
    });
    const EnterExitResult = IDL.Variant({
      'ok' : IDL.Vec(Market),
      'err' : EnterError,
    });
    const LiqSuccess = IDL.Record({
      'fiat' : IDL.Variant({
        'SingleMarket' : IDL.Int,
        'MultipleMarkets' : IDL.Vec(IDL.Int),
      }),
      'liquidity' : IDL.Int,
      'caller_fiat' : IDL.Opt(IDL.Int),
    });
    const LiqError = IDL.Variant({
      'NotJoined' : IDL.Text,
      'NotSupported' : IDL.Text,
      'Other' : IDL.Text,
    });
    const LiquidityResult = IDL.Variant({ 'ok' : LiqSuccess, 'err' : LiqError });
    const BorrowableResult = IDL.Variant({ 'ok' : IDL.Int, 'err' : LiqError });
    const StatsResponse = IDL.Record({
      'totalBorr' : IDL.Int,
      'totalLent' : IDL.Int,
      'netApy' : IDL.Int,
    });
    const LendingBorrow = IDL.Record({
      'lenbal' : IDL.Int,
      'borrowbal' : IDL.Int,
      'lentokens' : IDL.Vec(IDL.Text),
    });
    const LenBorrowErr = IDL.Variant({
      'NotAuthorized' : IDL.Text,
      'CriticalErr' : IDL.Text,
    });
    const LenBorrowResult = IDL.Variant({
      'ok' : IDL.Opt(LendingBorrow),
      'err' : LenBorrowErr,
    });
    const Rates = IDL.Record({ 'borrow' : IDL.Nat, 'supply' : IDL.Nat });
    const RateErr = IDL.Variant({ 'NotAuthorized' : IDL.Text });
    const RateResult = IDL.Variant({ 'ok' : IDL.Opt(Rates), 'err' : RateErr });
    const Finrisk = IDL.Service({
      'addMarket' : IDL.Func([IDL.Text, IDL.Nat, IDL.Text], [AddResult], []),
      'enterMarket' : IDL.Func([IDL.Text], [EnterExitResult], []),
      'enterMarketFrom' : IDL.Func(
          [IDL.Principal, IDL.Text],
          [EnterExitResult],
          [],
        ),
      'exitMarket' : IDL.Func([IDL.Text], [EnterExitResult], []),
      'exitMarketFrom' : IDL.Func(
          [IDL.Principal, IDL.Text],
          [EnterExitResult],
          [],
        ),
      'getAccountLiquidity' : IDL.Func([], [LiquidityResult], []),
      'getAccountLiquidityFrom' : IDL.Func(
          [IDL.Principal],
          [LiquidityResult],
          [],
        ),
      'getBorrowLimit' : IDL.Func([IDL.Principal], [LiquidityResult], []),
      'getBorrowable' : IDL.Func([IDL.Text], [BorrowableResult], []),
      'getJoinedMarkets' : IDL.Func([], [IDL.Opt(IDL.Vec(Market))], ['query']),
      'getJoinedMarketsFrom' : IDL.Func(
          [IDL.Principal],
          [IDL.Opt(IDL.Vec(Market))],
          ['query'],
        ),
      'getOpenMarkets' : IDL.Func([], [IDL.Vec(Market)], ['query']),
      'getPrices' : IDL.Func(
          [],
          [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float64))],
          ['query'],
        ),
      'getStats' : IDL.Func([IDL.Principal], [StatsResponse], ['query']),
      'getfiat' : IDL.Func([], [IDL.Float64], ['query']),
      'getnatfiat' : IDL.Func([IDL.Text], [IDL.Int], ['query']),
      'isJoined' : IDL.Func([IDL.Principal, IDL.Text], [IDL.Bool], ['query']),
      'minusLendingBorrow' : IDL.Func(
          [IDL.Principal, LendingBorrow],
          [LenBorrowResult],
          [],
        ),
      'updateLendingBorrow' : IDL.Func(
          [IDL.Principal, LendingBorrow],
          [LenBorrowResult],
          [],
        ),
      'updateRate' : IDL.Func([IDL.Text, Rates], [RateResult], []),
      'update_fiat' : IDL.Func(
          [IDL.Text, IDL.Float64, IDL.Text],
          [IDL.Float64],
          [],
        ),
    });
    return Finrisk;
  };
  export const init = ({ IDL }) => { return [IDL.Principal]; };
  