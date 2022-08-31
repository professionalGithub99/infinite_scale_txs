import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import TxId "TxId";
import T "./types";

actor class Archive(_owner:Principal)= this{ 
    let owner = _owner;
    private var _next_archive:?Archive = null;
    public type TxId = TxId.TxId;
     var max_size = 50;
     var TxIdFunctions = TxId.Functions;
     var tx_ids:HashMap.HashMap<TxId,Nat> = HashMap.HashMap<TxId,Nat>(5, TxIdFunctions.equal,func(x):Hash.Hash {TxIdFunctions.hash(x)});
      func is_full():Bool{
	  return (Nat.greater(tx_ids.size(),max_size) or Nat.equal(tx_ids.size(),max_size));
      };
      public func add_tx(_tx_id:TxId):async T.addTxReceipt {
        switch(tx_ids.get(_tx_id)){
	   case(?tx_id_value){
	    return #TxExists(Principal.fromActor(this),_tx_id);
	   };
	   case(null){
       if(is_full())
       {
       switch(_next_archive){
       case(?next_archive)
       {
	    return await next_archive.add_tx(_tx_id);
       };
       case(_)
       {
	   return #ArchiveFull(Principal.fromActor(this),_tx_id);
       };
       };
       }
       else{
	   tx_ids.put(_tx_id,1);
	   return #TxAdded((Principal.fromActor(this),_tx_id));
	   };
	   };
	};
      };

      public shared({caller}) func set_next_archive(next_archive:?Archive):async (){
           assert(caller == owner);
	  _next_archive := next_archive;
	  return;
      };
};
