import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Link, useLocation } from "react-router-dom";
import SaveIcon from "@mui/icons-material/Save";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useRecoilState } from "recoil";
import { workflowState } from "../recoil/atoms";
const settings = ["Import", "Export"];

export default function Navbar() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const workflows = useRecoilState(workflowState);

  const handleOpenSettings = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseSettings = () => {
    setAnchorElUser(null);
  };

  const handleImportExport = (event: React.MouseEvent<HTMLElement>) => {
    const action = event.currentTarget.innerText;
    if (action === "Import") {
      console.log("Import!!");
    }
    if (action === "Export") {
      const myData = { workflows: workflows };
      const json = JSON.stringify(myData, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const href = URL.createObjectURL(blob);

      // create "a" HTLM element with href to file
      const link = document.createElement("a");
      link.href = href;
      link.download = "ExportSuperchatFlow.json";
      document.body.appendChild(link);
      link.click();

      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    }
  };

  const location = useLocation();
  const [workflow, setWorkflow] = useRecoilState(workflowState);
  const path = location.pathname.split("/");

  if (path[1] === "")
    return (
      <AppBar sx={{ bgcolor: "inherit" }} position="static">
        <Container maxWidth="xl">
          <Toolbar
            sx={{ display: "flex", justifyContent: "space-between" }}
            disableGutters
          >
            <Link to={{ pathname: "/" }}>
              <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".1rem",
                  color: "white",
                  textDecoration: "none",
                }}
              >
                SuperChatAI
              </Typography>
            </Link>
            <FormGroup>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Dark"
              />
            </FormGroup>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton
                  disableRipple
                  sx={{ maxWidth: "30px", height: "30px", bgcolor: "white" }}
                  onClick={handleOpenSettings}
                >
                  <SettingsIcon sx={{ color: "black" }} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseSettings}
              >
                {settings.map((setting) => (
                  <MenuItem
                    sx={{ width: "150px" }}
                    key={setting}
                    onClick={(event) => {
                      handleImportExport(event);
                      handleCloseSettings();
                    }}
                  >
                    <Typography>{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    );

  if (path[1] === "workflow")
    return (
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", justifyContent: "left" }}>
          <Link to={{ pathname: "/" }}>
            <IconButton sx={{ ml: "5px", color: "inherit" }}>
              <ArrowBackIosNewIcon sx={{ color: "white" }} />
            </IconButton>
          </Link>
          <Typography
            variant="h6"
            sx={{ ml: "10px", pt: "3px", color: "inherit" }}
          >
            {workflow.map((item) => {
              if (item.id === path[2]) return item.name;
            })}
          </Typography>
        </Box>
        <Box sx={{ mr: "20px" }}>
          <Tooltip title={"Save"}>
            <IconButton>
              <SaveIcon sx={{ color: "white" }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    );
}
