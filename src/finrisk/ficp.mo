module {
  public type AccountIdentifier = {
    #principal : Principal;
    #blob : [Nat8];
    #text : Text;
  };
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
  public type CreateInvoiceErr = {
    kind : {
      #InvalidDetails;
      #InvalidAmount;
      #InvalidDestination;
      #MaxInvoicesReached;
      #BadSize;
      #InvalidToken;
      #Other;
    };
    message : ?Text;
  };
  public type CreateInvoiceResult = {
    #ok : CreateInvoiceSuccess;
    #err : CreateInvoiceErr;
  };
  public type CreateInvoiceSuccess = { invoice : Invoice };
  public type Details = { meta : [Nat8]; description : Text };
  public type Invoice = {
    id : Nat;
    permissions : ?Permissions;
    creator : Principal;
    destination : AccountIdentifier;
    token : TokenVerbose;
    paid : Bool;
    verifiedAtTime : ?Int;
    amountPaid : Nat;
    expiration : Int;
    details : ?Details;
    amount : Nat;
  };
  public type Metadata = {
    fee : Nat;
    decimals : Nat8;
    owner : Principal;
    logo : Text;
    name : Text;
    totalSupply : Nat;
    symbol : Text;
  };
  public type Permissions = { canGet : [Principal]; canVerify : [Principal] };
  public type Time = Int;
  public type TokenInfo = {
    holderNumber : Nat;
    deployTime : Time;
    metadata : Metadata;
    historySize : Nat;
    cycles : Nat;
    feeTo : Principal;
  };
  public type TokenVerbose = {
    decimals : Int;
    meta : ?{ Issuer : Text };
    symbol : Text;
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
  public type VerifyInvoiceErr = {
    kind : {
      #InvalidAccount;
      #TransferError;
      #NotFound;
      #NotAuthorized;
      #InvalidToken;
      #InvalidInvoiceId;
      #Other;
      #NotYetPaid;
      #Expired;
    };
    message : ?Text;
  };
  public type VerifyInvoiceResult = {
    #ok : VerifyInvoiceSuccess;
    #err : VerifyInvoiceErr;
  };
  public type VerifyInvoiceSuccess = {
    #Paid : { invoice : Invoice };
    #AlreadyVerified : { invoice : Invoice };
  };
  public type Self = actor {
    allowance : shared query (Principal, Principal) -> async Nat;
    approve : shared (Principal, Nat) -> async TxReceipt;
    balanceOf : shared query Principal -> async Nat;
    borrow : shared Nat -> async BorrowResult;
    burn : shared (Principal, Nat) -> async TxReceipt;
    calcExchangeRate : shared () -> async Nat;
    check_license_status : shared query () -> async Bool;
    create_invoice : shared (Nat, Text) -> async CreateInvoiceResult;
    decimals : shared query () -> async Nat;
    exchangeRateCurrent : shared query () -> async Nat;
    getAllowanceSize : shared query () -> async Nat;
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
    get_invoice : shared query Nat -> async ?Invoice;
    getdecimals : shared query () -> async Nat8;
    getfiat : shared query () -> async Float;
    historySize : shared query () -> async Nat;
    liquidate : shared (Principal, Principal) -> async ();
    logo : shared query () -> async Text;
    mint : shared (Principal, Nat) -> async TxReceipt;
    name : shared query () -> async Text;
    reedem : shared Nat -> async BorrowResult;
    repay : shared (Principal, Nat) -> async BorrowResult;
    reset_license : shared () -> async ();
    setFee : shared Nat -> ();
    setFeeTo : shared Principal -> ();
    setLogo : shared Text -> ();
    setName : shared Text -> ();
    setOwner : shared Principal -> ();
    symbol : shared query () -> async Text;
    totalBorrows : shared query () -> async Nat;
    totalReserves : shared () -> async Nat;
    totalSupply : shared query () -> async Nat;
    transfer : shared (Principal, Nat) -> async TxReceipt;
    transferFrom : shared (Principal, Principal, Nat) -> async TxReceipt;
    update_fiat : shared Float -> async Float;
    verify_invoice : shared Nat -> async VerifyInvoiceResult;
  }
}