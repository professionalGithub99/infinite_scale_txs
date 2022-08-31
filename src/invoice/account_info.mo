import L "mo:base/List";
import A "mo:base/AssocList";
import D "mo:base/Debug";
import T "mo:base/Text";
import I "mo:base/Int32";
import P "mo:base/Principal";
import B "mo:base/Blob";
import N8 "mo:base/Nat8";
import Hex "Hex";
import Ledger "ledger";
import Utils "Utils";
import Account "Account";
module{
  type LedgerInterface = Ledger.Self;
  type Tokens=Ledger.Tokens;
  type AccountBalanceArgs = {
account : Ledger.AccountIdentifier;
  };
  type TransferArgs=Ledger.TransferArgs;
  type TransferResult=Ledger.TransferResult;
  public func get_balance(p:Principal) : async Nat64{
    var subAcc=Account.defaultSubaccount();
    var accountID:[Nat8]=Account.accountIdentifier(p,subAcc);
    var texting= await blob_to_text(B.fromArray(accountID));
    var accBalanceArgs:AccountBalanceArgs={account=accountID};
    var ledgerActor= actor("rrkah-fqaaa-aaaaa-aaaaq-cai"):LedgerInterface;
    var accBalance=await ledgerActor.account_balance(accBalanceArgs);
    return accBalance.e8s;
    //this is a test function I used with myself to view how blob translation worked
    //return (accountID,B.fromArray(accountID),Hex.encode(accountID));
  };
  public func get_account_id(_principal:Principal) : async Account.AccountIdentifier{
    var subAcc=Account.defaultSubaccount();
    var accountID=Account.accountIdentifier(_principal,subAcc);
    return accountID;
  };
  public func blob_to_text(_blob:Blob):async Text{
    let hexChars = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
    var text="";
    var blob_array=B.toArray(_blob);
    for (i in blob_array.vals()){
      //D.print(N8.toText(i));
      let a=N8.toNat(i/16);
      let b=N8.toNat(i%16);
      text#=hexChars[a]#hexChars[b];
    };
    return text;
  };
  public func convert_to_UTF8(_text:Text):async Blob{
    return T.encodeUtf8(_text);
  };
  public func decode_UTF8(blob:Blob):async ?Text{
    return T.decodeUtf8(blob);
  };
};

