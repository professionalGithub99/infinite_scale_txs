/**
 * Module     : types.mo
 * Copyright  : 2021 DFinance Team
 * License    : Apache 2.0 with LLVM Exception
 * Maintainer : DFinance Team <hello@dfinance.ai>
 * Stability  : Experimental
 */

import Time "mo:base/Time";
import TxId "./TxId";
import P "mo:base/Prelude";

module {
    public type Token = Principal;
    /// Update call operations
    public type Operation = {
        #mint;
        #burn;
        #transfer;
        #transferFrom;
        #approve;
    };
    public type TransactionStatus = {
        #succeeded;
        #inprogress;
        #failed;
    };
    /// Update call operation record fields
    public type TxRecord = {
        caller: ?Principal;
        op: Operation;
        index: Nat;
        from: Principal;
        to: Principal;
        amount: Nat;
        fee: Nat;
        timestamp: Time.Time;
        status: TransactionStatus;
    };

    public func unwrap<T>(x : ?T) : T =
        switch x {
            case null { P.unreachable() };
            case (?x_) { x_ };
        };
	    public type OrderId = Nat32;
  
    public type Order = {
        id: OrderId;
        owner: Principal;
        from: Token;
        fromAmount: Nat;
        to: Token;
        toAmount: Nat;
    };
    

 
    // Dip20 token interface
    public type TxReceipt = {
        #Ok: Nat;
        #Err: {
            #InsufficientAllowance;
            #InsufficientBalance;
            #ErrorOperationStyle;
            #Unauthorized;
            #LedgerTrap;
            #ErrorTo;
            #Other;
            #BlockUsed;
            #AmountTooSmall;
        };
    };

    public type Metadata = {
        logo : Text; // base64 encoded logo or logo url
        name : Text; // token name
        symbol : Text; // token symbol
        decimals : Nat8; // token decimal
        totalSupply : Nat; // token total supply
        owner : Principal; // token owner
        fee : Nat; // fee for update calls
    };


    public type DIPInterface = actor {
        transfer : (Principal,Nat) ->  async TxReceipt;
        transferFrom : (Principal,Principal,Nat) -> async TxReceipt;
        allowance : (owner: Principal, spender: Principal) -> async Nat;
        getMetadata: () -> async Metadata;
    };

    // return types
    public type OrderPlacementErr = {
        #InvalidOrder;
        #OrderBookFull;
    };
    public type OrderPlacementReceipt = {
        #Ok: ?Order;
        #Err: OrderPlacementErr;
    };
    public type CancelOrderErr = {
        #NotExistingOrder;
        #NotAllowed;
    };
    public type CancelOrderReceipt = {
        #Ok: OrderId;
        #Err: CancelOrderErr;
    };
    public type WithdrawErr = {
        #BalanceLow;
        #TransferFailure;
    };
    public type WithdrawReceipt = {
        #Ok: Nat;
        #Err: WithdrawErr;  
    };
    public type DepositErr = {
        #BalanceLow;
        #TransferFailure;
	#BlockUsed;
	#ZeroDepositOrNoBlockFound;
    };
    public type DepositReceipt = {
        #Ok: Nat;
        #Err: DepositErr;
    };
    public type Balance = {
        owner: Principal;
        token: Token;
        amount: Nat;
    };
  public type addTxReceipt = {
     #ArchiveFull:(Principal,TxId.TxId);
     #TxExists:(Principal,TxId.TxId);
     #TxAdded:(Principal,TxId.TxId);
     #TxError:Text;
  };

};    
