import DehazeOutlinedIcon from '@mui/icons-material/DehazeOutlined';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import AutoAwesomeMotionOutlinedIcon from '@mui/icons-material/AutoAwesomeMotionOutlined';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';
function Sidebar(){
    const menuItemUp = [
        {
            path:"/download",
            name:"Downloads",
            icon:<img className="downloads" src="./src/assets/Folder_send.svg" alt="logo_download" />
        },
        {
            path:"/upload",
            name:"Uploads",
            icon:<CloudDownloadOutlinedIcon />
        },
        {
            path:"/admin",
            name:"Administrateur",
            icon:<img className="admin" src="./src/assets/security-user.svg" alt="logo_admin" />
        },
    ]
    const menuItemDown = [
        {
            path:"/notifications",
            name:"Notifications",
            icon:<img className="notifs" src="./src/assets/notification.svg" alt="logo_notifs" />
        },
        {
            path:"/parametres",
            name:"Paramétres",
            icon:<img className="params" src="./src/assets/setting-2.svg" alt="logo_params" />
        },
        {
            path:"/aide",
            name:"Aide",
            icon:<HelpOutlineOutlinedIcon style={{paddingLeft:'1px',}}/>
        },
    ]
    return (
        <div className="container">
            <div className='sidebar'>
                <div className='top-logo'>
                    <div>
                        <img className="bars" src="./src/assets/Menu.svg" alt="menu" />
                    </div>
                    <div className='LogoWithName'>
                        <img className="logo" src="./src/assets/logo_djezzy.svg" alt="logo_djezzy" />
                        <div className='Nom' >
                            <h2>DJEZZY COLLAB</h2>
                            <h2 id='arabe'>جازي كولاب</h2>
                        </div>
                    </div>
                </div>
                <div className='optionsUp'>
                    {
                        menuItemUp.map((item, index) => {
                            return (
                                <NavLink to={item.path} key={index} className='link' activeclassName='active'>
                                    <div className='iconUp'>{item.icon}</div>
                                    <div className='link_text'>{item.name}</div>
                                </NavLink>    
                            );
                        })
                    }
                </div>
                <div className='optionsDown'>
                    {
                        menuItemDown.map((item, index) => {
                            return (
                                <NavLink to={item.path} key={index+3} className='link' activeclassName='active'>
                                    <div className='iconDown'>{item.icon}</div>
                                    <div className='link_text'>{item.name}</div>
                                </NavLink>    
                            );
                        })
                    }
                </div>
            </div>
        </div>   
    );
}

export default Sidebar;