import A          "./Account";
import Hex        "./Hex";
import ICP        "./ICPLedger";
import T          "./Types";
import U          "./Utils";
import Ledger     "ledger";
import Array      "mo:base/Array";
import Blob       "mo:base/Blob";
import Hash       "mo:base/Hash";
import HashMap    "mo:base/HashMap";
import Iter       "mo:base/Iter";
import Nat        "mo:base/Nat";
import Nat64      "mo:base/Nat64";
import Option     "mo:base/Option";
import Principal  "mo:base/Principal";
import Text       "mo:base/Text";
import Time       "mo:base/Time";
import Result     "mo:base/Result";

actor class Invoice()= Invoice{
// #region Types
  type Details = T.Details;
  type Token = T.Token;
  type TokenVerbose = T.TokenVerbose;
  type AccountIdentifier = T.AccountIdentifier;
  type Invoice = T.Invoice;
// #endregion
  let LedgerCanister : Ledger.Self = actor "ryjl3-tyaaa-aaaaa-aaaba-cai";

  let errInvalidToken =
    #err({
       message = ?"This token is not yet supported. Currently, this canister supports ICP.";
       kind = #InvalidToken;
    });

/**
* Application State
*/

// #region State
  stable var entries : [(Nat, Invoice)] = [];
  stable var invoiceCounter : Nat = 0;
  let invoices : HashMap.HashMap<Nat, Invoice> = HashMap.fromIter(Iter.fromArray(entries), entries.size(), Nat.equal, Hash.hash);
  entries := [];
  let MAX_INVOICES = 30_000;
// #endregion

/**
* Application Interface
*/

// #region Create Invoice
public query func getInvoicecounter() : async Nat {
  return invoiceCounter;
};

public query func getInvoice() : async ?Invoice {
  return invoices.get(2);
};

  public shared ({caller}) func create_invoice (args : T.CreateInvoiceArgs) : async T.CreateInvoiceResult {
    let id : Nat = invoiceCounter;
    // increment counter
    invoiceCounter += 1;
    let inputsValid = areInputsValid(args);
    if(not inputsValid) {
      return #err({
        message = ?"Bad size: one or more of your inputs exceeds the allowed size.";
        kind = #BadSize;
      });
    };

    if(id > MAX_INVOICES){
      return #err({
        message = ?"The maximum number of invoices has been reached.";
        kind = #MaxInvoicesReached;
      });
    };

    let destinationResult : T.GetDestinationAccountIdentifierResult = getDestinationAccountIdentifier({
      token = args.token;
      invoiceId = id;
      caller
    });

    switch(destinationResult){
      case (#err result) {
        #err({
          message = ?"Invalid destination account identifier";
          kind = #InvalidDestination;
        });
      };
      case (#ok result) {
        let destination : AccountIdentifier = result.accountIdentifier;
        let token = getTokenVerbose(args.token);
        let invoice : Invoice = {
          id;
          creator = args.creator;
          details = args.details;
          permissions = args.permissions;
          amount = args.amount;
          amountPaid = 0;
          token;
          verifiedAtTime = null;
          paid = false;
          // 1 week in nanoseconds
          expiration = Time.now() + (1000 * 60 * 60 * 24 * 7 * 1_000_000);
          destination;
        };

        invoices.put(id, invoice);

        #ok({invoice});
      };
    };
  };

  func getTokenVerbose(token : Token) : TokenVerbose {
    switch(token.symbol){
      case ("ICP") {
        {
          symbol = "ICP";
          decimals = 8;
          meta = ?{
            Issuer = "e8s";
          }
        };

      };
      case (_) {
        {
          symbol = "";
          decimals = 1;
          meta = ?{
            Issuer = "";
          }
        }
      };
    };
  };

  func areInputsValid(args : T.CreateInvoiceArgs) : Bool {
    let token = getTokenVerbose(args.token);

    var isValid = true;

    switch (args.details){
      case null {};
      case (? details){
        if (details.meta.size() > 32_000) {
          isValid := false;
        };
        if (details.description.size() > 256) {
          isValid := false;
        };
      };
    };

    switch (args.permissions){
      case null {};
      case (? permissions){
        if (permissions.canGet.size() > 256 or permissions.canVerify.size() > 256) {
          isValid := false;
        };
      };
    };

    return isValid;
  };

