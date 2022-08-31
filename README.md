# Finterest

Finterest is the first money market on the Internet Computer. Lend, and borrow assets asynchronously, including native Bitcoin.

## Invoice Canister

For ICP, Finterest uses a similar invoice design to the one proposed by Kyle Peacock.

What this means is for payments to be processed, the system has to create an invoice containing the metadata of the respective payment, as well as generate a new, unique Account ID using an arbitrary Subaccount (32 byte value) and its own principal.

The user sends the funds to that Account ID, and then the system verifies that the funds were received by running the `verify_invoice()` method.

By interacting through our frontend, the user will only see the prompt to transfer ICP to the generated Account ID, yet as our protocol lives in the Internet Computer, if the frontend is down (also live on-chain) or if a user wanted to call the canister directly, they would need to follow the previously explained steps.

## Lend

Supply an underlying asset and receive its corresponding fTokens. 
Lending is achieved by calling the `mint()` function on the desired asset market contract.

- ICP: Create an invoice with `create_invoice()`, specify 'Mint' in the passed object 'details' field, pay it, and then call `verify_invoice()`.
- XTC - DIP20: Approve the canister to use X amount of your balance, and call the `mint()` function.
- BTC: TBD.

Returns a Result<Nat, Err> (Either a natural number or an error code)

## Borrow

Borrow an asset against a previously locked collateral (task delegated to the FinRisk assesment layer).
Borrowing is achieved by calling the `borrow()` function on the desired asset market contract.

- ICP: `borrow(amnt : Nat)` in e8s.
- XTC - `borrow(amnt : Nat)` in e12s.
- BTC: TBD.

Returns a Result<Nat, Err> (Either a natural number or an error code)

## Repay

Repay an open borrow.
Repaying is achieved by calling the `repay()` function on the desired asset market contract.

- ICP: Create an invoice with `create_invoice()`, specify 'Repay' in the passed object 'details' field, pay it, and then call `verify_invoice()`.
- XTC - DIP20: Approve the canister to use X amount of your balance, and call the `repay()` function.
- BTC: TBD.

Returns a Result<Nat, Err> (Either a natural number or an error code).

## Redeem

Reedem fTokens for their underlying asset.
Redeeming is achieved by calling the `redeem()` function on the desired asset market contract.


- ICP: `redeem(amnt : Nat)` in e8s.
- XTC - `redeem(amnt : Nat)` in e12s.
- BTC: TBD.