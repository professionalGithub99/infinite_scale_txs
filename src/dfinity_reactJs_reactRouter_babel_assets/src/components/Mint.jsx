import React, { useState, useContext, useEffect } from "react";
import "../style/main.css";

//mint
import { Principal } from "@dfinity/principal";
import { tokenIdentifier } from "../helpers/tokenId";
import {principal} from "../helpers/auth";
import {idlFactory} from "./interface";
import {data} from "./whitelistAddresses";

//material
import Box from "@material-ui/core/Box";

//assets
import Card from "../../assets/finalPass.gif";

//toasts
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//context
import { ThemeContext } from "../context/theme/index.js";

export default function Mint() {

    const {theme} = useContext(ThemeContext);
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const alertMintDisabled = () => toast("Mint is not live yet!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: 'dark',
        toastId: 'success1',
    });

    const alertNotEA = () => toast("Only Early Adopters can mint!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: 'dark',
        toastId: 'success1',
    });

    const alertAlreadyMinted = () => toast("You've Already Minted!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: 'dark',
        toastId: 'success1',
    });

    const alertMinted = () => toast("Mint Successful!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: 'dark',
        toastId: 'success1',
    });
    const [usersAddress, setUserAddress] = useState(null);
    const [canMint, setCanMint] = useState(null);
    const [tempWhitelist, setTempWhitelist] = useState([]);
    const [password, setPassword] = useState(0);

    const connect = async() => {
        setConnecting(true);
        try {
            const publicKey = await window.ic.plug.requestConnect();
            const result = await window.ic.plug.requestBalance();
            const address = await window.ic?.plug?.getPrincipal()
            setConnected(true);
            setConnecting(false);
            } catch (e) {
            console.log(e);
        }
    }

    const verifyConnection = async () => {
        const connected = await window.ic.plug.isConnected();
        if(connected) {
            setConnected(true);
        } else {
            setConnecting(true);
            try {
                const publicKey = await window.ic.plug.requestConnect();
                const result = await window.ic.plug.requestBalance();
                const address = await window.ic?.plug?.getPrincipal();
                setConnected(true);
                setConnecting(false);
                } catch (e) {
                console.log(e);
            }
        }
      };

    //   useEffect(async () => {
    //     verifyConnection();
    //     const result = await window.ic.plug.requestBalance();
    //     setUserAddress(await window.ic?.plug?.getPrincipal());
    //   }, []);

      useEffect(async() => {
        if(tempWhitelist.length === 0){
          setTempWhitelist(data)
        } else {
            if(connected) {
                const filteredAddress = tempWhitelist.filter(address => Object.values(address).some(value=>value.includes(usersAddress.toString())));
                if (filteredAddress.length > 0) {
                    setCanMint(true);
                } else {
                    setCanMint(false);
                }
            }
        }
      }, [usersAddress, tempWhitelist])

      useEffect(() => {
          if(canMint) {
              setPassword(293192392184)
          } else {
              setPassword(0)
          }
      }, [password, canMint])

      const whitelist = ["4fcza-biaaa-aaaah-abi4q-cai"]; //for mainnet deployment
      const host = "https://4fcza-biaaa-aaaah-abi4q-cai.raw.ic0.app"; //for mainnet deployment
      let yourNft = "";
        
      const mint = async () => {
        const isconnected = await window.ic.plug.isConnected();
        if(isconnected) {
          await window.ic.plug.createAgent({whitelist, host}); //for some reason creating actor doesnt work without this?
          const Actor = await window.ic.plug.createActor({
            canisterId: whitelist[0],
            interfaceFactory: idlFactory,
          }); //this creates the actual actor pointing to our canister
          console.log('actor created');
          console.log(Actor);
          console.log(password, "password")
            let mintObj = {
                to: {
                    principal: usersAddress
                },
                metadata: []
                }
                let mintresult = await Actor.mintNFT(mintObj, password);
                alertMinted();
                if(mintresult === 9999) {
                    alertAlreadyMinted()
                }
                console.log(mintresult, "mintResult");
                yourNft = tokenIdentifier("4fcza-biaaa-aaaah-abi4q-cai", mintresult);
        }
      }

    return (
        <Box className="mint-wrap-blue">
                <div className='mint-content'>
                        <h2 className='mint-collect-text'>Collect Early Adopter Card</h2>
                        <div className='mint-button hover' style={{backgroundColor: theme === '#6bcb77' ? '#6bcb77' : theme === '#ff6b6b' ? '#ff6b6b' : theme === '#4d96ff' ? '#4d96ff' : theme === '#ffd93d' ? '#ffd93d' : theme === '#595959' ? '#595959' : theme === '#8f6bcb' ? '#8f6bcb' : ''}} onClick={() => { window.open(`https://entrepot.app/marketplace/finterest-ea`) }}>
                            <h3 className='mint-button-text'>Collect</h3>
                        </div>
                </div>
                <div className='pass-wrap'>
                    <img className='pass' src={Card} alt="card for early adopters" />
                </div>
        </Box>
    )
}