// #region Get Destination Account Identifier
  func getDestinationAccountIdentifier (args : T.GetDestinationAccountIdentifierArgs) : T.GetDestinationAccountIdentifierResult {
    let token = args.token;
    switch (token.symbol) {
      case "ICP" {
        let canisterId = Principal.fromActor(Invoice);

        let account = U.getICPAccountIdentifier({
          principal = canisterId;
          subaccount = Blob.fromArray(U.generateInvoiceSubaccount({
            caller = args.caller;
            id = args.invoiceId;
          }));
        });
        let hexEncoded = Hex.encode(account);
        let result : AccountIdentifier = #text(hexEncoded);
        #ok({accountIdentifier = result});
      };
      case _ {
        errInvalidToken;
      };
    };
  };
// #endregion
// #endregion

// #region Get Invoice
  public shared query ({caller}) func get_invoice (args : T.GetInvoiceArgs) : async T.GetInvoiceResult {
    let invoice = invoices.get(args.id);
    switch invoice {
      case null {
        #err({
          message = ?"Invoice not found";
          kind = #NotFound;
        });
      };
      case (?i) {
        if (i.creator == caller) {
          return #ok({invoice = i});
        };
        // If additional permissions are provided
        switch (i.permissions) {
          case (null) {
            return #err({
              message = ?"You do not have permission to view this invoice";
              kind = #NotAuthorized;
            });
          };
          case (?permissions) {
            let hasPermission = Array.find<Principal>(
              permissions.canGet,
              func (x : Principal) : Bool {
                return x == caller;
              }
            );
            if (Option.isSome(hasPermission)) {
              return #ok({invoice = i});
            } else {
              return #err({
                message = ?"You do not have permission to view this invoice";
                kind = #NotAuthorized;
              });
            };
          };
        };
        #ok({invoice = i});
      };
    };
  };
// #endregion

// #region Get Balance
  public shared ({caller}) func get_balance (args : T.GetBalanceArgs) : async T.GetBalanceResult {
    let token = args.token;
    let canisterId = Principal.fromActor(Invoice);
    switch (token.symbol) {
      case "ICP" {
        let defaultAccount = Hex.encode(
            U.getDefaultAccount({
              canisterId;
              principal = caller;
            })
        );
        let balance = await ICP.balance({account = defaultAccount});
        switch(balance) {
          case (#err err) {
            #err({
              message = ?"Could not get balance";
              kind = #NotFound;
            });
          };
          case (#ok result){
            #ok({balance = result.balance});
          };
        };
      };
      case _ {
        errInvalidToken;
      };
    };
  };
// #endregion

// #region Verify Invoice
  public shared ({caller}) func verify_invoice (args : T.VerifyInvoiceArgs) : async T.VerifyInvoiceResult {
    let invoice = invoices.get(args.id);
    let canisterId = Principal.fromActor(Invoice);

    switch invoice {
      case null{
        #err({
          message = ?"Invoice not found";
          kind = #NotFound;
        });
      };
      case (?i) {
        // Return if already verified
        if (i.verifiedAtTime != null) {
          return #ok(#AlreadyVerified {
            invoice = i;
          });
        };
        if (i.creator != caller) {
          switch (i.permissions) {
            case null {
              return #err({
                message = ?"You do not have permission to verify this invoice";
                kind = #NotAuthorized;
              });
            };
            case (?permissions) {
              let hasPermission = Array.find<Principal>(
                permissions.canVerify,
                func (x : Principal) : Bool {
                  return x == caller;
                }
              );
              if (Option.isSome(hasPermission)) {
                // May proceed
              } else {
                // May proceed as well
                
/*                 return #err({
                  message = ?"You do not have permission to verify this invoice";
                  kind = #NotAuthorized;
                }); */
              };
            };
          };
        };

        switch (i.token.symbol) {
          case "ICP" {
            let result : T.VerifyInvoiceResult = await ICP.verifyInvoice({
              invoice = i;
              caller;
              canisterId;
            });
            switch result {
              case (#ok value) {
                switch (value) {
                  case (#AlreadyVerified _) { };
                  case (#Paid paidResult) {
                    let replaced = invoices.replace(i.id, paidResult.invoice);
                  };
                };
              };
              case (#err _) {};
            };
            result;
          };
          case _ {
            errInvalidToken;
          };
        };
      };
    };
  };
