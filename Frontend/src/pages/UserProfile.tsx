import React from 'react';
import LogoIcon from '../images/logo/logo-icon.svg';
import { useLog } from '../context/LogContext';
import { useNavigate } from 'react-router-dom';

function UserProfile() {

    const { userLogout } = useLog();
    const navigate = useNavigate();
    const handleLogout = () => {
        userLogout();
        navigate('/user/signin');
    };

    const name = localStorage.getItem('name');


    return (
        <div>
            <div className='bg-slate-50 shadow-default dark:border-strokedark dark:bg-boxdark h-screen max-h-full w-full'>
                <nav className='flex items-center justify-between px-8 py-4 bg-white dark:bg-boxdark'>
                    <div className='flex gap-2 items-center justify-center'>
                        <img src={LogoIcon} alt="Logo" />
                        <h1>OLMS</h1>
                    </div>
                    <div className="flex">
                        <button
                            className="inline-flex items-center justify-center bg-danger py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </nav>

                <div className="profile p-8">
                    <h2 className="text-title-md2 font-semibold text-black dark:text-white mb-4">User Profile</h2>
                    <div className="bg-white dark:bg-boxdark rounded-md p-4 shadow-default">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-black dark:text-white">Name</h3>
                            <p className="text-black dark:text-white">{name || 'N/A'}</p>
                        </div>
                        {/* Add more fields as necessary */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
