import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import Logo from "../../assets/newLogo.svg";
import {StoicIdentity} from "ic-stoic-identity";
import {idlFactory} from "./ledger";
import {idlFactory as idlFactory2} from "./modals/ficp";
import {Finrisk} from "./finrisk";

import "../style/main.css";

//assets
import ICPLogo from "../../assets/icpLogo.png";
import Arrow from "../../assets/dropArrow.svg";


//material
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Principal } from '@dfinity/principal';
import {Actor, HttpAgent} from "@dfinity/agent";

//toasts
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//color picker
import { CirclePicker } from "react-color";

//context
import { ThemeContext } from "../context/theme/index.js";

export default function Navbar() {
  //Color picker
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [picking, setPicking] = useState(false);
  const [wallet, setWallet] = useState("NONE");
  const [fICP, setFICPActor] = useState(null);

  const themeSetter = (color) => {
    toggleTheme(color);
    setPicking(false);
  };

  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [ICPBalance, setICPBalance] = useState(null);
  const [principle, setPrinciple] = useState(null);

  let navigate = useNavigate();

  const connect = async () => {
    try {
      const publicKey = await window.ic.plug.requestConnect();
      const result = await window.ic.plug.requestBalance();
      const address = await window.ic?.plug?.getPrincipal();
      setPrinciple(address.toString());
      setICPBalance(result[0].amount.toFixed(2));
      setWallet("PLUG")
      setConnected(true);
    } catch (e) {
      console.log(e);
    }
  };

  // const connectStoic = async () => {
  //   await StoicIdentity.load().then(async (identity) => {
  //     if (identity !== false) {
  //       //ID is a already connected wallet!
  //     } else {
  //       //No existing connection, lets make one!
  //       identity = await StoicIdentity.connect();
  //     }
  //     //Lets display the connected principal!
  //     const address = identity.getPrincipal().toText();
  //     const arr = JSON.parse(await identity.accounts());

  //     let agent =  new HttpAgent({
  //       host: "https://ryjl3-tyaaa-aaaaa-aaaba-cai.raw.ic0.app",
  //       identity,
  //     })
  //     let canisterId = "ryjl3-tyaaa-aaaaa-aaaba-cai"
  //     const ledger = Actor.createActor(idlFactory, {
  //       agent,
  //       canisterId,
  //   });

  //   const buffer = Buffer.from(arr[0]["address"], "hex");
  //   let array = Array.from(
  //     new Uint8Array(buffer, 0, buffer.length)
  //   );
  //     let accArgs = {
  //       account: array
  //     }

  //     console.log(accArgs)

  //     let result = await ledger.account_balance(accArgs)
  //     console.log(result)
  //     let n = Number(result["e8s"]) / 100000000
  //     console.log(n)
  //     setICPBalance(n.toFixed(2))
  //     setPrinciple(address)

  //     const canisterId2 = "demt4-4aaaa-aaaah-abkxa-cai";
  
  //     const agent2 = new HttpAgent({
  //         host: "https://fdemt4-4aaaa-aaaah-abkxa-cai.raw.ic0.app",
  //         identity,
  //     });
  //     const anoactor = Actor.createActor(idlFactory2, {
  //         agent2,
  //         canisterId2,
  //     });
  //     setFICPActor(anoactor)
  //     update("STOIC", fICP, address)
  //     setWallet("STOIC");
  //     setConnected(true)


  //  });
  // };

  const verifyConnection = async () => {
    const connected = await window.ic.plug.isConnected();
    if (connected) {
      setConnected(true);
    } else {
      setConnecting(true);
      try {
        const publicKey = await window.ic.plug.requestConnect();
        const result = await window.ic.plug.requestBalance();
        const address = await window.ic?.plug?.getPrincipal();
        setPrinciple(address.toString());
        setICPBalance(result[0].amount.toFixed(2));
        setConnected(true);
        setConnecting(false);
      } catch (e) {
        console.log(e);
      }
    }
  };
  useEffect(async () => {
    verifyConnection();
    const result = await window.ic.plug.requestBalance();
    const address = await window.ic?.plug?.getPrincipal();
    setPrinciple(address.toString());
    setICPBalance(result[0].amount.toFixed(2));
  }, []);

  function shorten(str) {
    if (str.length < 10) return str;
    return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
  }

  //dropdown
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dropOpen = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

    //dropdown wallets
    const [anchorElTwo, setAnchorElTwo] = React.useState(null);
    const dropOpenTwo = Boolean(anchorElTwo);
    const handleClickWallets = (event) => {
      setAnchorElTwo(event.currentTarget);
    };
    const handleCloseWallet = () => {
      setAnchorElTwo(null);
    };

  return (
    <>
      <Box className="nav-wrap-dash">
        <img
          onClick={() => {
            navigate("/");
          }}
          className="logo-nav-dash"
          src={Logo}
          alt="brand logo for finterest"
        />

        <Box className="nav-color-wrap-dash">
          {!connected ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Box
                className="app-button-dash"
                style={{ borderRadius: "25px", border: `2px solid ${theme}` }}
              >
                <h3
                  className="app-button-text"
                  style={{ color: `${theme}` }}
                  onClick={handleClickWallets}
                >
                  {connecting ? "Connecting" : "Connect"}
                </h3>
                <Menu
                      id="basic-menu"
                      anchorEl={anchorElTwo}
                      open={dropOpenTwo}
                      onClose={handleCloseWallet}
                    >
                      <MenuItem onClick={connect} sx={{fontFamily: 'Red Hat Display, sans-serif'}}>Plug</MenuItem>
                    </Menu>
              </Box>
            </Box>
          ) : (
            <Box className="dash-nav-boxwrap">
              <Box
                className="dash-nav-box"
                style={{
                  backgroundColor:
                    theme === "#6bCb77"
                      ? "#CAEDCF"
                      : theme === "#4d96ff"
                      ? "#D3EAFA"
                      : theme === "#ff6b6b"
                      ? "#FAD3D3"
                      : theme === "#595959"
                      ? "#E1E1E1"
                      : theme === "#ffd93d"
                      ? "#F7E4A2"
                      : theme === "#8f6bcb"
                      ? "#d4bbfc"
                      : "",
                  transition: "var(--transition)",
                  opacity: 0.8,
                  borderRadius: "25px",
                }}
              >
                {ICPBalance ? (
                  <>
                    <h3 className="balance-text">{ICPBalance}</h3>
                    <Box sx={{ marginTop: "6px", marginLeft: "5%" }}>
                      <img
                        style={{ height: "12px", width: "22px" }}
                        src={ICPLogo}
                        alt="icp branding"
                      />
                    </Box>
                  </>
                ) : (
                  <>
                    <Skeleton
                      variant="circular"
                      width={40}
                      height={40}
                      style={{ marginTop: "4%", width: "30px", height: "30px" }}
                    />
                  </>
                )}
              </Box>
              <Box
                className="dash-nav-box"
                style={{
                  backgroundColor:
                    theme === "#6bCb77"
                      ? "#CAEDCF"
                      : theme === "#4d96ff"
                      ? "#D3EAFA"
                      : theme === "#ff6b6b"
                      ? "#FAD3D3"
                      : theme === "#595959"
                      ? "#E1E1E1"
                      : theme === "#ffd93d"
                      ? "#F7E4A2"
                      : theme === "#8f6bcb"
                      ? "#d4bbfc"
                      : "",
                  transition: "var(--transition)",
                  opacity: 0.8,
                  borderRadius: "25px",
                }}
              >
                {principle ? (
                  <>
                    <h3 className="balance-text">
                      {shorten(principle)}{" "}
                      <span onClick={handleClick}>
                          {dropOpen ? (
                            <img className="hover" src={Arrow} alt="arrow" style={{transform: 'scaleY(-1)', transition: "var(--transition)"}} />
                          ) : (
                            <img className="hover" src={Arrow} alt="arrow" style={{transition: "var(--transition)"}} />
                          )}
                      </span>
                    </h3>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={dropOpen}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={() => navigate('/dashboard')} sx={{fontFamily: 'Red Hat Display, sans-serif'}}>Dashboard</MenuItem>
                      <MenuItem onClick={() => navigate('/history')} sx={{fontFamily: 'Red Hat Display, sans-serif'}}>History</MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Skeleton
                      variant="circular"
                      width={40}
                      height={40}
                      style={{ marginTop: "4%", width: "30px", height: "30px" }}
                    />
                  </>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}