// #endregion

// #region Transfer

//danger zone,

  public shared ({caller}) func transfer (destination : Principal, amnt : Nat) : async T.TransferResult {
    assert(caller == Principal.fromText("demt4-4aaaa-aaaah-abkxa-cai"));
    let canis = Principal.fromActor(Invoice);

    let now = Nat64.fromIntWrap(Time.now());
    let subacc = A.defaultSubaccount();
    let transferResult = await ICP.transfer({
      memo = 0;
      fee = {
        e8s = 10000;
      };
      amount = {
        // Total amount, minus the fee
        e8s = Nat64.sub(Nat64.fromNat(amnt), 10000);
      };
      from_subaccount = ?Blob.toArray(subacc);

      to = A.accountIdentifier(destination, A.defaultSubaccount());
      created_at_time = null;
    });
    switch (transferResult) {
      case (#ok result) {
        #ok(result);
      };
      case (#err err) {
        switch (err.kind) {
          case (#BadFee _) {
            #err({
              message = err.message;
              kind = #BadFee;
            });
          };
          case (#InsufficientFunds _) {
            #err({
              message = err.message;
              kind = #InsufficientFunds;
            });
          };
          case _ {
            #err({
              message = err.message;
              kind = #Other;
            });
          }
        };
      };
    };
  };
// #endregion

