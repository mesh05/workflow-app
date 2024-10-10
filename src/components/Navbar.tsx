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
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
const settings = ["Import", "Export"];

export default function Navbar() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const location = useLocation();
  const [workflowName, setWorkflowName] = useState("Workflow Name");
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
            <FormControlLabel control={<Switch defaultChecked />} label="Dark" />
            </FormGroup>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton
                  disableRipple
                  sx={{ maxWidth: "30px", height: "30px", bgcolor: "white" }}
                  onClick={handleOpenUserMenu}
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
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    sx={{ width: "150px" }}
                    key={setting}
                    onClick={handleCloseUserMenu}
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
            {workflowName}
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
