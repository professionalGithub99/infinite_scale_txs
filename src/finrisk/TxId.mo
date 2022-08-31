import Text "mo:base/Text";
import Ledger "../invoice/ledger";
import Principal "mo:base/Principal";
import Hash "mo:base/Hash";
import Nat64 "mo:base/Nat64";
import Nat "mo:base/Nat";
module 
{
 public type TxId = Nat;
 public object Functions{
      public func equal(a:TxId, b:TxId):Bool {return (a == b)};
      public func hash(a:TxId):Hash.Hash{return Hash.hash(a)};
      public func create_tx_id(_nat:Nat):TxId{return _nat;};
    };
};
