import {expect, test} from "vitest";
import hdkey from "hdkey";
import bip39 from "bip39";
import {Actor, HttpAgent} from "@dfinity/agent";
import {Principal} from "@dfinity/principal";
import {identityFromSeed} from "./identity";
import canisterIds from "../canister_ids.json";
import {idlFactory} from "../src/declarations/finrisk/finrisk.did.js";
import {createActor} from "./actor";
import fetch from "isomorphic-fetch";


//BEFORE RUNNIG THIS SCRIPT MAKE SURE YOU CREATE THE MARKET OF XTC USING THE FOLLOWING COMMAND
//dfx canister --network ic call finrisk get_or_create_market '(principal "aanaa-xaaaa-aaaah-aaeiq-cai",200000000000000000,1000000000000000000,1000000000000,130000000,100000000,2000000000,900000000000000000,1080000000000000000)'
//THEN ADD 5000000000000 xtc to the market
//dfx canister --network ic call finrisk add_balance '(principal "togxb-zfodc-okecc-leq3i-5wmn7-mavi5-zbs6j-wouxk-ofawl-4z6sf-aae",_principal "aanaa-xaaaa-aaaah-aaeiq-cai",5000000000000)
//then run npm test

const realseed = "bean anger believe company allow absurd vendor lamp flip unfair domain flash";
const realseed2 = "vote exclude jealous rice river carbon cry vault market cycle awkward ginger";

const realidentity = await identityFromSeed(realseed);	
const realidentity2 = await identityFromSeed(realseed2);
const realprincipal = (await realidentity).getPrincipal().toString();
const realprincipal2 = (await realidentity2).getPrincipal().toString();

const finriskCanisterId= canisterIds.finrisk.ic; 

const options = {agentOptions: {
    host: "https://ic0.app",
    fetch,
    identity: realidentity,
  }};

const options2 = {agentOptions: {
	    host: "https://ic0.app",
	    fetch,
	    identity: realidentity2,
	  }};

const finriskActor=  await createActor(finriskCanisterId,options,idlFactory);
const finriskActor2=  await createActor(finriskCanisterId,options2,idlFactory);
test("get an account balance", async () =>{
console.log(realprincipal);
record a block of a specific principal
const deposit_icp= await finriskActor.deposit_icp(BigInt(4324443),{Mint:null});
console.log(deposit_icp,"deposited icp 60000000 from blcok 4324443\n");

//get that off ramp balance
const check_balance= await finriskActor.get_off_ramp_balances();
console.log(check_balance,"check balance should be 60000000\n");

//mint an ficp cToken
const mint_icp_market = await finriskActor.mint(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"),30000000);
console.log(mint_icp_market,"minted icp market\n");
const get_icp_market_balance= await finriskActor.get_market_balance(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"),Principal.fromText(realprincipal));
console.log(get_icp_market_balance,"get market balance should be 150000000\n");

//check the offramp balance
const check_balance_post_mint= await finriskActor.get_off_ramp_balances();
console.log("Using 30000000 icp we minted 150000000 fTokens. You can do the math, exchange rate = 2e17 icp * mantissa per fTokens");
console.log("note icp decimals is 1e8, fTokens decimal is 1e8 and mantissa is 1e18\n");
console.log(check_balance_post_mint,"check balance should be 30000000\n");

//view the exchange rate of the icp per fToken 
const exchange_rate_icp = await finriskActor.debug_get_exchange_rate(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));
console.log(exchange_rate_icp,"exchange rate should be 2e17\n");
const redeem_icp_market = await finriskActor.redeem(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"), BigInt(150000000));
console.log(redeem_icp_market,"leftover in market after redeeming should be 0 balance\n");

const get_icp_market_balance_after_redeem = await finriskActor.get_market_balance(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"),Principal.fromText(realprincipal));
console.log(get_icp_market_balance_after_redeem,"get market balance should be 0\n");

//we already deposited dip after putting in allowance so do not do this line
//const deposit_dip = await finriskActor.deposit_dip(Principal.fromText("aanaa-xaaaa-aaaah-aaeiq-cai"));

const check_balance_post_xtc_mint = await finriskActor.get_off_ramp_balances();
console.log(check_balance_post_xtc_mint,"icp balance should be 60000000 and xtc should be 5000000000000\n");

//now mint some of the xtc and check account liquidity 
//remember exchange rate is xtc per xToken so then you have (exchange decimal amount * icp_decimals*mantissa/xToken_decimals) = exchange rate = 2e17
//so you have (2e17 * 1e12  / 1e12) = 2e17
//If I mint 25e11 xtc then to get the xTokens you do ((25e11 *1e18*1e18)/2e17)/1e18 = 125e11 xTokens
//const mint_xtc_market = await finriskActor.mint(Principal.fromText("aanaa-xaaaa-aaaah-aaeiq-cai"),BigInt(25e11));
//console.log(mint_xtc_market,"minted xtc market\n");
/*const get_xtc_market_balance= await finriskActor.get_market_balance(Principal.fromText("aanaa-xaaaa-aaaah-aaeiq-cai"),Principal.fromText(realprincipal));
console.log(get_xtc_market_balance,"get market balance should be 125e11\n");

const check_balance_post_xtc_mint_2 = await finriskActor.get_off_ramp_balances();
console.log(check_balance_post_xtc_mint_2,"icp balance should be 60000000 and xtc should be 25e11\n");*/

//check the account liquidity
const account_liquidity = await finriskActor.debug_get_account_liquidity(Principal.fromText(realprincipal));
console.log(account_liquidity,"account liquidity should be 60000000\n");

//_token:T.Token,_nat:Nat, _test_cash:Nat,_test_borrows:Nat,_test_reserves:Nat,test_reserve_rate_mantissa:Nat,_test_base_rate_mantissa:Nat,_test_rate_multiplier:Nat
const accrue_interest_on_xtc = await finriskActor.debug_accrue_interest(Principal.fromText("aanaa-xaaaa-aaaah-aaeiq-cai"),BigInt(100000000000), BigInt(1000000000000),BigInt(10000000000),BigInt(0),BigInt(1000000000000000000),25000000000000000,200000000000000000);
console.log(accrue_interest_on_xtc);
//const redeem_xtc_market = await finriskActor.redeem(Principal.fromText("aanaa-xaaaa-aaaah-aaeiq-cai"), BigInt(125e11));
//console.log(redeem_xtc_market,"leftover in market after redeeming should be 0 balance\n");
expect("hi").toBe("hi");
},60000);





// ASK AUDITOR WHY LOCKING CANISTER IN THE OTHER DIRECTORY THE AWAITS SEEM TO REPLY IN ORDER? i THOUGHT THEY SHOULD RETURN AT RANDOM TIMES
