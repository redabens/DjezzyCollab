import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import GroupIcon from "@mui/icons-material/Group";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "70%", // Initial width is 70% of the container
  transition: theme.transitions.create("width"),
  [theme.breakpoints.up("sm")]: {
    width: "70%",
    "&:focus-within": {
      width: "80%", // On focus, expands to 80%
    },
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  paddingRight: theme.spacing(4),
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

const StatusWrapper = styled("div")(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(2),
  top: "50%",
  transform: "translateY(-50%)",
  display: "flex",
  alignItems: "center",
}));

export default function SearchLdapBar({ handleUserName,searchTerm,setSearchTerm,setShowForm }) {
  const navigate = useNavigate();
  // const initusers = [
  //   { username: "iratni.sara", role: "admin" },
  //   { username: "bensalem.reda", role: "user" },
  //   { username: "benamrouche.nadia", role: "user" },
  //   { username: "boukhatem.mohamed", role: "user" },
  //   { username: "laabidi.amine", role: "user" },
  //   { username: "merzoug.ahmed", role: "user" },
  //   { username: "messaoudi.fatima", role: "user" },
  //   { username: "allam.soumaya", role: "user" },
  //   { username: "kamel.noureddine", role: "user" },
  //   { username: "zeroual.meriem", role: "user" },
  //   { username: "sahraoui.riad", role: "user" },
  //   { username: "benkhalifa.hassan", role: "user" },
  //   { username: "djabali.yasmine", role: "user" },
  //   { username: "hamidi.farouk", role: "user" },
  //   { username: "bendahmane.nour", role: "user" },
  //   { username: "boussaid.ilyes", role: "user" },
  //   { username: "saidi.ikram", role: "user" },
  //   { username: "abdelkader.mohamed", role: "user" },
  //   { username: "larbi.rachid", role: "user" },
  //   { username: "benkacem.fatima", role: "user" },
  //   { username: "cherifi.ahmed", role: "user" },
  //   { username: "laghmar.amine", role: "user" },
  // ];

  // const [users] = useState(initusers);
  const [loading, setLoading] = useState(false);
  const [searchSuccess, setSearchSuccess] = useState(null);

  const handleSearch = (username) => {
    console.log(username);
    //la recherche se fait dans ldap au lieu de la liste
    axios.post("http://localhost:3000/users/search",{username})
    .then((res)=>{
      if(res.status === 200){
        setTimeout(() => {
          handleUserName(username);
          setSearchSuccess(true);
          setSearchTerm("");
          setTimeout(() => setShowForm(true), 300); // Pour simuler l'animation
          setLoading(false);
        }, 1000);
      }
    }).catch((error)=>{
      if(error.response){
        if(error.response.status === 401){
          setTimeout(() => {
            setSearchSuccess(false);
            setLoading(false);
          }, 1000);
        }else if(error.response.status === 500){
          alert("erreur de recherche de l'utilisateur à cause du server ldap");
          navigate("/creation-compte");
        }
      } else{
        console.log(error);
        alert("Unknown Error",error);
      }
    });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSearchSuccess(null);
  };

  return (
    <Box sx={{ width: "100%"}}>
      <AppBar
        position="static"
        sx={{ borderRadius: "6px", backgroundColor: "#BB5D5D",height:"100px" }}
      >
        <Toolbar sx={{flexDirection:'column',gap:"10px"}}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Rechercher l'utilisateur dans LDAP
          </Typography>
          <Search>
            <SearchIconWrapper>
              <GroupIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search..."
              inputProps={{ "aria-label": "search" }}
              onChange={handleInputChange}
              value={searchTerm}
            />
            <StatusWrapper>
              {loading ? (
                <CircularProgress size={24} />
              ) : searchSuccess === true ? (
                <CheckIcon sx={{ color: "green" }} />
              ) : searchSuccess === false ? (
                <CancelIcon sx={{ color: "red" }} />
              ) : searchTerm !== "" ? (
                <img
                  src="/../../src/assets/save_name.svg"
                  alt="valider"
                  onClick={() => {
                    setLoading(true);
                    setSearchSuccess(null);
                    handleSearch(searchTerm)}}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                ""
              )}
            </StatusWrapper>
          </Search>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
