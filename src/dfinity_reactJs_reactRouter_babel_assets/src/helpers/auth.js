import { AuthClient } from "@dfinity/auth-client";

const whitelist = ["4fcza-biaaa-aaaah-abi4q-cai"]; //for mainnet deployment
const host = "https://4fcza-biaaa-aaaah-abi4q-cai.raw.ic0.app"; //for mainnet deployment
  let signedIn = false
  let client
  export let principal = ""
  export let prinExport = undefined
  const initAuth = async () => {
    const hasAllowed = await window.ic?.plug?.requestConnect({whitelist,});
    if (hasAllowed) {
      signedIn = true;
      const prin = await window.ic?.plug?.getPrincipal()
      prinExport = prin
      principal = prin.toString()
    } else {
      signedIn = true;
    }
  };