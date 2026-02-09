import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import EmergencyBanner from './EmergencyBanner';

function Layout() {
    return (
        <>
            <EmergencyBanner />
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

export default Layout;
