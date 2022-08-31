import Nat "mo:base/Nat";
module 
{
/**
 * A little note on Mantissas and using ints as decimals
 * Lets say you consider a whole number as 1*(10^x) and are multiplying numbers #1*10^y and #2*10^z 
 * Then want to multiply #2*10^y * #2*10^z  you multiply the two numbers and then divide by one mantissa
 * i.e. (#1*10^y + #2*10^z) / (1*10^x). Now you have to becareful to make sure that y+z<x. If y+z-x is negative, you will lose digit precision.
 * fin...Meow 
 * |\---/|
 * | o_o |
 *_ \_^_/ 
 */

   public func getExchangeRateMantissa(_underlyingBalance:Nat,_prevTotalBorrowBalance:Nat,cTokenSupply:Nat,_prevReserveBalance:Nat,_mantissa:Nat):Nat
   {
    var underlyingBalanceMantissa=Nat.mul(_underlyingBalance,_mantissa);
    var prevTotalBorrowBalanceMantissa=Nat.mul(_prevTotalBorrowBalance,_mantissa);
    return (Nat.div((underlyingBalanceMantissa + prevTotalBorrowBalanceMantissa - _prevReserveBalance),cTokenSupply));

   };
   /**
    * @param _cash:Nat 
    * @param _borrows:Nat
    * @param _reserves:Nat
    * @return The borrow rate percentage per block as a mantissa
    */
   func getUtilizationRateMantissa(_cash:Nat,_borrows:Nat,_reserves:Nat,_mantissa:Nat) : Nat
   {
      if (_borrows==0)
      {
	 return 0; 
      }
      else
      {
         return Nat.div(Nat.mul(_borrows,_mantissa),(_cash+_borrows-_reserves));
      }
   };

   /**
    * @param _cash:Nat
    * @param _borrows:Nat
    * @param _reserves:Nat
    * @param _baseRatePerBlock:Nat
    * @param _multiplierPerBlock:Nat Note 
    * @return a borrow rate in Mantissa form
    */
   public func getBorrowRateMantissa(_cash:Nat, _borrows:Nat, _reserves:Nat, _baseRatePerBlockMantissa:Nat, _multiplierPerBlockMantissa:Nat,_mantissa:Nat) : Nat
   {
      var urMantissa=getUtilizationRateMantissa(_cash,_borrows,_reserves,_mantissa);
      return Nat.div(Nat.mul(urMantissa,_multiplierPerBlockMantissa),_mantissa)+_baseRatePerBlockMantissa;
   };

    /**
    * @param _borrows:Nat
    * @param _reserves:Nat
    * @param _baseRatePerBlock:Nat
    * @param _deltaTime:Nat 
    * @param _mantissa:Nat 
    * @return reserveRate in mantissa form
    */
   public func reserveAmount(_borrows:Nat,_reserves:Nat, _borrowRateMantissa:Nat, _reserveFactorMantissa:Nat, _delta_time:Nat,_mantissa:Nat):Nat
   {
       var reserve_amount = _reserves + (((_borrows * _borrowRateMantissa* _reserveFactorMantissa* _delta_time)/_mantissa)/_mantissa);
       return reserve_amount;
   };

   /**
    * @param _cash:Nat
    * @param _borrows:Nat
    * @param _reserves:Nat
    * @param _baseRatePerBlock:Nat
    * @param _multiplierPerBlock:Nat Note 
    * @param _reserveFactorMantissa:Nat
    * @return a supply rate in Mantissa form
    */
   public func getSupplyRateMantissa(_cash:Nat, _borrows:Nat, _reserves:Nat, _baseRatePerBlockMantissa:Nat, _multiplierPerBlockMantissa:Nat, _reserveFactorMantissa:Nat,_mantissa:Nat) : Nat
   {
   var brMantissa=getBorrowRateMantissa(_cash,_borrows,_reserves,_baseRatePerBlockMantissa,_multiplierPerBlockMantissa,_mantissa);
	var urMantissa=getUtilizationRateMantissa(_cash,_borrows,_reserves,_mantissa);
	var oneMantissaMinusReserve=Nat.sub(_mantissa,_reserveFactorMantissa);
	var borrowTimesUtilization=Nat.div(Nat.mul(brMantissa,urMantissa),_mantissa);
	return Nat.div(Nat.mul(borrowTimesUtilization,oneMantissaMinusReserve),_mantissa);
   };

   /**
    * @return a compounded amount of money i.e. amount * (1+rate)^time
    */
   public func compoundAmount(_amount:Nat,_interestRateMantissa:Nat,_delta_time:Nat,_mantissa:Nat):Nat
   {       
      var oneplusrate = Nat.add(_mantissa,Nat.mul(_interestRateMantissa,_delta_time));
      var compounded_total = Nat.mul(_amount,oneplusrate);
      var unmantissad = Nat.div(compounded_total,_mantissa);
      return Nat.div(Nat.mul(_amount,Nat.mul(_interestRateMantissa,_delta_time)),_mantissa);
      //return unmantissad;
   };
}
