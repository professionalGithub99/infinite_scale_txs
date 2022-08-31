import IRM "../ficp/InterestRateModel";
import Utils "../invoice/Utils";
import Ledger "../invoice/ledger";
import Invoice "canister:ledger";
import account_info "../invoice/account_info";
import Nat64 "mo:base/Nat64";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
actor {
  public shared (msg) func getCallerBalance() : async Nat64 { 
  var account_balance= await account_info.get_balance(msg.caller);
  var principal= Principal.toText(msg.caller);
  Debug.print("The Principal is "#principal);
  Debug.print("The account balance is " # Nat64.toText(account_balance));
  return account_balance;
  };

  public shared(msg) func getCallerAccountIdAsBlob():async [Nat8]{
     var account_id= await Utils.getAccountIdAsBlob(msg.caller);
    return account_id;
  };
};
