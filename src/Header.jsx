import { useState } from 'react';
import LoginModal from './LoginModal';

function Header({ isLoggedIn, onLogin, onLogout }) {
    const [showModal, setShowModal] = useState(false);

    const handleLoginClick = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleLoginSuccess = (token) => {
        onLogin(token);
        setShowModal(false);
    };

    return (
        <header className="header">
            <div className="header-content">
                <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',gap: '8px' }}>
                    <img src="/src/assets/company1.webp" alt="icon" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '50%', border: '2px solid rgba(255, 255, 255, 0.3)' }} />
                    Company Directory
                </h1>

                <div className="header-status">

                    <div className="auth-link">
                        {isLoggedIn ? (
                            <span className="logout-link" onClick={onLogout}>Logout</span>
                        ) : (
                            <span className="login-link" onClick={handleLoginClick}>Login</span>
                        )}
                    </div>
                </div>
            </div>

            {showModal && (
                <LoginModal onClose={handleCloseModal} onLogin={handleLoginSuccess} />
            )}
        </header>
    );
}

export default Header;




// import { useState } from 'react';
// import LoginModal from './LoginModal';

// function Header({ isLoggedIn, onLogin, onLogout }) {
//     const [showModal, setShowModal] = useState(false);

//     const handleLoginClick = () => {
//         setShowModal(true);
//     };

//     const handleCloseModal = () => {
//         setShowModal(false);
//     };

//     const handleLoginSuccess = (token) => {
//         onLogin(token);
//         setShowModal(false);
//     };

//     const handleLogoutClick = () => {
//         onLogout();
//     };

//     return (
//         <header className="header">
//             <div className="header-content">
//                 <h1>Company Directory</h1>
//                 {isLoggedIn ? (
//                     <button className="logout-btn" onClick={handleLogoutClick}>Logout</button>
//                 ) : (
//                     <button className="login-btn" onClick={handleLoginClick}>Login</button>
//                 )}
//             </div>
//             {showModal && (
//                 <LoginModal onClose={handleCloseModal} onLogin={handleLoginSuccess} />
//             )}
//         </header>
//     );
// }

// export default Header;
