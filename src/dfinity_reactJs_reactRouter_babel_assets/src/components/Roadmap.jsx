import React from "react";
import "../style/main.css";

//material
import Box from "@material-ui/core/Box";

//assets
import Target from "../../assets/target.svg";
import RedTarget from "../../assets/redTarget.svg";
import GreenTarget from "../../assets/greenTarget.svg";
import YellowTarget from "../../assets/yellowTarget.svg";

export default function Roadmap() {

    return (
        <Box className="roadmap-wrap">

            <h2 className="roadmap-title">Roadmap</h2>

            <Box className="roadmap-boxwrap">
                <Box>
                    <img className="target" src={Target} alt="target bubble" />
                </Box>
                <Box className="roadmap-textwrap">
                    <h2 className="roadmap-boxtitle">April 2022</h2>
                    <h3 className="roadmap-description">Front-end development, product architecting & community building</h3>
                </Box>
            </Box>

            <Box className="roadmap-boxwrapTwo">
                <Box>
                    <img className="target" src={RedTarget} alt="target bubble" />
                </Box>
                <Box className="roadmap-textwrap">
                    <h2 className="roadmap-boxtitle">May 2022</h2>
                    <h3 className="roadmap-description">Beta smart contracts, liquidation engine, oracles, and stablecoin integration</h3>
                </Box>
            </Box>

            <Box className="roadmap-boxwrapThree">
                <Box>
                    <img className="target" src={GreenTarget} alt="target bubble" />
                </Box>
                <Box className="roadmap-textwrap">
                    <h2 className="roadmap-boxtitle">June 2022</h2>
                    <h3 className="roadmap-description">Finalized smart contracts, liquidation and oracle integration</h3>
                </Box>
            </Box>

            <Box className="roadmap-boxwrapBottom">
                <Box>
                    <img className="target" src={YellowTarget} alt="target bubble" />
                </Box>
                <Box className="roadmap-textwrap">
                    <h2 className="roadmap-boxtitle">July 2022</h2>
                    <h3 className="roadmap-description">Finterest launch with support for Bitcoin, ICP and stables</h3>
                </Box>
            </Box>

        </Box>
    )
}