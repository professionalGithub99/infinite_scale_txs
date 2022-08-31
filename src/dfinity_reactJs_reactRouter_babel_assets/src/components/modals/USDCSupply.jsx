import React, { useState, useContext } from "react";

//material
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Modal from "@mui/material/Modal";
import Tab from "@mui/material/Tab";
import { makeStyles } from "@material-ui/core";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

//toasts
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//context
import { ThemeContext } from "../../context/theme/index.js";

//assets
import USDCLogo from "../../../assets/usdcLogo.svg";
import Close from "../../../assets/closeNew.png";
import ICPLogo from "../../../assets/icpLogo.png";
import ViewIcon from "../../../assets/viewIcon.png";
import FinterestLogo from "../../../assets/finalLogo.svg";

export default function USDCSupply(params) {

  const classes = useStyles();
  const { theme } = useContext(ThemeContext);

  const [supplyNumber, setSupplyNumber] = useState(0);
  const [value, setValue] = useState("supply");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const alertWait = () => toast("Please connect wallet or wait a moment!", {
    position: toast.POSITION.BOTTOM_RIGHT,
    theme: 'dark'
  });

  const alertLending = () => toast("Lending Coming Soon!", {
    position: toast.POSITION.BOTTOM_RIGHT,
    theme: 'dark'
  });

const alertWithdraw = () => toast("Nothing to Withdraw!", {
    position: toast.POSITION.BOTTOM_RIGHT,
    theme: 'dark'
});

const alertNoBalance = () => toast("No balance!", {
  position: toast.POSITION.BOTTOM_RIGHT,
  theme: 'dark'
});

  const setMax = (e) => {
    e.preventDefault();
    alertNoBalance();
    // if(params.connected && params.ICPBalance) {
    //   setSupplyNumber(params.ICPBalance)
    // } else {
    //   alertWait()
    // }
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <Box>
      <Modal
        open={params.supplyModalUSDC}
        onClose={params.supplyCloseUSDC}
        BackdropProps={{ style: { backgroundColor: "#3D3D3D", opacity: 0.9 } }}
      >
        <Box className="modal-wrap" style={{ borderRadius: ".5rem" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Box className="modal-top">
              <img
                className="bitcoin-modal-title"
                src={USDCLogo}
                alt="usdc icon"
              />
              <h2 className="modal-title">US Dollar Coin (USDC)</h2>
            </Box>
            <Box className="close-icon-box">
              <img
                className="hover"
                onClick={params.supplyCloseUSDC}
                src={Close}
                alt="close button"
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box className="input-modal-box"></Box>
            <Box className="input-modal-box">
              <input
                type="number"
                className="number-input-modal"
                value={supplyNumber}
                placeholder="0"
                onChange={(e) => {
                  setSupplyNumber(e.target.value);
                }}
              />
            </Box>
            <Box className="input-modal-box-right">
              <Box className="icplogo-modal">
                <img className="icp-logo-image" src={USDCLogo} alt="usdc Logo" />
              </Box>
              <h4 className="max-button-modal hover" onClick={setMax}>
                Max
              </h4>
            </Box>
          </Box>
          <TabContext value={value}>
            <Box sx={{ width: "100%" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
                TabIndicatorProps={{
                  style: {
                    backgroundColor: `${theme}`,
                    height: "5px",
                  },
                }}
              >
                <Tab
                  sx={{ width: "50%" }}
                  value="supply"
                  label={<span className={classes.tabLabel}>Supply</span>}
                  {...a11yProps(0)}
                />
                <Tab
                  sx={{ width: "50%" }}
                  value="withdraw"
                  label={<span className={classes.tabLabel}>Withdraw</span>}
                  {...a11yProps(1)}
                />
              </TabList>
            </Box>
            <Box>
              <TabPanel
                style={{ backgroundColor: "#FFFFFF", borderRadius: ".5rem" }}
                value="supply"
                index={0}
              >
                <Box>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <h3 className="supply-rates-text">Supply Rates</h3>
                    <Box className="view-icon-wrap">
                      <img
                        src={ViewIcon}
                        className="hover"
                        alt="view source icon"
                      />
                    </Box>
                  </Box>

                  <Box className="supply-wrap">
                    <Box className="bar-modal-left">
                      <Box>
                        <img
                          style={{ width: "35px", height: "35px" }}
                          src={USDCLogo}
                          alt="usdc icon"
                        />
                      </Box>
                      <h3 className="supply-apy-text">Supply APY</h3>
                    </Box>
                    <Box className="bar-modal-right">
                      <h3 className="supply-apy-number">0.06%</h3>
                    </Box>
                  </Box>

                  <Divider style={{ marginTop: "10px" }} />

                  <Box className="supply-wrap">
                    <Box className="bar-modal-left">
                      <Box>
                        <img
                          style={{ width: "35px", height: "35px" }}
                          src={FinterestLogo}
                          alt="finterest icon"
                        />
                      </Box>
                      <h3 className="supply-apy-text">Distribution APY</h3>
                    </Box>
                    <Box className="bar-modal-right">
                      <h3 className="supply-apy-number">0.06%</h3>
                    </Box>
                  </Box>

                  <Box>
                    <h3 className="borrow-limit-text">Borrow Limit</h3>
                  </Box>

                  <Box className="supply-wrap">
                    <Box className="bar-modal-left">
                      <h3 className="supply-apy-text" style={{ marginLeft: 0 }}>
                        Borrow Limit
                      </h3>
                    </Box>
                    <Box className="bar-modal-right">
                      <h3 className="supply-apy-number">
                        $0 <span style={{ color: "#6BCB77" }}>{">"}</span>{" "}
                        $30,699
                      </h3>
                    </Box>
                  </Box>

                  <Divider style={{ marginTop: "10px" }} />

                  <Box className="supply-wrap">
                    <Box className="bar-modal-left">
                      <h3 className="supply-apy-text" style={{ marginLeft: 0 }}>
                        Borrow Limit Used
                      </h3>
                    </Box>
                    <Box className="bar-modal-right">
                      <h3 className="supply-apy-number">0%</h3>
                    </Box>
                  </Box>

                  <Box className="progress-progressbarTwo">
                    {/* <ProgressBar bsPrefix={theme === '#6bcb77' ? 'progress progress-green' : theme === '#ff6b6b' ? 'progress-red' : theme === '#4d96ff' ? 'progress-blue' : theme === '#ffd93d' ? 'progress-yellow' : theme === '#595959' ? 'progress-grey' : ''} now={80} /> */}
                    <div className="Loading"></div>
                  </Box>

                  {supplyNumber != 0 ? (
                    <Box
                      className="supply-button hover"
                      onClick={alertLending}
                      style={{
                        borderRadius: "25px",
                        backgroundColor: `${theme}`,
                      }}
                    >
                      <h3 className="supply-button-text">Supply</h3>
                    </Box>
                  ) : (
                    <Box
                      className="supply-button-grey"
                      style={{ borderRadius: "25px" }}
                    >
                      <h3 className="supply-button-text">Input Amount</h3>
                    </Box>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box className="wallet-balance-box">
                      <h3 className="wallet-balance">Your Wallet Balance</h3>
                    </Box>

                      <Box className="box-balance">
                        <h3 className="balance-text-new">0</h3>
                        <Box sx={{ marginTop: "7px" }}>
                          <img
                            style={{ height: "12px", width: "22px" }}
                            src={USDCLogo}
                            alt="usdc branding"
                          />
                        </Box>
                      </Box>
                  </Box>
                </Box>
              </TabPanel>

              <TabPanel
                value="withdraw"
                index={1}
                style={{ background: "#FFFFFF", borderRadius: ".5rem" }}
              >
                <Box>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <h3 className="supply-rates-text">Supply Rates</h3>
                    <Box className="view-icon-wrap">
                      <img
                        src={ViewIcon}
                        className="hover"
                        alt="view source icon"
                      />
                    </Box>
                  </Box>

                  <Box className="supply-wrap">
                    <Box className="bar-modal-left">
                      <Box>
                        <img
                          style={{ width: "35px", height: "35px" }}
                          src={USDCLogo}
                          alt="usdc icon"
                        />
                      </Box>
                      <h3 className="supply-apy-text">Supply APY</h3>
                    </Box>
                    <Box className="bar-modal-right">
                      <h3 className="supply-apy-number">3.36%</h3>
                    </Box>
                  </Box>

                  <Divider style={{ marginTop: "10px" }} />

                  <Box className="supply-wrap">
                    <Box className="bar-modal-left">
                      <Box>
                        <img
                          style={{ width: "35px", height: "35px" }}
                          src={FinterestLogo}
                          alt="finterest icon"
                        />
                      </Box>
                      <h3 className="supply-apy-text">Distribution APY</h3>
                    </Box>
                    <Box className="bar-modal-right">
                      <h3 className="supply-apy-number">0.06%</h3>
                    </Box>
                  </Box>

                  <Box>
                    <h3 className="borrow-limit-text">Borrow Limit</h3>
                  </Box>

                  <Box className="supply-wrap">
                    <Box className="bar-modal-left">
                      <h3 className="supply-apy-text" style={{ marginLeft: 0 }}>
                        Borrow Limit
                      </h3>
                    </Box>
                    <Box className="bar-modal-right">
                      <h3 className="supply-apy-number">
                        $0 <span style={{ color: "#6BCB77" }}>{">"}</span>{" "}
                        $30,699
                      </h3>
                    </Box>
                  </Box>

                  <Divider style={{ marginTop: "10px" }} />

                  <Box className="supply-wrap">
                    <Box className="bar-modal-left">
                      <h3 className="supply-apy-text" style={{ marginLeft: 0 }}>
                        Borrow Limit Used
                      </h3>
                    </Box>
                    <Box className="bar-modal-right">
                      <h3 className="supply-apy-number">0%</h3>
                    </Box>
                  </Box>

                  <Box className="progress-progressbarTwo">
                    {/* <ProgressBar bsPrefix={theme === '#6bcb77' ? 'progress progress-green' : theme === '#ff6b6b' ? 'progress-red' : theme === '#4d96ff' ? 'progress-blue' : theme === '#ffd93d' ? 'progress-yellow' : theme === '#595959' ? 'progress-grey' : ''} now={80} /> */}
                    <div className="Loading"></div>
                  </Box>

                  {supplyNumber != 0 ? (
                    <Box
                      className="supply-button hover"
                      onClick={alertWithdraw}
                      style={{
                        borderRadius: "25px",
                        backgroundColor: `${theme}`,
                      }}
                    >
                      <h3 className="supply-button-text">Withdraw</h3>
                    </Box>
                  ) : (
                    <Box
                      className="supply-button-grey"
                      style={{ borderRadius: "25px" }}
                    >
                      <h3 className="supply-button-text">
                        No Balance to Withdraw
                      </h3>
                    </Box>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box className="wallet-balance-box">
                      <h3 className="wallet-balance">Currently Supplying</h3>
                    </Box>

                    {params.ICPBalance ? (
                      <Box className="box-balance">
                        <h3
                          className="balance-text-new"
                          style={{ marginRight: 0 }}
                        >
                          0 BTC
                        </h3>
                      </Box>
                    ) : (
                      <>
                        <Skeleton
                          variant="text"
                          style={{
                            marginTop: "5px",
                            width: "125px",
                            height: "30px",
                          }}
                        />
                      </>
                    )}
                  </Box>
                </Box>
              </TabPanel>
            </Box>
          </TabContext>
        </Box>
      </Modal>
    </Box>
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
