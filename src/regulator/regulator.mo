import Result "mo:base/Result";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Float "mo:base/Float";
import Buffer "mo:base/Buffer";
import T "./types";
import Time "mo:base/Time";
import Option "mo:base/Option";
import Order "mo:base/Order";
import Nat64 "mo:base/Nat64";
import ExperimentalCycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import Hash "mo:base/Hash";
import Blob "mo:base/Blob";
import Ledger "../invoice/ledger";
import A "../invoice/Account";
import Hex "../invoice/Hex";
import Rate "./InterestRateModel";
import U "../invoice/Utils";
import Archives "./Archives";
import TxId "./TxId";
import Cycles "mo:base/ExperimentalCycles";
import Nat8 "mo:base/Nat8";
import M "./market";
import B "./book";

actor class Regulator(_owner : Principal) = this {
  //GENERAL DATA STRUCTURE STUFF AND TYPES 

  public type ArchiveCanister= Archives.Archive;
  private stable let admin = _owner;
  public type TxId = TxId.TxId;
  let TxIdFunctions =  TxId.Functions;
  var archive_entry:?ArchiveCanister = null;
  var current_archive:?ArchiveCanister = null;
  var creating_archive = false;
  private stable var _lockServerCanisterId:Text = "";

 public func generate_archive_canister():async ArchiveCanister{
    Cycles.add(200_000_000_000);
    var ac = await Archives.Archive(Principal.fromActor(this));
    return ac;
  };  
  public func get_or_set_archive_canister():async ArchiveCanister{
    switch(archive_entry){
	case(?_ac){ return _ac; };
	case(_){ var new_canister = await generate_archive_canister(); 
	archive_entry:= ?new_canister;
        current_archive:= ?new_canister;
	return new_canister;
	};
    };
  };
 public func set_next_archive(_principal:Principal):async ?Principal{
    switch(current_archive){
    case(null){
    Debug.trap("No current archive");
    };
    case(?_ac){
       var last_canister:ArchiveCanister = actor(Principal.toText(_principal));
       if(last_canister == _ac and creating_archive ==false){
           creating_archive := true;
           try{
           var ac = await generate_archive_canister();
           await _ac.set_next_archive(?ac);
           current_archive := ?ac;
           creating_archive := false;
           return ?Principal.fromActor(ac);
           }
           catch(e){
           creating_archive := false;
           return null;
           };
       };
       return null;
    };
    };
  };

  public func add_tx(_txid:TxId):async (T.addTxReceipt,?Principal){
      var a_c = await get_or_set_archive_canister();
      var add_receipt = await a_c.add_tx(_txid);
      switch(add_receipt){
         case(#TxExists p_and_t){
         return (#TxExists(p_and_t),null);
         };
         case(#ArchiveFull p_and_t){
            var set_new = await set_next_archive(p_and_t.0);
            return (#ArchiveFull(p_and_t),set_new);
         };
         case(#TxAdded p_and_t){
            var set_new = await set_next_archive(p_and_t.0);
            return (#TxAdded(p_and_t),set_new);
         };
      };
    };
  };
