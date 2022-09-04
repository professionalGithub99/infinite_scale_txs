import Text "mo:base/Text";
import Ledger "../invoice/ledger";
import Principal "mo:base/Principal";
import Hash "mo:base/Hash";
import Nat64 "mo:base/Nat64";
import Nat "mo:base/Nat";
module 
{
 public type TxId = Text;
 public object Functions{
      public func equal(a:TxId, b:TxId):Bool {return Text.equal(a, b)};
      public func hash(a:TxId):Hash.Hash{return Text.hash(a)};
      public func create_tx_id(a:Ledger.BlockIndex, b:Principal):TxId{ var x = ""; x:= Nat64.toText(a)#Principal.toText(b);
      return x;};
    };
};
