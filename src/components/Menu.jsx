import { FaHelmetSafety, FaPeopleGroup } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import {
  IoIosConstruct,
  IoIosBusiness,
  IoIosArrowForward,
} from "react-icons/io";
import { MdMonetizationOn } from "react-icons/md";
import { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { IoCaretBackOutline } from "react-icons/io5";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import { IoIosMail } from "react-icons/io";

export function Menu({ onNavigate }) {
  const [showPage, setPage] = useState("home");
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("indexPage");
    if (stored) setOpen(Number(stored));
  }, []);

  const handleClick = (e) => {
    if (open === e) {
      setOpen("");
      localStorage.removeItem("indexPage", e);
    } else {
      setOpen(e);
      localStorage.setItem("indexPage", e);
    }
  };

  useEffect(() => {
    onNavigate(showPage);
  });

  return (
    <>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          "& .MuiListItemButton-root:hover": {
            backgroundColor: "#E2F4FF",
            color: "#0077b6",
          },
          "& .Mui-selected": {
            backgroundColor: "#d0eaff",
            color: "#0077b6",
          },
        }}
        component="nav"
        className="p-2 pt-4 row-span-2 relative z-10 border-r-2 border-gray-200"
      >
        <ListItemButton
          onClick={() => {
            handleClick(1);
            window.location.href = `/home`;
          }}
          selected={open === 1}
        >
          <ListItemIcon sx={{ fontSize: 25 }}>
            <FaHome />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            handleClick(2);
            window.location.href = `/obras`;
          }}
          selected={open === 2}
        >
          <ListItemIcon sx={{ fontSize: 25 }}>
            <FaHelmetSafety />
          </ListItemIcon>
          <ListItemText primary="Obras" />
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            handleClick(3);
          }}
          selected={open === 3}
        >
          <ListItemIcon sx={{ fontSize: 25 }}>
            <MdMonetizationOn />
          </ListItemIcon>
          <ListItemText primary="Financeiro" />
          {open === 3 ? (
            <IoIosArrowForward className={"rotate-90"} />
          ) : (
            <IoIosArrowForward className={"rotate-0"} />
          )}
        </ListItemButton>
        <Collapse in={open === 3} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 10 }}
              selected={open === 3}
              onClick={() => (window.location.href = `/titulopagar`)}
            >
              <ListItemText
                primary="Títulos a Pagar"
                primaryTypographyProps={{ fontSize: 15 }}
              />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 10 }}
              selected={open === 3}
              onClick={() => (window.location.href = `/medpagar`)}
            >
              <ListItemText
                primary="Medições a Pagar"
                primaryTypographyProps={{ fontSize: 15 }}
              />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 10 }}
              selected={open === 3}
              onClick={() => (window.location.href = `/medreceber`)}
            >
              <ListItemText
                primary="Medições a Receber"
                primaryTypographyProps={{ fontSize: 15 }}
              />
            </ListItemButton>
          </List>
        </Collapse>
        <ListItemButton
          onClick={() => {
            handleClick(4);
            window.location.href = `/funcionarios`;
          }}
          selected={open === 4}
        >
          <ListItemIcon sx={{ fontSize: 25 }}>
            <FaPeopleGroup />
          </ListItemIcon>
          <ListItemText primary="Funcionários" />
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            handleClick(5);
            window.location.href = `/empresas`;
          }}
          selected={open === 5}
        >
          <ListItemIcon sx={{ fontSize: 25 }}>
            <IoIosBusiness />
          </ListItemIcon>
          <ListItemText primary="Empresas" />
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            handleClick(6);
          }}
          selected={open === 6}
        >
          <ListItemIcon sx={{ fontSize: 25 }}>
            <IoIosConstruct />
          </ListItemIcon>
          <ListItemText primary="Engenharia" />
          {open === 6 ? (
            <IoIosArrowForward className={"rotate-90"} />
          ) : (
            <IoIosArrowForward className={"rotate-0"} />
          )}
        </ListItemButton>
        <Collapse in={open === 6} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 10 }}
              selected={open === 6}
              onClick={() => {
                window.location.href = `/desp-mes-mes`;
              }}
            >
              <ListItemText
                primary="Despesas Mês a Mês"
                primaryTypographyProps={{ fontSize: 15 }}
              />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </>
  );
}

export function MenuTop() {
  function stringAvatar(name) {
    const hex = [...name]
      .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
      .replace(/[^a-f0-9]/gi, "") 
      .slice(0, 6);
    return {
      sx: {
        bgcolor: `#${hex.padEnd(6, "0")}`,
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  return (
    <div className="flex flex-row-reverse items-center gap-4 px-10 border-b-2 border-gray-200 ">
      <a href="#">
        <ListItemAvatar>
          <Avatar {...stringAvatar("Micael Farias")} />
        </ListItemAvatar>
      </a>
      <a href="#">
        <IconButton aria-label={"adsdasd"} color="info">
          <Badge badgeContent={100} color="success">
            <IoIosMail />
          </Badge>
        </IconButton>
      </a>
      {window.location.pathname.split(" /") != "/home" && (
        <div className="w-full items-start">
          <a
            href={`/${window.location.pathname
              .split("/")
              .filter(Boolean)
              .slice(0, -1)
              .join("/")}`}
          >
            <Button variant="contained" startIcon={<IoCaretBackOutline />}>
              Voltar
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}
