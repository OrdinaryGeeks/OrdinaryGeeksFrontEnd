import { AppBar, Toolbar } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { Box, List, ListItem } from "@mui/material";
import { useAppSelector } from "../Store/configureStore";
import SignedInMenu from "./SignedInMenu";
import {ImageList} from "@mui/material";

export default function Header() {
  const { user } = useAppSelector((state) => state.account);
  const pageLinks = [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Contact", path: "/contact" },
    { title: "WALA", path: "/wala"}
  ];
/*  const brandStyle = {
    color: "inherit",
    textDecoration: "none",
    typography: "h6",
    "&:hover": {
      color: "grey.500",
    },
    "&.active": {
      color: "text.secondary",
    },
  };
  */
  const AuthLinks = [
    { title: "Login", path: "/login" },
    { title: "Register", path: "/register" },
  ];
  return (
    <AppBar color="secondary" position="static">
      <Toolbar >
        <Box display="flex" alignItems="center">
        <ImageList>
        <a  href="/">
        <img 
       
        src={"/images/OGLogoContained.png"}
        alt={"Ordinary Geeks"}
        width={"128px"}
        height={"64px"}
        />
        </a>


        </ImageList>
         
        </Box>
        <List sx={{ display: "flex" }}>
          {pageLinks.map(({ title, path }) => (
            <ListItem
              key ={title}
              component={NavLink}
              to={path}
              sx={{ color: "inherit" }}
            >
              {title}
            </ListItem>
          ))}
        </List>
        {user ? (
          <SignedInMenu />
        ) : (
          <List sx={{ display: "flex" }}>
            {AuthLinks.map(({ title, path }) => (
              <ListItem component={NavLink} to={path} key={path}>
                {title.toUpperCase()}
              </ListItem>
            ))}
          </List>
        )}
      </Toolbar>
    </AppBar>
  );
}
