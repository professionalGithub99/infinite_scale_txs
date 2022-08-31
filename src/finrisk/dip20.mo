module {
  public type Block = {
    interest : Nat;
    hasInterestAccrued : Bool;
    number : Nat;
    timestamp : Time;
  };
  public type BorrowError = {
    #InvalidDelta : (Int, Text);
    #NotAuthorized : (Principal, Text);
    #NoLiquidity : (Int, Text);
    #Other : Text;
    #TransferFailed : Text;
    #InsufficientFunds : Text;
  };
  public type BorrowResult = { #ok : BorrowSuccess; #err : BorrowError };
  public type BorrowSuccess = Nat;
  public type Metadata = {
    fee : Nat;
    decimals : Nat8;
    owner : Principal;
    logo : Text;
    name : Text;
    totalSupply : Nat;
    symbol : Text;
  };
  public type Time = Int;
  public type TokenInfo = {
    holderNumber : Nat;
    deployTime : Time;
    metadata : Metadata;
    historySize : Nat;
    cycles : Nat;
    feeTo : Principal;
  };
  public type TxReceipt = {
    #Ok : Nat;
    #Err : {
      #InsufficientAllowance;
      #InsufficientBalance;
      #ErrorOperationStyle;
      #Unauthorized;
      #LedgerTrap;
      #ErrorTo;
      #Other : Text;
      #BlockUsed;
      #AmountTooSmall;
    };
  };
  public type Self = actor {
    allowance : shared query (Principal, Principal) -> async Nat;
    approve : shared (Principal, Nat) -> async TxReceipt;
    balanceOf : shared query Principal -> async Nat;
    borrow : shared Nat -> async BorrowResult;
    burn : shared (Principal, Nat) -> async TxReceipt;
    calcExchangeRate : shared () -> async Nat;
    decimals : shared query () -> async Nat;
    exchangeRateCurrent : shared query () -> async Nat;
    getAllowanceSize : shared query () -> async Nat;
    getApprovedBal : shared query Principal -> async ?Nat;
    getBalancesSize : shared query () -> async Nat;
    getBorrowBal : shared query Principal -> async ?Nat;
    getCash : shared () -> async Nat;
    getHolders : shared query (Nat, Nat) -> async [(Principal, Nat)];
    getLBBalance : shared query Principal -> async [Nat];
    getLastBlock : shared query () -> async Block;
    getLendingBal : shared query Principal -> async ?Nat;
    getMetadata : shared query () -> async Metadata;
    getNotInteractedCount : shared query () -> async Nat;
    getSupplyBorrowRate : shared () -> async (Nat, Nat, Nat);
    getTokenFee : shared query () -> async Nat;
    getTokenInfo : shared query () -> async TokenInfo;
    getUserApprovals : shared query Principal -> async [(Principal, Nat)];
    getdecimals : shared query () -> async Nat8;
    getfiat : shared query () -> async Float;
    historySize : shared query () -> async Nat;
    liquidate : shared (Principal, Principal) -> async ();
    logo : shared query () -> async Text;
    mint : shared (Principal, Nat) -> async TxReceipt;
    name : shared query () -> async Text;
    reedem : shared Nat -> async BorrowResult;
    repay : shared (Principal, Nat) -> async BorrowResult;
    setFee : shared Nat -> ();
    setFeeTo : shared Principal -> ();
    setLogo : shared Text -> ();
    setName : shared Text -> ();
    setOwner : shared Principal -> ();
    symbol : shared query () -> async Text;
    topUp : shared Nat -> async Nat;
    totalBorrows : shared query () -> async Nat;
    totalReserves : shared () -> async Nat;
    totalSupply : shared query () -> async Nat;
    transfer : shared (Principal, Nat) -> async TxReceipt;
    transferFrom : shared (Principal, Principal, Nat) -> async TxReceipt;
    update_fiat : shared Float -> async Float;
  }
}