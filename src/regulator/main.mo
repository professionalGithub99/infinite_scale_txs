import Result "mo:base/Result";
import Lock "./Lock";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
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
  private stable let admin = _owner;
  let book= B.Book();
  let LedgerCanister : Ledger.Self = actor "ryjl3-tyaaa-aaaaa-aaaba-cai";
  public type TxId = TxId.TxId;
  let TxIdFunctions =  TxId.Functions;
  public type Market = M.Market;
  public type ArchiveCanister= Archives.Archive;
  let archive_principals: Buffer.Buffer<Principal> = Buffer.Buffer<Principal>(5);
  let tx_ids= HashMap.HashMap<TxId,Nat>(8, TxIdFunctions.equal, func(x):Hash.Hash{TxIdFunctions.hash(x)});
  private var markets = HashMap.HashMap<T.Token,Market>(10,Principal.equal,Principal.hash);
  private stable var book_stable : [var (Principal, [(T.Token, Nat)])] = [var]; 
  private stable var archive_stable :[var Principal] = [var];
  private stable var markets_stable:[var (T.Token,Nat,Nat,Nat,Nat,Nat,Nat,Nat,Nat,Nat,Nat,Nat,Int,Nat,Nat,Nat,Nat,Nat,[(Principal,Nat)],[(Principal,Nat)])] = [var];


  //MARKET ZONE
  let mantissa = 1_000_000_000_000_000_000;
  let floatScalingFactor : Float = 100_000_000.0;
  let e8scaling : Nat = 10_000_000_000;
  let icp_fee :Nat = 10000;
  private var _lock: ?Lock.Lock = null;

  //___MARKET_FUNCTIONS___
  public shared({caller}) func get_or_create_market(_token : T.Token,_exchange_rate_mantissa:Nat,_mantissa:Nat,_decimal:Nat,_dollar_per_underlying:Nat,_dollar_decimal:Nat,_token_fee:Nat,_collateral_factor_mantissa:Nat,_liquidation_discount_mantissa:Nat): async Bool{
    assert(caller == _owner);
    if(not _market_exists(_token)){
      var market = M.Market(_token,_exchange_rate_mantissa,_mantissa,_decimal,_dollar_per_underlying,_dollar_decimal,_token_fee,_collateral_factor_mantissa,_liquidation_discount_mantissa);
      _create_market(_token, market);
      return false;
    }; 
    var market = _get_market(Principal.fromActor(LedgerCanister));
    return true;
  };
  func _create_market(_token: T.Token, _market: Market):(){
    markets.put(_token, _market);
  };

  func _market_exists(_token: T.Token) : Bool {
    switch(markets.get(_token)) {
      case (? market_exist){
        return true;
      };
      case (_){return false};
    };
  };
  func _get_market(_token: T.Token) : Market {
    switch(markets.get(_token)) {
      case (? market_exist){
        return market_exist;
      };
      case (_){Debug.trap("Market not found")};
    };
  };

  func _get_or_create_icp_market() : Market 
  {
    if(not _market_exists(Principal.fromActor(LedgerCanister))){
      var market = M.Market(Principal.fromActor(LedgerCanister),200000000000000000,mantissa,100000000,750000000,100000000,10000,900000000000000000,1080000000000000000);
      _create_market(Principal.fromActor(LedgerCanister), market);
    }; 
    var market = _get_market(Principal.fromActor(LedgerCanister));
    return market;
  };


  //___HELPER_FUNCTIONS_____
  func get_account_liquidity(_principal:Principal) : Int{
    var account_liquidity:Int =0;
    //loop through markets and get account liquidity
    for(market in markets.vals()){
      account_liquidity += market.get_collateral(_principal);
    };
    return account_liquidity;
  };

  public shared({caller}) func account_test(_accountId:Text):async (A.AccountIdentifier,Result.Result<[Nat8], Hex.DecodeError>){
    var account_principal= A.accountIdentifier(caller,A.defaultSubaccount());
    var account_accountId = Hex.decode(_accountId);
    return (account_principal,account_accountId);
  };

  public shared({caller}) func get_this_account_id_as_text():async (Text,Text){
    var account_id_as_vec8= A.accountIdentifier(Principal.fromActor(this),A.defaultSubaccount());
    var account_id_hex_text= Hex.encode(account_id_as_vec8);
    return (account_id_hex_text,A.accountIdentifierAsText(Principal.fromActor(this),A.defaultSubaccount()));
  };

  func parse_block(_from:Principal,_block:Ledger.Block, _operation:{#Repay;#Mint}):Nat64{
    var transaction = _block.transaction;
    //check operation 
    switch(transaction.operation){
      case (null){};
      case (?operation){
        switch(operation){
          case(#Transfer transfer){
              //check from and to
              if(transfer.from == A.accountIdentifier(_from,A.defaultSubaccount())){
                if(transfer.to == A.accountIdentifier(Principal.fromActor(this),A.defaultSubaccount())){
                  //return amount
                  return transfer.amount.e8s;
                };
            };
          };
          case(_){};
        };
      };
    };
    return 0;
  };

  public func icp_sent_from_principal(_block_index:Ledger.BlockIndex,_principal:Principal,_tx_type:{#Repay;#Mint}): async Nat64{
    //check the the canister hashmap and mintledgers to see if the block exists in the hashmap
    var blocks = await view_blocks(_block_index);
    var total:Nat64 = 0;
    for (i in blocks.blocks.vals()){
      total+=parse_block(_principal,i,#Mint);
    };
    //loop through blocks.archived_blocks and call the callback function using {start = _block_index; length = Nat64.fromNat(1)}
    for(i in blocks.archived_blocks.vals()){
      var archived_block_response = await i.callback({start = _block_index; length = Nat64.fromNat(1)});
      switch(archived_block_response){
        case(#Ok archived_blocks){
          for (i in archived_blocks.blocks.vals()){
            total+=parse_block(_principal,i,_tx_type);
          };
        };
        case(_){};
      };
    };
    return total;
  };

  //___DEPOSIT_AND_WITHDRAW_FUNCTIONS____
  public shared({caller}) func get_off_ramp_balances():async Text{
    switch(book.get(caller)){
      case(null){return "";};
        case(?market){
          return(debug_show(Iter.toArray(market.entries())));
        };
    };
  };

  public shared({caller}) func deposit_icp(_block_index:Ledger.BlockIndex, _tx_type:{#Repay;#Mint}):async T.DepositReceipt{

    //attempts to see if icp market exists and tx id is already being processsed 
    var icp_market = _get_or_create_icp_market();
    var tx_id:TxId = TxIdFunctions.create_tx_id(_block_index, caller,_tx_type);
    var tx_id_processing = tx_ids.get(tx_id);
    switch(tx_id_processing){
      case(?currently_processing){
        return #Err(#TransferFailure);
      };

      // if its not being processsed mark it as being processsed note you check if its processed while marking it as processed so its atomic. 
      case(_){
        tx_ids.put(tx_id,1);
        try
        {
        // if tx id already is in the avaialble archive canisters then return
          var tx_id_exists = await find_tx_id(_block_index, caller,#Mint);
          if(tx_id_exists){
             var removed_tx_id = tx_ids.remove(tx_id);
             return #Err(#BlockUsed);
          };

          // this block checks how much icp was sent from the principal and ensures its greater than 0
          var total = await icp_sent_from_principal(_block_index,caller,#Mint);
          if(Nat64.greater(total,Nat64.fromNat(0))){
            let available = { e8s : Nat = Nat64.toNat(total)};
            var archive_principal = await get_latest_or_create_archive_canister();
            var archive_canister:ArchiveCanister = actor(Principal.toText(archive_principal));


            //NOTE WHILE archive_canister.add RETURNS FALSE IF THE TX_ID EXISTS IN THAT CANISTER, if we got to this point then the tx_id is not in the archive canister because the tx id can only be checked synchonously due to our 
            //tx_id_processing check above. ESSENTIALLY this is only checking if the latest archive canister is full
            var transaction_added = await archive_canister.add_tx(tx_id);
            if(transaction_added){
              book.addTokens(caller,Principal.fromActor(LedgerCanister),available.e8s);
            }
            else{
              try {
              //all principals that run into a full canister get queued to create a new archive canister. 
              //Essentially they recheck whether the last qued canister created a new archive thats usable. Otherwise they create it themselves. They then the tx id to that new canister and the tokens
              // to the book.
                await _getLock().lock("lockNumber");
                var potentially_new_archive_principal = await get_latest_or_create_archive_canister();
                var potentially_new_archive_canister:ArchiveCanister = actor(Principal.toText(potentially_new_archive_principal));
                var transaction_added = await potentially_new_archive_canister.add_tx(tx_id);
                if(transaction_added){
                  book.addTokens(caller,Principal.fromActor(LedgerCanister),available.e8s);
                }
                else{
                  var new_archive_principal = await generate_archive_canister();
                  var transaction_add_last_attempt = await archive_canister.add_tx(tx_id);
                  if (transaction_add_last_attempt){
                    book.addTokens(caller,Principal.fromActor(LedgerCanister),available.e8s);
                  }
                  else{
                    var removed_tx_id = tx_ids.remove(tx_id);
                    try{
                      await _getLock().unlock("lockNumber");
                      return #Err(#TransferFailure);
                    }
                    catch(e){
                      await _getLock().unlock("lockNumber");
                      return #Err(#TransferFailure);
                    }
                  };
                };
                //NEEED TO CALL TX_IDS REMOVE TX ID BEFORE UNLOCKING. ITS EASY TO SELF FLUSH THE LOCKS BUT NOT EASY TO FIND TX IDS AND REMOVE THEM.
                var removed_tx_id = tx_ids.remove(tx_id);
                await _getLock().unlock("lockNumber");
              } catch (e) {
                var removed_tx_id = tx_ids.remove(tx_id);
                await _getLock().unlock("lockNumber");
              };
            };
            var removed_tx_id = tx_ids.remove(tx_id);
            return #Ok(available.e8s)
          };
          var removed_tx_id = tx_ids.remove(tx_id);
          return #Err(#ZeroDepositOrNoBlockFound);
        }
        catch (e) {
          var removed_tx_id = tx_ids.remove(tx_id);
          return #Err(#TransferFailure);
        };
      };
    };
  };

  // After user approves tokens to the DEX
  public shared ({caller}) func deposit_dip(_token: T.Token): async T.DepositReceipt {
    var market = _get_market(_token);
    // cast token to actor
    let dip20 = actor (Principal.toText(_token)) : T.DIPInterface;

    // get DIP fee
    let dip_fee = await fetch_dip_fee(_token);

    // Check DIP20 allowance for DEX
    let balance : Nat = (await dip20.allowance(caller, Principal.fromActor(this)));

    // Transfer to account.
    let token_reciept = if (balance > dip_fee) {
      await dip20.transferFrom(caller, Principal.fromActor(this),balance - dip_fee);
    } else {
      return #Err(#BalanceLow);
    };

    switch token_reciept {
      case (#Err e) {
        return #Err(#TransferFailure);
      };
      case _ {};
    };
    let available = balance - dip_fee;

    // add transferred amount to user balance
    book.addTokens(caller,_token,available);

    // Return result
#Ok(available)
  };
  private func fetch_dip_fee(token: T.Token) : async Nat {
    let dip20 = actor (Principal.toText(token)) : T.DIPInterface;
    let metadata = await dip20.getMetadata();
    metadata.fee
  };

  public shared({caller}) func withdraw_icp(_amount: Nat, _accountId: Text) : async T.WithdrawReceipt {
    var account_id_as_vec8= Hex.decode(_accountId);
    // remove withdrawal amount from book
    switch (book.removeTokens(caller, Principal.fromActor(LedgerCanister), _amount+icp_fee)){
      case(null){
        return #Err(#BalanceLow)
      };
      case _ {};
    };
    try {
      var account_id_as_vec8= Hex.decode(_accountId);
      switch(account_id_as_vec8){
        case(#ok account_id_as_vec8){
          var transferargs ={
	to:Ledger.AccountIdentifier = account_id_as_vec8;
	fee:Ledger.Tokens = {e8s = Nat64.fromNat(icp_fee)};
	memo:Ledger.Memo= 1;
	from_subaccount:?Ledger.SubAccount = null;
	created_at_time:?Ledger.TimeStamp = null;
	amount:Ledger.Tokens= {e8s = Nat64.fromNat(_amount)};
          };
          var t_result =  await LedgerCanister.transfer(transferargs);
          switch(t_result){
            case (#Err e) {
              // add tokens back to user account balance
              book.addTokens(caller,Principal.fromActor(LedgerCanister),_amount+icp_fee);
              return #Err(#TransferFailure);
            };
            case _ {};
          };
          return #Ok(_amount)
        };
        case(#err err){Debug.trap("Error decoding account id")};
      };
    }
    catch e {
      Debug.trap("error");
    };
  };
  public shared({caller}) func withdraw_dip(_token: T.Token, _amount: Nat, _address: Principal) : async T.WithdrawReceipt {
    var market = _get_market(_token);
    // cast canisterID to token interface
    let dip20 = actor (Principal.toText(_token)) : T.DIPInterface;

    // get dip20 fee
    let dip_fee = await fetch_dip_fee(_token);

    // remove withdrawal amount from book
    switch (book.removeTokens(caller,_token,_amount+dip_fee)){
      case(null){
        return #Err(#BalanceLow)
      };
      case _ {};
    };

    // Transfer amount back to user
    let txReceipt =  await dip20.transfer(_address, _amount);
    switch txReceipt {
      case (#Err e) {
        // add tokens back to user account balance
        book.addTokens(caller,_token,_amount + dip_fee);
        return #Err(#TransferFailure);
      };
      case _ {};
    };
    return #Ok(_amount)
  };

  //____ARCHIVE_FUNCTIONS____
  private func _getLock(): Lock.Lock {
    switch(_lock){
      case(?_l){ return _l; };
      case(_){
        var _l: Lock.Lock =  Lock.Lock("", 2, 30);
_lock := Option.make(_l);
       return _l;
      };
    };
  };


  public func find_tx_id(_block_index:Ledger.BlockIndex, _principal:Principal,_tx_type:{#Repay;#Mint}):async Bool{
    var tx_id:TxId = TxIdFunctions.create_tx_id(_block_index, _principal,#Mint);
    for(i in archive_principals.vals()){
      var archive_canister:ArchiveCanister= actor(Principal.toText(i));
      var found = await archive_canister.find_tx_id(tx_id);
      if(found)
      {
        return true;
      };
    };
    return false;
  }; 
  public func generate_archive_canister():async Principal {
    Cycles.add(200_000_000_000);
    var archive_canister= await Archives.Archive();
    archive_principals.add(Principal.fromActor(archive_canister));
    return Principal.fromActor(archive_canister);
  };
  public func view_archive_principals():async [Principal] {
    return archive_principals.toArray();
  };
  public func view_blocks(_block_index:Ledger.BlockIndex):async Ledger.QueryBlocksResponse{
    var query_response = await LedgerCanister.query_blocks({start = _block_index; length = Nat64.fromNat(1)});
    return query_response;
  };

  func get_latest_or_create_archive_canister(): async Principal{
    if( archive_principals.size() == 0){
      var archive_principal = await generate_archive_canister();
      return archive_principal;
    };
    var current_archive_principal = archive_principals.get(archive_principals.size()-1);
    return current_archive_principal;
  };
//___DEBUG_FUNCTIONS___
  public query func debug_get_exchange_rate(_token:T.Token) :async Text{
    var market = _get_market(_token);
    return market.debug_get_exchange_rate();
  };
  public shared ({caller}) func add_balance(_principal:Principal, _token:T.Token, _amount:Nat) :async (){
    book.addTokens(caller,_token,_amount);
  };

  public func debug_accrue_interest(_token:T.Token,_nat:Nat, _test_cash:Nat,_test_borrows:Nat,_test_reserves:Nat,_test_reserve_rate_mantissa:Nat,_test_base_rate_mantissa:Nat,_test_rate_multiplier:Nat) :async Text{
    var market = _get_market(_token);
    return market.debug_accrue_interest(_nat,_test_cash,_test_borrows,_test_reserves, _test_reserve_rate_mantissa, _test_base_rate_mantissa,_test_rate_multiplier);
  };

// gets each token balance and borrow amount and then adds them together with their exchange rates and dollar per underlying
  public func debug_get_account_liquidity(_principal:Principal) :async Text{
  //loop through each token and get the balance and borrow balance of each token along with the exchange rate dollar amount and collateral amount
    //loop through markets and get account liquidity
    var return_text = "";
    for(market in markets.vals()){
    market.accrue_interest();
    return_text#="token address "# debug_show(market.token);
    return_text#=" dollar per underlying "# debug_show(market.dollar_per_underlying);
    return_text#=" borrow_balance "# debug_show(market.get_borrow_balance(_principal));
    return_text#=" balance "# debug_show(market.get_balance(_principal));
    return_text#= " exchange rate mantissa "# debug_show(market.calc_exchange_rate_mantissa());
    return_text #=" market collateral in dollars "#debug_show(market.get_collateral(_principal));
    return_text #=" timestamp "#debug_show(market.debug_get_time());
    return_text#="\n\n";
    };
    return return_text;
  };
  public query func get_market_balance(_token:T.Token,_principal:Principal) :async Nat {
    var market = _get_market(_token);
    return market.get_balance(_principal);
  };
  public query func get_market_borrow_balance(_token:T.Token,_principal:Principal) :async Nat {
    var market = _get_market(_token);
    return market.get_borrow_balance(_principal);
  };

//__UPGRADE__FUNCTIONS___
  // Required since maps cannot be stable and need to be moved to stable memory
  // Before canister upgrade book hashmap gets stored in stable memory such that it survives updates
  system func preupgrade() {
book_stable := Array.init(book.size(), (Principal.fromText("aaaaa-aa"), []));
             var i = 0;
             for ((x, y) in book.entries()) {
               book_stable[i] := (x, Iter.toArray(y.entries()));
               i += 1;
             };
             //loop through archive principals and put them in the archive_stable array
archive_stable := Array.init(archive_principals.size(), Principal.fromText("aaaaa-aa"));
                var j = 0;
                for (x in archive_principals.vals()) {
                  archive_stable[j] := x;
                  j += 1;
                };
                //loop through markets and call get_all_private_variables
markets_stable := Array.init(markets.size(), (Principal.fromText("aaaaa-aa"),0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,[],[]));
                var k = 0;
                for(market in markets.vals()) {
                  markets_stable[k] := market.get_all_private_variables();
                  k += 1;
                };
  };

  // After canister upgrade book map gets reconstructed from stable array
  system func postupgrade() {
    // Reload book.
    for ((key: Principal, value: [(T.Token, Nat)]) in book_stable.vals()) {
      let tmp: HashMap.HashMap<T.Token, Nat> = HashMap.fromIter<T.Token, Nat>(Iter.fromArray<(T.Token, Nat)>(value), 10, Principal.equal, Principal.hash);
      book.put(key, tmp);
    };
    for(x in archive_stable.vals()){
      archive_principals.add(x); 
    };

    /*WANT TO UPDATE CANISTER WITHOUT CHANGING STATE MODIFY THIS*/
    for(y in markets_stable.vals()){
      //var market_temp = M.Market(y.0,200000000000000000,mantissa,100000000,750000000,100000000,10000,900000000000000000,1080000000000000000);

      //Sorry I will fix the market construct later with a record. For now was a little lazy just matched the parameters
      var market_temp = M.Market(y.0,y.3,y.2,y.1,y.4,y.5,y.6,y.8,y.17);
      market_temp.set_private_variables(y);
      markets.put(y.0,market_temp);
    };

    // Clean stable memory.
book_stable := [var];
archive_stable := [var];
markets_stable := [var];
  };
}
