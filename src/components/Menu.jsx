import { FaHelmetSafety, FaPeopleGroup } from 'react-icons/fa6';
import { FaHome } from 'react-icons/fa';
import {
  IoIosConstruct,
  IoIosBusiness,
  IoIosArrowForward,
} from 'react-icons/io';
import { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { IoCaretBackOutline } from 'react-icons/io5';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import { IoIosMail } from 'react-icons/io';

function ItemMenu({ label, link, icon, sorted, open }) {
  return (
    <>
      <ListItemButton
        onClick={() => {
          window.location.href = `/${link}`;
        }}
        selected={open === sorted}
      >
        <ListItemIcon sx={{ fontSize: 25 }}>
          {icon}
        </ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </>
  );
}

function ListItems({ label, icon, handleClick, sorted, list, open }) {
  return (
    <>
      <ListItemButton
        onClick={() => {
          handleClick(sorted);
        }}
        selected={open === sorted}
      >
        <ListItemIcon sx={{ fontSize: 25 }}>
          {icon}
        </ListItemIcon>
        <ListItemText primary={label} />
        {open === sorted ? (
          <IoIosArrowForward className={'rotate-90'} />
        ) : (
          <IoIosArrowForward className={'rotate-0'} />
        )}
      </ListItemButton>
      <Collapse in={open === sorted} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {list.map((item, index) => (
            <ListItemButton
              key={index}
              sx={{ pl: 10 }}
              selected={open === sorted}

              onClick={() => (window.location.href = `/${item[0]}`)}
            >
              <ListItemText
                primary={item[1]}
                primaryTypographyProps={{ fontSize: 15 }}
              />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
}

function MenuCreate({ list, handleClick, open }) {
  return (
    <>
      {list.map((item, index) => {
        if (item.type === 'buttom') {
          return (
            <ItemMenu
              key={index}
              label={item.label}
              link={item.link}
              icon={item.icon}
              sorted={item.open}
              open={open}
            />
          );
        }

        if (item.type === 'list') {
          return (
            <ListItems
              key={index}
              label={item.label}
              icon={item.icon}
              handleClick={handleClick}
              sorted={item.open}
              list={item.list}
              open={open}
            />
          );
        }
        return null;
      })}
    </>
  );
}

export function Menu({ onNavigate }) {
  const [showPage, setPage] = useState('home');
  const [open, setOpen] = useState('');

  useEffect(() => {
    if (window.location.href === `${window.location.origin}/home`) {
      localStorage.setItem('indexPage', 1);
    }
    const stored = localStorage.getItem('indexPage');
    if (stored) setOpen(Number(stored));
  }, []);

  const handleClick = (e) => {
    if (open === e) {
      setOpen('');
      localStorage.removeItem('indexPage');
    } else {
      setOpen(e);
      localStorage.setItem('indexPage', e);
    }
  };

  useEffect(() => {
    onNavigate(showPage);
  });

  return (
    <>
      <List
        sx={{
          width: '100%',
          maxWidth: 360,
          bgcolor: 'background.paper',
          '& .MuiListItemButton-root:hover': {
            backgroundColor: '#E2F4FF',
            color: '#0077b6',
          },
          '& .Mui-selected': {
            backgroundColor: '#d0eaff',
            color: '#0077b6',
          },
        }}
        component="nav"
        className="p-2 pt-4 row-span-2 relative z-10 border-r-2 border-gray-200"
      >
        <MenuCreate
          handleClick={handleClick}
          open={open}
          list={[
            {
              'type': 'buttom',
              'label': 'Home',
              'link': 'home',
              'icon': <FaHome />,
              'open': 1,
            },
            {
              'type': 'list',
              'label': 'Obras',
              'icon': <FaHelmetSafety />,
              'open': 2,
              'list': [
                ['obras', 'Obras'],
                ['servicos', 'Serviços'],
              ],
            },
            {
              'type': 'list',
              'label': 'Funcionários',
              'icon': <FaPeopleGroup />,
              'open': 3,
              'list': [
                ['funcionarios', 'Funcionários'],
                ['ponto', 'Ponto'],
              ],
            },
            {
              'type': 'buttom',
              'label': 'Empresas',
              'link': 'empresas',
              'icon': <IoIosBusiness />,
              'open': 4,
            },
            {
              'type': 'list',
              'label': 'Engenharia',
              'icon': <IoIosConstruct />,
              'open': 5,
              'list': [
                ['desp-mes-mes', 'Despesas Mês a Mês'],
                ['cronograma', 'Cronograma'],
              ],
            },
          ]}
        />
        <amp-ad width="100vw" height="320"
          type="adsense"
          data-ad-client="ca-pub-7361302895831275"
          data-ad-slot="8161032099"
          data-auto-format="rspv"
          data-full-width="">
          <div overflow=""></div>
        </amp-ad>
        <amp-ad width="100vw" height="320"
          type="adsense"
          data-ad-client="ca-pub-7361302895831275"
          data-ad-slot="3411306280"
          data-auto-format="mcrspv"
          data-full-width="">
          <div overflow=""></div>
        </amp-ad>
      </List>
    </>
  );
}

// O componente do menu superior
export function MenuTop({ user }) {
  const username = user.username
  function stringAvatar(name) {
    const hex = [...name]
      .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
      .replace(/[^a-f0-9]/gi, '')
      .slice(0, 6);
    return {
      sx: {
        bgcolor: `#${hex.padEnd(6, '0')}`,
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

  return (
    <div className="flex flex-row-reverse items-center gap-4 px-10 border-b-2 border-gray-200 ">
      <a href="#">
        <ListItemAvatar>
          <Avatar {...stringAvatar(`${username} 324`)} />
        </ListItemAvatar>
      </a>
      <a href="#">
        <IconButton aria-label={'adsdasd'} color="info">
          <Badge badgeContent={100} color="success">
            <IoIosMail />
          </Badge>
        </IconButton>
      </a>
      {window.location.pathname.split(' /') != '/home' && (
        <div className="w-full items-start">
          <a
            href={`/${window.location.pathname
              .split('/')
              .filter(Boolean)
              .slice(0, -1)
              .join('/')}`}
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