// #region get_account_identifier
  /*
    * Get Caller Identifier
    * Allows a caller to the accountIdentifier for a given principal
    * for a specific token.
    */
  public query func get_account_identifier (args : T.GetAccountIdentifierArgs) : async T.GetAccountIdentifierResult {
    let token = args.token;
    let principal = args.principal;
    let canisterId = Principal.fromActor(Invoice);
    switch (token.symbol) {
      case "ICP" {
        let subaccount = U.getDefaultAccount({principal; canisterId;});
        let hexEncoded = Hex.encode(subaccount);
        let result : AccountIdentifier = #text(hexEncoded);
        #ok({accountIdentifier = result});
      };
      case _ {
        errInvalidToken;
      };
    };
  };

  func hexDecode(id : Principal) : [Nat8] {
    switch (Hex.decode(Principal.toText(id))) {
      case (#ok(acc)) {
        return acc;
      };
      case (#err(err)) {
          return [0];
      };
    };
  }; 

  public type Tokens = Ledger.Tokens;

  public type BlockIndex = Ledger.BlockIndex;

  public type TransferError = {
    message : ?Text;
    kind : {
      #BadFee : {
        expected_fee : Tokens;
      };
      #InsufficientFunds : {
        balance : Tokens;
      };
      #TxTooOld : {
        allowed_window_nanos : Nat64;
      };
      #TxCreatedInFuture;
      #TxDuplicate : {
        duplicate_of : BlockIndex;
      };
      #Other;
    }
  };

  public type TransferResult = Result.Result<T.TransferSuccess, TransferError>;

  type AccountBalanceArgs = Ledger.AccountBalanceArgs;
  //Blob.toArray(A.principalToSubaccount(id))
  public shared(msg) func toPool(amnt : Nat, id : Principal, invid : Nat) :  async TransferResult {
    let thisprinc = Principal.fromText("demt4-4aaaa-aaaah-abkxa-cai");
    assert(msg.caller == thisprinc);
    let thecanisterid = Principal.fromActor(Invoice);
    let subacc2 = U.generateInvoiceSubaccount({
        caller = thisprinc;
        id = invid;
    });
    let thisacc : [Nat8] = A.accountIdentifier(thecanisterid, Blob.fromArray(subacc2));
    let hexEncoded = Hex.encode(thisacc);
    var accountBal : AccountBalanceArgs = {
          account = thisacc;
      };
    let destinationResulttxt = U.accountIdentifierToText({
      accountIdentifier = #blob(thisacc);
      canisterId = ?thecanisterid;
    });
    let temp : Tokens = await LedgerCanister.account_balance(accountBal);
    let toAcc : [Nat8] = hexDecode(id);
    let subacc = A.defaultSubaccount();
    let transferargs : Ledger.TransferArgs = {
        to = A.accountIdentifier(thecanisterid, subacc);
        fee = {
          e8s = 10000;
        };
        memo = 0;
        from_subaccount = ?subacc2;
        created_at_time = null;
        amount = {
          // Total amount, minus the fee
          e8s = Nat64.sub(Nat64.fromNat(amnt), 10000);
        };
      };
    let transferResult = await LedgerCanister.transfer(transferargs);
      switch (transferResult) {
        case (#Ok index) {
          #ok({blockHeight = index});
        };
        case (#Err err) {
          switch err {
            case (#BadFee kind) {
              let expected_fee = kind.expected_fee;
              #err({
                message = ?("Bad Fee. Expected fee of " # Nat64.toText(expected_fee.e8s) # " but got " # Nat64.toText(transferargs.fee.e8s));
                kind = #BadFee({expected_fee});
              });
            };
            case (#InsufficientFunds kind) {
              let balance = kind.balance;
              #err({
                message = ?("Insufficient balance. Current balance is " # Nat64.toText(temp.e8s) # hexEncoded);
                kind = #InsufficientFunds({balance});
              })
            };
            case (#TxTooOld kind) {
              let allowed_window_nanos = kind.allowed_window_nanos;
              #err({
                message = ?("Error - Tx Too Old. Allowed window of " # Nat64.toText(allowed_window_nanos));
                kind = #TxTooOld({allowed_window_nanos});
              })
            };
            case (#TxCreatedInFuture) {
              #err({
                message = ?"Error - Tx Created In Future";
                kind = #TxCreatedInFuture;
              })
            };
            case (#TxDuplicate kind) {
              let duplicate_of = kind.duplicate_of;
              #err({
                message = ?("Error - Duplicate transaction. Duplicate of " # Nat64.toText(duplicate_of));
                kind = #TxDuplicate({duplicate_of});
              })
            };
          };
        };
      };
  };
  public shared(msg) func flush(amnt : Nat, id : Principal) :  async TransferResult {
    let thisprinc = Principal.fromText("demt4-4aaaa-aaaah-abkxa-cai");
    //assert(msg.caller == thisprinc);
    let thecanisterid = Principal.fromActor(Invoice);
    let subacc2 = U.generateInvoiceSubaccount({
        caller = thisprinc;
        id = 1;
    });
    let thisacc : [Nat8] = A.accountIdentifier(thecanisterid, Blob.fromArray(subacc2));
    let hexEncoded = Hex.encode(thisacc);
    var accountBal : AccountBalanceArgs = {
          account = thisacc;
      };
    let destinationResulttxt = U.accountIdentifierToText({
      accountIdentifier = #blob(thisacc);
      canisterId = ?thecanisterid;
    });
    let temp : Tokens = await LedgerCanister.account_balance(accountBal);
    let toAcc : [Nat8] = hexDecode(id);
    let subacc = A.defaultSubaccount();
    let transferargs : Ledger.TransferArgs = {
        to = A.accountIdentifier(id, subacc);
        fee = {
          e8s = 10000;
        };
        memo = 0;
        from_subaccount = ?Blob.toArray(subacc);
        created_at_time = null;
        amount = {
          // Total amount, minus the fee
          e8s = Nat64.sub(Nat64.fromNat(amnt), 10000);
        };
      };
    let transferResult = await LedgerCanister.transfer(transferargs);
      switch (transferResult) {
        case (#Ok index) {
          #ok({blockHeight = index});
        };
        case (#Err err) {
          switch err {
            case (#BadFee kind) {
              let expected_fee = kind.expected_fee;
              #err({
                message = ?("Bad Fee. Expected fee of " # Nat64.toText(expected_fee.e8s) # " but got " # Nat64.toText(transferargs.fee.e8s));
                kind = #BadFee({expected_fee});
              });
            };
            case (#InsufficientFunds kind) {
              let balance = kind.balance;
              #err({
                message = ?("Insufficient balance. Current balance is " # Nat64.toText(temp.e8s) # hexEncoded);
                kind = #InsufficientFunds({balance});
              })
            };
            case (#TxTooOld kind) {
              let allowed_window_nanos = kind.allowed_window_nanos;
              #err({
                message = ?("Error - Tx Too Old. Allowed window of " # Nat64.toText(allowed_window_nanos));
                kind = #TxTooOld({allowed_window_nanos});
              })
            };
            case (#TxCreatedInFuture) {
              #err({
                message = ?"Error - Tx Created In Future";
                kind = #TxCreatedInFuture;
              })
            };
            case (#TxDuplicate kind) {
              let duplicate_of = kind.duplicate_of;
              #err({
                message = ?("Error - Duplicate transaction. Duplicate of " # Nat64.toText(duplicate_of));
                kind = #TxDuplicate({duplicate_of});
              })
            };
          };
        };
      };
  };
    public shared(msg) func flush2(amnt : Nat, id : Principal, id2 : Nat) :  async TransferResult {
    let thisprinc = Principal.fromText("demt4-4aaaa-aaaah-abkxa-cai");
    //assert(msg.caller == thisprinc);
    let thecanisterid = Principal.fromActor(Invoice);
    let subacc2 = U.generateInvoiceSubaccount({
        caller = thisprinc;
        id = id2;
    });
    let thisacc : [Nat8] = A.accountIdentifier(thecanisterid, Blob.fromArray(subacc2));
    let hexEncoded = Hex.encode(thisacc);
    var accountBal : AccountBalanceArgs = {
          account = thisacc;
      };
    let destinationResulttxt = U.accountIdentifierToText({
      accountIdentifier = #blob(thisacc);
      canisterId = ?thecanisterid;
    });
    let temp : Tokens = await LedgerCanister.account_balance(accountBal);
    let toAcc : [Nat8] = hexDecode(id);
    let subacc = A.defaultSubaccount();
    let transferargs : Ledger.TransferArgs = {
        to = A.accountIdentifier(id, subacc);
        fee = {
          e8s = 10000;
        };
        memo = 0;
        from_subaccount = ?subacc2;
        created_at_time = null;
        amount = {
          // Total amount, minus the fee
          e8s = Nat64.sub(Nat64.fromNat(amnt), 10000);
        };
      };
    let transferResult = await LedgerCanister.transfer(transferargs);
      switch (transferResult) {
        case (#Ok index) {
          #ok({blockHeight = index});
        };
        case (#Err err) {
          switch err {
            case (#BadFee kind) {
              let expected_fee = kind.expected_fee;
              #err({
                message = ?("Bad Fee. Expected fee of " # Nat64.toText(expected_fee.e8s) # " but got " # Nat64.toText(transferargs.fee.e8s));
                kind = #BadFee({expected_fee});
              });
            };
            case (#InsufficientFunds kind) {
              let balance = kind.balance;
              #err({
                message = ?("Insufficient balance. Current balance is " # Nat64.toText(temp.e8s) # hexEncoded);
                kind = #InsufficientFunds({balance});
              })
            };
            case (#TxTooOld kind) {
              let allowed_window_nanos = kind.allowed_window_nanos;
              #err({
                message = ?("Error - Tx Too Old. Allowed window of " # Nat64.toText(allowed_window_nanos));
                kind = #TxTooOld({allowed_window_nanos});
              })
            };
            case (#TxCreatedInFuture) {
              #err({
                message = ?"Error - Tx Created In Future";
                kind = #TxCreatedInFuture;
              })
            };
            case (#TxDuplicate kind) {
              let duplicate_of = kind.duplicate_of;
              #err({
                message = ?("Error - Duplicate transaction. Duplicate of " # Nat64.toText(duplicate_of));
                kind = #TxDuplicate({duplicate_of});
              })
            };
          };
        };
      };
  };
  public shared func genFirstAcc() : async AccountIdentifier {
    let id = Principal.fromActor(Invoice);
    let subacc = A.defaultSubaccount();
    let accid = A.accountIdentifier(id, subacc);
    let hexEncoded = Hex.encode(accid);
    let result : AccountIdentifier = #text(hexEncoded);
    return result;
  };

    public shared func genFirstAccBlob() : async AccountIdentifier {
    let id = Principal.fromActor(Invoice);
    let subacc = A.defaultSubaccount();
    let accid = A.accountIdentifier(id, subacc);
    let result : AccountIdentifier = #blob(accid);
    return result;
  };
// #endregion

// #region Utils
  public func accountIdentifierToBlob (accountIdentifier : AccountIdentifier) : async T.AccountIdentifierToBlobResult {
    U.accountIdentifierToBlob({
      accountIdentifier;
      canisterId = ?Principal.fromActor(Invoice);
    });
  };
// #endregion

// #region Upgrade Hooks
  system func preupgrade() {
    entries := Iter.toArray(invoices.entries());
  };
// #endregion
}
