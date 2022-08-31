import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { idlFactory } from "./finrisk";
import { idlFactory as idlFactory2 } from "./modals/ficp";

//material
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import Skeleton from "@mui/material/Skeleton";
import { makeStyles } from "@material-ui/core";
import {Actor, HttpAgent} from "@dfinity/agent";

//context
import { ThemeContext } from "../context/theme/index.js";

//components
import BitcoinBorrow from "./modals/BitcoinBorrow";
import ICPBorrow from "./modals/ICPBorrow";
import BitcoinSupply from "./modals/BitcoinSupply.jsx";
import ICPSupply from "./modals/ICPSupply.jsx";
import USDCBorrow from "./modals/USDCBorrow.jsx";
import USDCSupply from "./modals/USDCSupply.jsx";
import XTCBorrow from "./modals/XTCBorrow.jsx";
import XTCSupply from "./modals/XTCSupply.jsx";

//toasts
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//assets
import Bitcoin from "../../assets/bitcoin.svg";
import ICPLogoCircle from "../../assets/icpLogoCircle.svg";
import USDCLogo from "../../assets/usdcLogo.svg";
import { useParams } from "react-router-dom";
import XTCLogo from "../../assets/cyclesBottomDash.svg";
import Supernova from "./modals/Supernova";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function DashBottom({setSelectedPrincipal, setCurrentBorrow}, params) {
  const { theme } = useContext(ThemeContext);

  const [supernovaModal, setSupernovaModal] = useState(false);

  const [supplyModal, setSupplyModal] = useState(false);
  const [borrowModal, setBorrowModal] = useState(false);

  const [supplyModalICP, setSupplyModalICP] = useState(false);
  const [borrowModalICP, setBorrowModalICP] = useState(false);

  const [supplyModalUSDC, setSupplyModalUSDC] = useState(false);
  const [borrowModalUSDC, setBorrowModalUSDC] = useState(false);

  const [supplyModalXTC, setSupplyModalXTC] = useState(false);
  const [borrowModalXTC, setBorrowModalXTC] = useState(false);

  const supplyOpen = () => setSupplyModal(true);
  const supplyClose = () => setSupplyModal(false);

  const borrowOpen = () => setBorrowModal(true);
  const borrowClose = () => setBorrowModal(false);

  const supplyOpenICP = () => setSupplyModalICP(true);
  const supplyCloseICP = () => setSupplyModalICP(false);

  const borrowOpenICP = () => setBorrowModalICP(true);
  const borrowCloseICP = () => setBorrowModalICP(false);

  const supplyOpenUSDC = () => setSupplyModalUSDC(true);
  const supplyCloseUSDC = () => setSupplyModalUSDC(false);

  const supernovaOpen = () => setSupernovaModal(true);
  const supernovaClose = () => setSupernovaModal(false);

  const borrowOpenUSDC = () => setBorrowModalUSDC(true);
  const borrowCloseUSDC = () => setBorrowModalUSDC(false);

  const supplyOpenXTC = () => setSupplyModalXTC(true);
  const supplyCloseXTC = () => setSupplyModalXTC(false);

  const borrowOpenXTC = () => setBorrowModalXTC(true);
  const borrowCloseXTC = () => setBorrowModalXTC(false);

  const classes = useStyles();
  const [connected, setConnected] = useState(false);
  const [value, setValue] = useState("supply");
  const [ICPBalance, setICPBalance] = useState(null);
  const [supplyNumber, setSupplyNumber] = useState(0);
  const [principal, setPrincipal] = useState(null);
  const [stateEffect, setStateEffect] = useState(false);
  const [normalPrinc, setNormalPrinc] = useState(null);
  const [borrowLimit, setBorrowLimit] = useState(null);
  const [supplyingAmount, setSupplyingAmount] = useState(null);
  const [borrowingAmount, setBorrowingAmount] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setSupernovaModal(true)
  }, [])

  const verifyConnection = async () => {
    const connected = await window.ic.plug.isConnected();
    if (connected) {
      setConnected(true);
    } else {
      try {
        const publicKey = await window.ic.plug.requestConnect();
        const result = await window.ic.plug.requestBalance();
        const address = await window.ic?.plug?.getPrincipal();
        setPrincipal(address.toString());
        setNormalPrinc(address);
        setSelectedPrincipal(address);
        setICPBalance(result[0].amount.toFixed(2));
        setConnected(true);
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(async () => {
    verifyConnection();
    const result = await window.ic.plug.requestBalance();
    const address = await window.ic?.plug?.getPrincipal();
    setPrincipal(address.toString());
    setNormalPrinc(address);
    setSelectedPrincipal(address);
    setICPBalance(result[0].amount.toFixed(2));
  }, []);

  const [netapy, setApy] = useState(null);
  const [borrow, setB] = useState(null);
  const [lending, setL] = useState(null);
  const [supplyApy, setSupplyApy] = useState(null);
  const [borrowApy, setBorrowApy] = useState(null);
  const [icpPrice, setIcpPrice] = useState(null);
  const [currentBorrowPercentage, setCurrentBorrowPercentage] = useState(null);
  const [currentDollarAmount, setCurrentDollarAmount] = useState(null);

  const setStats = (apy, borr, len) => {
    setApy(apy)
    setB(borr)
    setL(len)
  }

  useEffect(async () => {
    const canisterId = "fggox-qyaaa-aaaah-abkbq-cai";

    const agent = new HttpAgent({
        host: "https://fggox-qyaaa-aaaah-abkbq-cai.raw.ic0.app",
    });
    const anoactor = Actor.createActor(idlFactory, {
        agent,
        canisterId,
    });
    if(normalPrinc != null && normalPrinc != undefined) {
      try {
        let limit = await anoactor.getBorrowLimit(normalPrinc);
        let limitok = Number(limit.ok.fiat.SingleMarket) * Number(limit.ok.liquidity) / 100000000
        setBorrowLimit((limitok / 10000000000000000000000000000).toFixed(2))
        let icpPrice = await anoactor.getPrices();
        setIcpPrice(icpPrice[0][1])
      } catch(e) {
        console.log(e)
      }
    }
    setStateEffect(!stateEffect)
}, [stateEffect, normalPrinc]);

useEffect(async () => {
  const canisterId = "demt4-4aaaa-aaaah-abkxa-cai";

  const agent = new HttpAgent({
      host: "https://demt4-4aaaa-aaaah-abkxa-cai.raw.ic0.app",
  });
  const anoactor = Actor.createActor(idlFactory2, {
      agent,
      canisterId,
  });
  if(normalPrinc != null && normalPrinc != undefined) {
    try {
      let result = await anoactor.getSupplyBorrowRate();
      setSupplyApy((Number(result[0]) / 10000000000000000).toFixed(2));
      setBorrowApy((Number(result[1]) / 10000000000000000).toFixed(2));
      let supplying = await anoactor.getLendingBal(normalPrinc);
      setSupplyingAmount(supplying / 100000000);
      let borrowing = await anoactor.getBorrowBal(normalPrinc);
      setBorrowingAmount((borrowing / 1000000000000000000).toFixed(2));
    } catch(e) {
      console.log(e)
    }
  }
  setStateEffect(!stateEffect)
}, [normalPrinc, stateEffect]);

  const setMax = (e) => {
    e.preventDefault();
    setSupplyNumber(ICPBalance);
  };

  useEffect(() => {
    if(icpPrice && borrowingAmount && borrowLimit) {
      let tempAmount = (icpPrice * borrowingAmount);
      let percentage = ((tempAmount / borrowLimit) * 100).toFixed(2);
      setCurrentBorrowPercentage(percentage);
      setCurrentDollarAmount(tempAmount);
      setCurrentBorrow(percentage)
    }
  }, [icpPrice, borrowingAmount, borrowLimit])

  return (
    <>
      <ToastContainer
        progressStyle={{
          background: `${theme}`,
        }}
        closeOnClick
      />
      <Box className="dashbottom-wrap">
        {supernovaModal === true && (
          <Supernova supernovaOpen={supernovaOpen} supernovaClose={supernovaClose} setSupernovaModal={setSupernovaModal} />
        )}
        <BitcoinBorrow borrowModal={borrowModal} borrowClose={borrowClose} />
        <ICPBorrow
          ICPBalance={ICPBalance}
          borrowModalICP={borrowModalICP}
          borrowCloseICP={borrowCloseICP}
          principal={principal}
          borrowLimit={borrowLimit}
          supplyApy={supplyApy}
          borrowApy={borrowApy}
          supplyingAmount={supplyingAmount}
          borrowingAmount={borrowingAmount}
          icpPrice={icpPrice}
          currentDollarAmount={currentDollarAmount}
          currentBorrowPercentage={currentBorrowPercentage}
        />
        <BitcoinSupply
          supplyModal={supplyModal}
          supplyClose={supplyClose}
          connected={connected}
          ICPBalance={ICPBalance}
          principal={principal}
        />
        <ICPSupply
          supplyModalICP={supplyModalICP}
          supplyCloseICP={supplyCloseICP}
          connected={connected}
          ICPBalance={ICPBalance}
          principal={principal}
          borrowLimit={borrowLimit}
          supplyApy={supplyApy}
          borrowApy={borrowApy}
          supplyingAmount={supplyingAmount}
          currentDollarAmount={currentDollarAmount}
          icpPrice={icpPrice}
          currentBorrowPercentage={currentBorrowPercentage}
        />
        <USDCBorrow
          borrowModalUSDC={borrowModalUSDC}
          borrowCloseUSDC={borrowCloseUSDC}
          ICPBalance={ICPBalance}
          principal={principal}
        />
        <XTCBorrow
          borrowModalXTC={borrowModalXTC}
          borrowCloseXTC={borrowCloseXTC}
          ICPBalance={ICPBalance}
          principal={principal}
        />
        <USDCSupply
          supplyModalUSDC={supplyModalUSDC}
          supplyCloseUSDC={supplyCloseUSDC}
          connected={connected}
          ICPBalance={ICPBalance}
          principal={principal}
        />
        <XTCSupply
          supplyModalXTC={supplyModalXTC}
          supplyCloseXTC={supplyCloseXTC}
          connected={connected}
          ICPBalance={ICPBalance}
          principal={principal}
        />

        <Box className="dashbottom-top">
        <Box
          className="dashbottom-box-top"
        >
          <Box>
            <Box>
              <h2 className="markets-title">Supplying</h2>
            </Box>
            <Divider />
            <Box className="dashbottom-labelrow">
              <Box className="labelrow-asset">
                <h5 className="labelrow-text">Asset</h5>
              </Box>
              <Box className="labelrow-apy">
                <h5 className="labelrow-text">APY/Earned</h5>
              </Box>
              <Box className="labelrow-wallet">
                <h5 className="labelrow-text">Balance</h5>
              </Box>
              <Box className="labelrow-collateral">
                <h5 className="labelrow-text">Collateral</h5>
              </Box>
            </Box>
            <Divider />
            <Box className="dashbottom-assetrow">
              <Box className="assetrow-asset hover" onClick={supplyOpenICP}>
                <img
                  className="bitcoin-logo"
                  src={ICPLogoCircle}
                  alt="bitcoin icon"
                />
                <h5 className="assetrow-text-btc">ICP</h5>
              </Box>
              <Box className="positionrow-apy hover" onClick={supplyOpenICP}>
                {supplyApy != null && supplyApy != undefined ? (
                  <h5 className="assetrow-text">{supplyApy}%</h5>
                ) : (
                  <Skeleton style={{ width: "50px" }} />
                )}
                <h5 className="earned-text">TBD</h5>
              </Box>
              <Box className="positionrow-wallet hover" onClick={supplyOpenICP}>
                {supplyingAmount != null && supplyingAmount != undefined ? (
                  <h5 className="assetrow-text">{supplyingAmount.toFixed(2)} ICP</h5>
                ) : (
                  <Skeleton style={{width: '50px'}} />
                )}
                {icpPrice && supplyingAmount ? (
                  <h5 className="earned-balance-text">${(icpPrice * supplyingAmount).toFixed(2)}</h5>
                ) : (
                  <Skeleton style={{width: '50px'}} />
                )}
              </Box>
              <Box className="assetrow-collateral">
                <Switch defaultChecked />
              </Box>
            </Box>

            
          </Box>
        </Box>
        <Box
          className="dashbottom-box-top"
        >
          <Box>
            <Box>
              <h2 className="markets-title">Borrowing</h2>
            </Box>
            <Divider />
            <Box className="dashbottom-labelrow">
              <Box className="labelrow-asset">
                <h5 className="labelrow-text">Asset</h5>
              </Box>
              <Box className="labelrow-apy">
                <h5 className="labelrow-text">APY/Accrued</h5>
              </Box>
              <Box className="labelrow-wallet">
                <h5 className="labelrow-text">Balance</h5>
              </Box>
              <Box className="labelrow-collateral">
                <h5 className="labelrow-text">% of Limit</h5>
              </Box>
            </Box>
            <Divider />
            <Box className="dashbottom-assetrow">
              <Box className="assetrow-asset hover" onClick={borrowOpenICP}>
                <img
                  className="bitcoin-logo"
                  src={ICPLogoCircle}
                  alt="icp icon"
                />
                <h5 className="assetrow-text-icp">ICP</h5>
              </Box>
              <Box className="positionrow-apy hover" onClick={borrowOpenICP}>
                {borrowApy != null && borrowApy != undefined ? (
                  <h5 className="assetrow-text">{borrowApy}%</h5>
                ) : (
                  <Skeleton style={{ width: "50px" }} />
                )}
                <h5 className="earned-text">TBD</h5>
              </Box>
              <Box className="positionrow-wallet hover" onClick={borrowOpenICP}>
                {borrowingAmount != null && borrowingAmount != undefined ? (
                  <h5 className="assetrow-text">{borrowingAmount} ICP</h5>
                ) : (
                  <Skeleton style={{width: '50px'}} />
                )}
                {icpPrice && borrowingAmount ? (
                  <h5 className="earned-balance-text">${(icpPrice * borrowingAmount).toFixed(2)}</h5>
                ) : (
                  <Skeleton style={{width: '50px'}} />
                )}
              </Box>
              <Box className="assetrow-collateral-right hover" onClick={borrowOpenICP}>
                {currentBorrowPercentage ? (
                  <h5 className="assetrow-text">{currentBorrowPercentage}%</h5>
                ) : (
                  <Skeleton style={{width: '50px'}} />
                )}
              </Box>
            </Box>

            
          </Box>
          </Box>        
        </Box>
        

        <Box className="dashbottom-bottom">
        <Box
          className="dashbottom-box"
        >
          <Box>
            <Box>
              <h2 className="markets-title-small">All Supply Markets</h2>
            </Box>
            <Divider />
            <Box className="dashbottom-labelrow">
              <Box className="labelrow-asset">
                <h5 className="labelrow-text">Asset</h5>
              </Box>
              <Box className="labelrow-apy">
                <h5 className="labelrow-text">APY</h5>
              </Box>
              <Box className="labelrow-wallet">
                <h5 className="labelrow-text">Wallet</h5>
              </Box>
              <Box className="labelrow-collateral">
                <h5 className="labelrow-text">Collateral</h5>
              </Box>
            </Box>
            <Divider />
            <Box className="dashbottom-assetrow">
              <Box className="assetrow-asset hover" onClick={supplyOpen}>
                <img
                  className="bitcoin-logo"
                  src={Bitcoin}
                  alt="bitcoin icon"
                />
                <h5 className="assetrow-text-btc">Bitcoin (BTC)</h5>
              </Box>
              <Box className="assetrow-apy hover" onClick={supplyOpen}>
                {supplyApy != null && supplyApy != undefined ? (
                  <h5 className="assetrow-text">1.69%</h5>
                ) : (
                  <Skeleton style={{ width: "50px" }} />
                )}
              </Box>
              <Box className="assetrow-wallet hover" onClick={supplyOpen}>
                {ICPBalance != null && ICPBalance != undefined ? (
                  <h5 className="assetrow-text">0 BTC</h5>
                ) : (
                  <Skeleton style={{ width: "50px" }} />
                )}
              </Box>
              <Box className="assetrow-collateral">
                <Switch />
              </Box>
            </Box>     

            <Box className="dashbottom-assetrow">
              <Box className="assetrow-asset hover" onClick={supplyOpenXTC}>
                <img
                  className="bitcoin-logo"
                  src={XTCLogo}
                  alt="cycles icon"
                />
                <h5 className="assetrow-text-icp">Cycles (XTC)</h5>
              </Box>
              <Box className="assetrow-apy hover" onClick={supplyOpenXTC}>
                {supplyApy != null && supplyApy != undefined ? (
                  <h5 className="assetrow-text">{supplyApy}%</h5>
                ) : (
                  <Skeleton style={{ width: "50px" }} />
                )}
              </Box>
              <Box className="assetrow-wallet hover" onClick={supplyOpenXTC}>
                {ICPBalance ? (
                  <h5 className="assetrow-text">0 XTC</h5>
                ) : (
                  <Skeleton style={{ width: "50px" }} />
                )}
              </Box>
              <Box className="assetrow-collateral">
                <Switch defaultChecked />
              </Box>
            </Box>

            <Box className="dashbottom-assetrow">
              <Box className="assetrow-asset hover" onClick={supplyOpenICP}>
                <img
                  className="bitcoin-logo"
                  src={ICPLogoCircle}
                  alt="icp icon"
                />
                <h5 className="assetrow-text-icp">ICP</h5>
              </Box>
              <Box className="assetrow-apy hover" onClick={supplyOpenICP}>
                {supplyApy != null && supplyApy != undefined ? (
                  <h5 className="assetrow-text">{supplyApy}%</h5>
                ) : (
                  <Skeleton style={{ width: "50px" }} />
                )}
              </Box>
              <Box className="assetrow-wallet hover" onClick={supplyOpenICP}>
                {ICPBalance ? (
                  <h5 className="assetrow-text">{ICPBalance} ICP</h5>
                ) : (
                  <Skeleton style={{ width: "50px" }} />
                )}
              </Box>
              <Box className="assetrow-collateral">
                <Switch defaultChecked />
              </Box>
            </Box>

            <Box className="dashbottom-assetrow">
              <Box className="assetrow-asset hover" onClick={supplyOpenUSDC}>
                <img className="bitcoin-logo" src={USDCLogo} alt="usdc icon" />
                <h5 className="assetrow-text-icp">USDC</h5>
              </Box>
              <Box className="assetrow-apy hover" onClick={supplyOpenUSDC}>
                {supplyApy != null && supplyApy != undefined ? (
                  <h5 className="assetrow-text">1.69%</h5>
                ) : (
                  <Skeleton style={{ width: "50px" }} />
                )}
              </Box>
              <Box className="assetrow-wallet hover" onClick={supplyOpenUSDC}>
                {ICPBalance != null && ICPBalance != undefined ? (
                  <h5 className="assetrow-text">0 USDC</h5>
                ) : (
                  <Skeleton style={{ width: "50px" }} />
                )}
              </Box>
              <Box className="assetrow-collateral">
                <Switch />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          className="dashbottom-box"
        >
          <Box>
            <Box>
              <h2 className="markets-title-small">All Borrow Markets</h2>
            </Box>
            <Divider />
            <Box className="dashbottom-labelrow">
              <Box className="labelrow-asset">
                <h5 className="labelrow-text">Asset</h5>
              </Box>
              <Box className="labelrow-apy">
                <h5 className="labelrow-text">APY</h5>
              </Box>
              <Box className="labelrow-wallet">
                <h5 className="labelrow-text">Wallet</h5>
              </Box>
              <Box className="labelrow-collateral">
                <h5 className="labelrow-text">Liquidity</h5>
              </Box>
            </Box>
            <Divider />
            <Box className="dashbottom-assetrow">
              <Box className="assetrow-asset hover" onClick={borrowOpen}>
                <img
                  className="bitcoin-logo"
                  src={Bitcoin}
                  alt="bitcoin icon"
                />
                <h5 className="assetrow-text-btc">Bitcoin (BTC)</h5>
              </Box>
              <Box className="assetrow-apy hover" onClick={borrowOpen}>
                {borrowApy != null && borrowApy != undefined ? (
                  <h5 className="assetrow-text">9.20%</h5>
                ) : (
                  <Skeleton style={{ width: "50px" }} />
                )}
              </Box>
              <Box className="assetrow-wallet hover" onClick={borrowOpen}>
                {ICPBalance != null && ICPBalance != undefined ? (
                  <h5 className="assetrow-text">0 BTC</h5>
                ) : (
                  <Skeleton style={{ width: "50px" }} />
                )}
              </Box>
              <Box className="assetrow-collateral-right hover" onClick={borrowOpen}>
                <h5 className="assetrow-text">1.77M</h5>
              </Box>
            </Box>
            <Box className="dashbottom-assetrow">
              <Box className="assetrow-asset hover" onClick={borrowOpenXTC}>
                <img
                  className="bitcoin-logo"
                  src={XTCLogo}
                  alt="cycles icon"
                />
                <h5 className="assetrow-text-btc">Cycles (XTC)</h5>
              </Box>
              <Box className="assetrow-apy hover" onClick={borrowOpenXTC}>
                {borrowApy != null && borrowApy != undefined ? (
                  <h5 className="assetrow-text">9.20%</h5>
                ) : (
                  <Skeleton style={{ width: "50px" }} />
                )}
              </Box>
              <Box className="assetrow-wallet hover" onClick={borrowOpenXTC}>
                {ICPBalance != null && ICPBalance != undefined ? (
                  <h5 className="assetrow-text">0 XTC</h5>
                ) : (
                  <Skeleton style={{ width: "50px" }} />
                )}
              </Box>
              <Box className="assetrow-collateral-right hover" onClick={borrowOpenXTC}>
                <h5 className="assetrow-text">1.77M</h5>
              </Box>
            </Box>

            <Box className="dashbottom-assetrow hover">
              <Box className="assetrow-asset hover" onClick={borrowOpenICP}>
                <img
                  className="bitcoin-logo"
                  src={ICPLogoCircle}
                  alt="icp icon"
                />
                <h5 className="assetrow-text-icp">ICP</h5>
              </Box>
              <Box className="assetrow-apy hover" onClick={borrowOpenICP}>
                {borrowApy != null && borrowApy != undefined ? (
                  <h5 className="assetrow-text">{borrowApy}%</h5>
                ) : (
                  <Skeleton style={{ width: "50px" }} />
                )}
              </Box>
              <Box className="assetrow-wallet hover" onClick={borrowOpenICP}>
                  {ICPBalance ? (
                <h5 className="assetrow-text">{ICPBalance} ICP</h5>
                  ) : (
                    <Skeleton style={{ width: "50px" }} /> 
                  )}
              </Box>
              <Box className="assetrow-collateral-right hover" onClick={borrowOpenICP}>
                <h5 className="assetrow-text">4.22M</h5>
              </Box>
            </Box>
            <Box className="dashbottom-assetrow">
              <Box className="assetrow-asset hover" onClick={borrowOpenUSDC}>
                <img className="bitcoin-logo" src={USDCLogo} alt="usdc icon" />
                <h5 className="assetrow-text-icp">USDC</h5>
              </Box>
              <Box className="assetrow-apy hover" onClick={borrowOpenUSDC}>
                {borrowApy != null && borrowApy != undefined ? (
                  <h5 className="assetrow-text">9.20%</h5>
                ) : (
                  <Skeleton style={{ width: "50px" }} />
                )}
              </Box>
              <Box className="assetrow-wallet hover" onClick={borrowOpenUSDC}>
                {ICPBalance != null && ICPBalance != undefined ? (
                  <h5 className="assetrow-text">0 USDC</h5>
                ) : (
                  <Skeleton style={{ width: "50px" }} />
                )}
              </Box>
              <Box className="assetrow-collateral-right hover" onClick={borrowOpenUSDC}>
                <h5 className="assetrow-text">5.42M</h5>
              </Box>
            </Box>
          </Box>
          </Box>        
        </Box>
      </Box>
    </>
  );
}

const useStyles = makeStyles({
  customStyleOnTab: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#3D3D3D",
    fontFamily: "Red Hat Display",
  },
  activeTab: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#3D3D3D",
  },
  tabLabel: {
    color: "#3D3D3D",
    fontSize: "15px",
    fontWeight: 500,
    lineHeight: "20px",
    fontFamily: "sans-serif",
  },
});
