import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import T "./types"; 
import IRM "./InterestRateModel"; 
import Time "mo:base/Time";
import Int "mo:base/Int";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
module {
   public class Market(_token:T.Token,_exchange_rate_mantissa:Nat,_mantissa:Nat,_decimal:Nat,_dollar_per_underlying:Nat,_dollar_decimal:Nat,_token_fee:Nat,_collateral_factor_mantissa:Nat,_liquidation_discount_mantissa:Nat){
      public var token:T.Token= _token;
      public var decimal:Nat = _decimal;
      public var mantissa:Nat= _mantissa;
      public var exchange_rate_mantissa:Nat= _exchange_rate_mantissa;
      public var dollar_per_underlying:Nat = _dollar_per_underlying;
      public var dollar_decimal:Nat = _dollar_decimal;
      public var token_fee:Nat= _token_fee;
      public var supply_rate_mantissa:Nat = 0;
      public var collateral_factor_mantissa:Nat = _collateral_factor_mantissa;
      public var total_borrows:Nat = 0;
      public var total_cash:Nat = 0;
      public var total_supply:Nat = 0;
      public var previous_time_10s:Int= Time.now()/10000000000;
      public var base_rate_mantissa:Nat = 2000000000000000000;
      public var rate_multiplier_mantissa:Nat = 250000000000000000;
      public var reserve_rate_mantissa:Nat = 800000000000000000;
      public var total_reserves:Nat = 0;
      public var liquidation_discount_mantissa:Nat = _liquidation_discount_mantissa;


      //balances is in ftoken amount
      let balances = HashMap.HashMap<Principal,Nat>(10,Principal.equal,Principal.hash);
      //note borrow_balances is in underlying token amount
      let borrow_balances = HashMap.HashMap<Principal,Nat>(10,Principal.equal,Principal.hash);

   public func mint(_principal:Principal,_additional_underlying_amount:Nat):(Nat,Nat) {
      accrue_interest();
      var current_balance:Nat = get_balance(_principal);
      var additional_amount:Nat = fTokens_for_underlying(_additional_underlying_amount);
      balances.put(_principal,current_balance+additional_amount);
      total_cash += _additional_underlying_amount;
      total_supply += additional_amount;
      return (_additional_underlying_amount,underlying_for_fTokens(get_balance(_principal)));
   };

   public func redeem(_principal:Principal,_amount:Nat):(Nat,Nat){
   accrue_interest();
	var underlying_amount = underlying_for_fTokens(_amount);
	var amount = get_balance(_principal);
	 if(underlying_amount > token_fee and underlying_amount <= total_cash and _amount <= get_balance(_principal)){
       var leftover_balance = subtract_balance(_principal,_amount);
       total_cash -= underlying_amount;
       return (underlying_amount,underlying_for_fTokens(leftover_balance));
    }
    else {
        Debug.trap("token fee"#debug_show(token_fee)#"total cash"#debug_show(total_cash)#"amount"#debug_show(_amount)#"balance"#debug_show(get_balance(_principal)));
    };
   };

   
    //this function will allow user to withdraw more underlying than the ftoken should
   
   public func redeem_underlying(_principal:Principal,_additional_underlying_amount:Nat):(Nat,Nat){
     accrue_interest();
     var current_exchange_rate_mantissa:Nat = calc_exchange_rate_mantissa();
     var underlying_amount = get_balance(_principal);
     var additional_amount = fTokens_for_underlying(_additional_underlying_amount);
     if(_additional_underlying_amount > token_fee and _additional_underlying_amount < total_cash and additional_amount <= underlying_amount){
       var leftover_balance = subtract_balance(_principal,additional_amount);
       //note we are doing a modification on additional amount and returning that as opposed to additional undelrying as it rounds down the amount to redeem. 
       var modified_additional_amount = (additional_amount*current_exchange_rate_mantissa)/mantissa;
       total_cash -= modified_additional_amount;
       return (modified_additional_amount,underlying_for_fTokens(leftover_balance));
     }
     else {
       Debug.trap("something wrong with your underlying amount either less than your token fee, greater than total cash in the market or less than your balance");
     };
   };

   public func repay(_principal:Principal,_repay_amount:Nat):(Nat,Nat){
   accrue_interest();
   //note the minimum of the two is the removal amount. 
      var bb = get_borrow_balance(_principal);
      var min_number = Nat.min(bb,_repay_amount);
      var post_subtract_balance = subtract_borrow_balance(_principal,min_number);
      return (min_number,post_subtract_balance);
   };

   public func borrow(_principal:Principal, _amount:Nat, _get_account_liquidity:Principal -> Int):(Nat,Nat)
   {
	//get the fee check whether the amount is greater than the token fee
    //get the account liquidty for each market of the caller
    //if the _amount is greater than liquidty return error
    //if the _amount is less than liquidity  and greater than the token fee and the _amount is less than the total_cash
    //then remove the borrow balance from the account
	accrue_interest();
	var account_liquidity:Int= _get_account_liquidity(_principal);

	//NOTE THE REASON WE DONT NEED TO USE MANTISSA HERE IS BECAUSE DOLLAR DECIMAL IS 1E^X and in float point its 1.0. WE USE MANTISSA WHEN SOME DIGITS MAY MULTIPLY OUT TO CARRY OVER. HOWEVER, WHEN ANYNUMBER IS JUST 1 WITH 0'S AKA 1E^X IN BOTH INT AND FLOATING POINT TERM, IT ONLY REMOVES 0'S BUT DOES NOT DO ANY CARRY OVER MULTIPLICATION 
	var amount_as_underlying_in_dollars:Nat = (_amount*dollar_per_underlying)/dollar_decimal;
        if( _amount > token_fee and amount_as_underlying_in_dollars < account_liquidity and _amount < total_cash){
	return (_amount,get_borrow_balance(_principal));
    }
    else {
    Debug.trap("Something wrong with borrow, either account liquidity, amount less than fee or not enough liquidity in the market");
    };
   };
  
  public func liquidate(_borrower:Principal,_liquidator:Principal,_amount:Nat,_get_acount_liquidity:Principal -> Int, _market:Market):(Nat,Nat){
  //first accrue interest
  //accrue interst of the _collateral_address market
  //get account liquiidty
  //then check account liquidty is negative  
  //convert account liquidty to the underlying token
  //amount is already in underlying token
  //get borrow_balance of the underlying token
  //get collateral token balance converted to the underlying token
      accrue_interest();
      _market.accrue_interest();
      var account_liquidity_as_dollars:Int= _get_acount_liquidity(_borrower);
      var borrow_balance_as_dollars:Nat = ((get_borrow_balance(_borrower)*dollar_per_underlying*mantissa/decimal)/mantissa);
      var collateral_balance_as_dollars = (((_market.get_balance(_borrower)*_market.calc_exchange_rate_mantissa()*_market.dollar_per_underlying*_market.collateral_factor_mantissa)/_market.decimal)/_market.mantissa)/_market.mantissa;
      var amount_as_dollars:Nat =((_amount*dollar_per_underlying*mantissa)/decimal)/mantissa;
     if(account_liquidity_as_dollars < 0){
        if(amount_as_dollars < borrow_balance_as_dollars and amount_as_dollars < collateral_balance_as_dollars){
	//convert amount_as_dollars to the underlying 
	//convert amount_as_dollars to the fTokens
	var subtracted_borrow_borrower = subtract_borrow_balance(_borrower,_amount);
	var subtracted_balance_borrower = _market.subtract_balance(_borrower,_market.get_fTokens_from_dollars(amount_as_dollars));
	var new_balance_liquidator = _market.add_balance(_liquidator,_amount);
	return (_amount,new_balance_liquidator);
	}
     };
     Debug.trap("Something wrong with liquidate, either account liquidity, amount less than fee or not enough liquidity in the market");
  }; 


   public func calc_exchange_rate_mantissa():Nat {
     if(total_supply == 0){
       return _exchange_rate_mantissa;
     };
     return IRM.getExchangeRateMantissa(total_cash,total_borrows,total_supply,total_reserves,mantissa);
   };
   public func get_balance(_principal:Principal):Nat {
      switch(balances.get(_principal)){
          case(? balance){return balance;};
	  case(_){ return 0;};
   	};
   };

   public func accrue_interest():(){
	//get current utilization rate and then borrow interest rate
       //get time delta
      //loop through all users and update borrow_balances by borrow interest rate 
     // lmao idk the code is doing this pyramid shit with the comments 
     var time_delta = Time.now()/100000000000 - previous_time_10s;
     var blocks_per_year = 3162240;
     var borrow_interest_rate_mantissa:Nat = IRM.getBorrowRateMantissa(total_cash, total_borrows, total_reserves, base_rate_mantissa, rate_multiplier_mantissa,mantissa);
     //I believe its safe to do this
     var borrow_interest_rate_mantissa_per_10s:Nat = ((borrow_interest_rate_mantissa*mantissa)/blocks_per_year)/mantissa;
     var additional_borrowed:Nat = 0;
     for(key in borrow_balances.keys()){
         var current_balance = get_borrow_balance(key);
	 var compounded_amount = IRM.compoundAmount(current_balance, borrow_interest_rate_mantissa_per_10s, Int.abs(time_delta), mantissa);
         borrow_balances.put(key,compounded_amount);
	 additional_borrowed+= compounded_amount - current_balance;
     };
     total_reserves := IRM.reserveAmount(total_borrows,total_reserves, borrow_interest_rate_mantissa_per_10s, reserve_rate_mantissa, Int.abs(time_delta),mantissa);
     total_borrows += additional_borrowed;
   };




   //__BALANCE_CONVERSIONS____
   public func get_balance_in_underlying(_principal:Principal):Nat {
      return underlying_for_fTokens(get_balance(_principal));
   };
   public func get_borrow_balance(_principal:Principal):Nat {
      switch(borrow_balances.get(_principal)){
	  case(? balance){return balance;};
	  case(_){ return 0;};};
    };


   public func get_collateral(_principal:Principal):Int{
      var collateral_plus_mantissa = 0; 
      var collateral_minus_mantissa = 0;
      //I believe you don't need a mantissa with the divided decimal because youre just dividing by 1Edecimal_places which just removes the zeros. Doing anything *mantissa/decimal /mantissa leads to anything /decimal just cause theres no further multiplication at the floored digits which is the whole point of mantissa
      collateral_plus_mantissa := (((get_balance(_principal)*calc_exchange_rate_mantissa()*dollar_per_underlying*collateral_factor_mantissa)/decimal)/mantissa);
      collateral_minus_mantissa := ((get_borrow_balance(_principal)*dollar_per_underlying*mantissa/decimal));
      return (collateral_plus_mantissa - collateral_minus_mantissa)/mantissa;
   };
   public func get_underying_from_dollars(_amount:Nat):Nat {
     return (((_amount * decimal *mantissa * mantissa * mantissa)/dollar_per_underlying)/liquidation_discount_mantissa)+1;
   };
   public func get_fTokens_from_dollars(_amount:Nat):Nat {
      return (((_amount*mantissa*mantissa*mantissa)/dollar_per_underlying)/calc_exchange_rate_mantissa())/mantissa;
   };
   public func fTokens_for_underlying(_amount:Nat):Nat {
      return ((_amount*mantissa*mantissa)/calc_exchange_rate_mantissa())/mantissa;
   };
   public func underlying_for_fTokens(_amount:Nat):Nat {
      return ((_amount*calc_exchange_rate_mantissa())/mantissa);
   };




   //___ADD AND SUBTRACT BALANCES

   public func add_borrow_balance(_principal:Principal,_additional_amount:Nat):Nat {
      var current_balance = get_borrow_balance(_principal);
      borrow_balances.put(_principal,current_balance+_additional_amount);
      total_borrows += _additional_amount;
      return current_balance+_additional_amount;
   };
   public func subtract_borrow_balance(_principal:Principal,_subtract_amount:Nat):Nat {
      if(get_borrow_balance(_principal) < _subtract_amount){
	 Debug.trap("borrow balance is less than the amount being subtracted");
      };
      borrow_balances.put(_principal,get_borrow_balance(_principal)-_subtract_amount);
      var return_amount = get_borrow_balance(_principal);
      total_borrows -= _subtract_amount;
      if(get_borrow_balance(_principal) == 0){
        	 var removed = borrow_balances.remove(_principal);
      };
      return return_amount;
   };
   public func add_balance(_principal:Principal,_balance:Nat):Nat{
      var current_balance = get_balance(_principal);
      balances.put(_principal,current_balance+_balance);
      total_supply += _balance;
      return current_balance+_balance;
   };
   public func subtract_balance(_principal:Principal,_balance:Nat):Nat {
      var current_balance = get_balance(_principal);
      if(current_balance < _balance){
      Debug.trap("Insufficient balance");
      };
      balances.put(_principal,get_balance(_principal)-_balance);
      var return_balance = get_balance(_principal);
      total_supply -= _balance;
      if(get_balance(_principal) <=  0){
        var removed = balances.remove(_principal);
      };
      return return_balance;
   };



   //____FUNCTIONS FOR DEBUGGING____	
   public func debug_get_exchange_rate():Text
   {
   return ("exchange rate mantissa "#debug_show(calc_exchange_rate_mantissa())#" total cash "#debug_show(total_cash)#" total supply "#debug_show(total_supply)#" total borrows "#debug_show(total_borrows)#" total reserves "#debug_show(total_reserves)#" mantissa "#debug_show(mantissa));
   };
   public func debug_accrue_interest(_test_amount:Nat,_test_cash:Nat,_test_borrows:Nat,_test_reserves:Nat, _test_reserve_rate:Nat,_test_base_rate_mantissa:Nat,_test_rate_multiplier:Nat):Text{
	//get current utilization rate and then borrow interest rate
       //get time delta
      //loop through all users and update borrow_balances by borrow interest rate 
     // lmao idk the code is doing this pyramid shit with the comments 
     var debugging_text = "";
     var time_now_10s = Time.now()/10000000000;
     var time_delta = time_now_10s - previous_time_10s;
     previous_time_10s := time_now_10s;
     var blocks_per_year= 3162240;
     debugging_text #="time delta "#debug_show(time_delta);
     var borrow_interest_rate_mantissa:Nat = IRM.getBorrowRateMantissa(_test_cash, _test_borrows, _test_reserves, _test_base_rate_mantissa, _test_rate_multiplier,mantissa);
     debugging_text #=" borrow interest rate "#debug_show(borrow_interest_rate_mantissa);
     //I believe its safe to do this
     var borrow_interest_rate_mantissa_per_block:Nat = ((borrow_interest_rate_mantissa*mantissa)/blocks_per_year)/mantissa;
     debugging_text #=" borrow interest rate per 10s "#debug_show(borrow_interest_rate_mantissa_per_block);
     var compound_amount =IRM.compoundAmount(_test_borrows,borrow_interest_rate_mantissa_per_block,Int.abs(time_delta),mantissa);
     debugging_text #=" Compound amount "#debug_show(compound_amount)#"\n";
     //var additional_borrowed:Nat = 0;
     total_reserves := IRM.reserveAmount(_test_borrows,_test_reserves, borrow_interest_rate_mantissa_per_block, _test_reserve_rate, Int.abs(time_delta),mantissa);
     debugging_text #=" total reserves "#debug_show(total_reserves)#"\n";
     return debugging_text;
     //total_borrows += additional_borrowed;
   };
   public func debug_get_time():Int
   {
   return Time.now();
   };
   //____FUNCTIONS__FOR_UPGRADING___
   public func set_private_variables(_variables:(T.Token,Nat,Nat,Nat,Nat,Nat,Nat,Nat,Nat,Nat,Nat,Nat,Int,Nat,Nat,Nat,Nat,Nat,[(Principal,Nat)],[(Principal,Nat)])):(){
     
      token := _variables.0;
      decimal := _variables.1;
      mantissa := _variables.2;
      exchange_rate_mantissa := _variables.3;
      dollar_per_underlying := _variables.4;
      dollar_decimal := _variables.5;
      token_fee := _variables.6;
      supply_rate_mantissa := _variables.7;
      collateral_factor_mantissa := _variables.8;
      total_borrows := _variables.9;
      total_cash := _variables.10;
      total_supply := _variables.11;
      previous_time_10s := _variables.12;
      base_rate_mantissa := _variables.13;
      rate_multiplier_mantissa := _variables.14;
      reserve_rate_mantissa := _variables.15;
      total_reserves := _variables.16;
      liquidation_discount_mantissa := _variables.17;
      for(vals in _variables.18.vals()){
        var temp = balances.put(vals.0,vals.1);
      };
      for(vals in _variables.19.vals()){
	var temp2 = borrow_balances.put(vals.0,vals.1);
      };
   };
   public func get_all_private_variables ():(T.Token,Nat,Nat,Nat,Nat,Nat,Nat,Nat,Nat,Nat,Nat,Nat,Int,Nat,Nat,Nat,Nat,Nat,[(Principal,Nat)],[(Principal,Nat)]){
       var all_balances:[var (Principal,Nat)] = Array.init(balances.size(),(Principal.fromText("aaaaa-aa"),0));
       var all_borrow_balances:[var (Principal,Nat)] = Array.init(borrow_balances.size(),(Principal.fromText("aaaaa-aa"),0));
        var i = 0;
       for((x,y) in balances.entries()){
         all_balances[i] := (x,y);
	i += i +1;
       };
       var j = 0;
       for((x,y) in borrow_balances.entries()){
	 all_balances[j] := (x,y);
	 j +=1;
	 };
       return (token,decimal,mantissa,exchange_rate_mantissa,dollar_per_underlying,dollar_decimal,token_fee,supply_rate_mantissa,collateral_factor_mantissa,total_borrows,total_cash,total_supply,previous_time_10s,base_rate_mantissa,rate_multiplier_mantissa,reserve_rate_mantissa,total_reserves,liquidation_discount_mantissa,Array.freeze(all_balances),Array.freeze(all_borrow_balances));
   };


  };
};
