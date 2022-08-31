import React from "react";
import "../style/main.css";

//material
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

//assets
import Ollie from "../../assets/olliver.svg";
import Carl from "../../assets/carlTeam.svg";
import Andres from "../../assets/andresTeam.svg";
import Austin from "../../assets/austinTeam.svg";
import Romeo from "../../assets/romeoNew.png";
import Albert from "../../assets/albert.png";
import Twitter from "../../assets/twitterTeam.svg";
import LinkedIn from "../../assets/linkedinTeam.svg";

export default function Team () {

    return (
        <Box className="team-wrap">

            <h2 className="team-title">Our Team</h2>

            <Grid container spacing={4} className="team-gridwrap">

                <Grid item className="team-boxwrap" style={{marginBottom: '2%'}}>
                    <Box className="team-imagewrap">
                        <img className="team-image" src={Ollie} alt="olliver barr" />
                    </Box>
                    <Box style={{margin: '0 auto', paddingTop: '5%'}}>
                        <h3 className="team-name">Olliver Barr</h3>
                        <h4 className="team-position">Co-Founder</h4>
                    </Box>
                    <Box className="team-socials">
                        <img className="hover" onClick={() => window.open('https://twitter.com/father_defi')} src={Twitter} alt="twitter link" />
                        <img className="hover" onClick={() => window.open('https://www.linkedin.com/in/olliverbarr/')} src={LinkedIn} alt="linkedIn link" />
                    </Box>
                </Grid>

                <Grid item className="team-boxwrap" style={{marginBottom: '2%'}}>
                    <Box className="team-imagewrap">
                        <img className="team-image" src={Carl} alt="carl sachs" />
                    </Box>
                    <Box style={{margin: '0 auto', paddingTop: '5%'}}>
                        <h3 className="team-name">Carl Sachs</h3>
                        <h4 className="team-position">Co-Founder</h4>
                    </Box>
                    <Box className="team-socials">
                        <img className="hover" onClick={() => window.open('https://twitter.com/CarlCSachs')} src={Twitter} alt="twitter link" />
                        <img className="hover" onClick={() => window.open('https://www.linkedin.com/in/carl-sachs/')} src={LinkedIn} alt="linkedIn link" />
                    </Box>
                </Grid>

                <Grid item className="team-boxwrap" style={{marginBottom: '2%'}}>
                    <Box className="team-imagewrap">
                        <img className="team-image" src={Romeo} alt="romeo castro" />
                    </Box>
                    <Box style={{margin: '0 auto', paddingTop: '5%'}}>
                        <h3 className="team-name">Romeo Castro</h3>
                        <h4 className="team-position">CFO</h4>
                    </Box>
                    <Box className="team-socials">
                        <img className="hover" onClick={() => window.open('https://www.linkedin.com/in/romeo-n-de-castro-5ab73b15/')} src={LinkedIn} alt="linkedIn link" />
                    </Box>
                </Grid>

                </Grid>

                <Grid container spacing={4} className="team-gridwrap">

                <Grid item className="team-boxwrap" style={{marginBottom: '2%'}}>
                    <Box className="team-imagewrap">
                        <img className="team-image" src={Austin} alt="austin ludwig" />
                    </Box>
                    <Box style={{margin: '0 auto', paddingTop: '5%'}}>
                        <h3 className="team-name">Austin Ludwig</h3>
                        <h4 className="team-position">Creative Strategies</h4>
                    </Box>
                    <Box className="team-socials">
                        <img className="hover" onClick={() => window.open('https://twitter.com/beefandbutter_')} src={Twitter} alt="twitter link" />
                    </Box>
                </Grid>

                <Grid item className="team-boxwrap" style={{marginBottom: '2%'}}>
                    <Box className="team-imagewrap">
                        <img className="team-image" src={Andres} alt="andres mateo" />
                    </Box>
                    <Box style={{margin: '0 auto', paddingTop: '5%'}}>
                        <h3 className="team-name">Andres Mateo La Salle</h3>
                        <h4 className="team-position">Lead Motoko Dev</h4>
                    </Box>
                    <Box className="team-socials">
                        <img className="hover" onClick={() => window.open('https://twitter.com/iriasviel')} src={Twitter} alt="twitter link" />
                        <img className="hover" onClick={() => window.open('https://www.linkedin.com/in/andres-mateo-a48607239/')} src={LinkedIn} alt="linkedIn link" />
                    </Box>
                </Grid>

                <Grid item className="team-boxwrap" style={{marginBottom: '2%'}}>
                    <Box className="team-imagewrap">
                        <img className="team-image" src={Albert} alt="albert du" />
                    </Box>
                    <Box style={{margin: '0 auto', paddingTop: '5%'}}>
                        <h3 className="team-name">Albert Du</h3>
                        <h4 className="team-position">Motoko Dev</h4>
                    </Box>
                    <Box className="team-socials">

                    </Box>
                </Grid>

                </Grid>

        </Box>
    )
}