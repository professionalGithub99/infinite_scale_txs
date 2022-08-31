import React, { useState, useEffect, useContext } from "react";

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
import Bitcoin from "../../../assets/bitcoin.svg";
import Close from "../../../assets/closeNew.png";
import ViewIcon from "../../../assets/viewIcon.png";
import FinterestLogo from "../../../assets/finalLogo.svg";
import USDCLogo from "../../../assets/usdcLogo.svg";

export default function USDCBorrow(params) {

    const classes = useStyles();
    const {theme} = useContext(ThemeContext);

    const [borrowNumber, setBorrowNumber] = useState(0);
    const [value, setValue] = useState('supply');
    const [tempTab, setTempTab] = useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    function a11yProps(index) {
      return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
      };
    }

    const alertBorrowing = () => toast("Borrowing Coming Soon!", {
      position: toast.POSITION.BOTTOM_RIGHT,
      theme: 'dark'
    });
  
    const alertRepay = () => toast("Nothing to Repay!", {
      position: toast.POSITION.BOTTOM_RIGHT,
      theme: 'dark'
    });
    
  return (
    <Box>
      <Modal
        open={params.borrowModalUSDC}
        onClose={params.borrowCloseUSDC}
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
                onClick={params.borrowCloseUSDC}
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
                value={borrowNumber}
                min="0"
                maxLength="3"
                placeholder="0"
                onChange={(e) => {
                  setBorrowNumber(e.target.value);
                }}
              />
            </Box>
            <Box className="input-modal-box-right">
              <Box className="icplogo-modal"></Box>
              <h4 className="max-button-modal hover">80% Limit</h4>
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
                  label={<span className={classes.tabLabel}>Borrow</span>}
                  {...a11yProps(0)}
                />
                <Tab
                  sx={{ width: "50%" }}
                  value="withdraw"
                  label={<span className={classes.tabLabel}>Repay</span>}
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
                    <h3 className="supply-rates-text">Borrow Rates</h3>
                    <Box className="view-icon-wrap">
                      <img src={ViewIcon} alt="view source icon" />
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
                      <h3 className="supply-apy-text">Borrow APY</h3>
                    </Box>
                    <Box className="bar-modal-right">
                      <h3 className="supply-apy-number">9.02%</h3>
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

                  {borrowNumber != 0 ? (
                    <Box
                      className="supply-button hover"
                      onClick={alertBorrowing}
                      style={{
                        borderRadius: "25px",
                        backgroundColor: `${theme}`,
                      }}
                    >
                      <h3 className="supply-button-text">Borrow</h3>
                    </Box>
                  ) : (
                    <Box
                      className="supply-button-grey hover"
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
                      <h3 className="wallet-balance">Currently Borrowing</h3>
                    </Box>

                      <Box className="box-balance">
                        <h3 className="balance-text-new-borrow">0 BTC</h3>
                      </Box>
                  </Box>
                </Box>
              </TabPanel>

              <TabPanel
                value="withdraw"
                index={1}
                style={{ background: "#FFFFFF", borderRadius: ".5rem" }}
              >
                {tempTab === 1 ? (
                  <Box>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <h3 className="supply-rates-text">Borrow Rates</h3>
                      <Box className="view-icon-wrap">
                        <img src={ViewIcon} alt="view source icon" />
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
                        <h3 className="supply-apy-text">Borrow APY</h3>
                      </Box>
                      <Box className="bar-modal-right">
                        <h3 className="supply-apy-number">9.02%</h3>
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
                        <h3 className="supply-apy-number">302.6%</h3>
                      </Box>
                    </Box>

                    <Box>
                      <h3 className="borrow-limit-text">Borrow Limit</h3>
                    </Box>

                    <Box className="supply-wrap">
                      <Box className="bar-modal-left">
                        <h3
                          className="supply-apy-text"
                          style={{ marginLeft: 0 }}
                        >
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
                        <h3
                          className="supply-apy-text"
                          style={{ marginLeft: 0 }}
                        >
                          Borrow Limit Used
                        </h3>
                      </Box>
                      <Box className="bar-modal-right">
                        <h3 className="supply-apy-number">45%</h3>
                      </Box>
                    </Box>

                    {borrowNumber != 0 ? (
                      <Box
                        className="supply-button hover"
                        onClick={alertRepay}
                        style={{
                          borderRadius: "25px",
                          backgroundColor: `${theme}`,
                        }}
                      >
                        <h3 className="supply-button-text">Repay</h3>
                      </Box>
                    ) : (
                      <Box
                        className="supply-button-grey hover"
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
                        <h3 className="wallet-balance">Currently Borrowing</h3>
                      </Box>

                        <Box className="box-balance">
                          <h3 className="balance-text-new-borrow">0 BTC</h3>
                        </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <h3 className="supply-rates-text">Borrow Rates</h3>
                      <Box className="view-icon-wrap">
                        <img src={ViewIcon} alt="view source icon" />
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
                        <h3 className="supply-apy-text">Borrow APY</h3>
                      </Box>
                      <Box className="bar-modal-right">
                        <h3 className="supply-apy-number">9.02%</h3>
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
                    <Box
                      className="supply-button hover"
                      onClick={() => {
                        setTempTab(1);
                      }}
                      style={{
                        borderRadius: "25px",
                        backgroundColor: `${theme}`,
                      }}
                    >
                      <h3 className="supply-button-text">Enable</h3>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box className="wallet-balance-box">
                        <h3 className="wallet-balance">Currently Borrowing</h3>
                      </Box>

                        <Box className="box-balance">
                          <h3 className="balance-text-new-borrow">0 BTC</h3>
                        </Box>
                    </Box>
                  </Box>
                )}
              </TabPanel>
            </Box>
          </TabContext>
        </Box>
      </Modal>
    </Box>
  );
}

const useStyles = makeStyles({
  customStyleOnTab:{
    fontSize:'15px',
    fontWeight: 500,
    color:'#3D3D3D',
    fontFamily: 'Red Hat Display'
  },
  activeTab:{
    fontSize:'15px',
    fontWeight:'500',
    color:'#3D3D3D',
  },
  tabLabel: {
      color: '#3D3D3D',
      fontSize: '15px',
      fontWeight: 500,
      lineHeight: '20px',
      fontFamily: 'sans-serif'
  },
})