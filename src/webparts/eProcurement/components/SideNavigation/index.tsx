import * as React from 'react';
import { Settings, HelpCircle, LogOut } from 'lucide-react';
import styles from '../EProcurement.module.scss';
import { useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

interface INavItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  roles:string[];
}

interface ISideNav {
  sidenavOpen: boolean;
  setSidenavOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidenavItems: INavItem[];
}

const SideNav: React.FC<ISideNav> = ({
  sidenavOpen,
  setSidenavOpen,
  activeTab,
  setActiveTab,
  sidenavItems
}) => {

  const navigate = useNavigate();

  const navigateHome = () => {
    navigate('/')
  }
  const [visibleNavItems, setVisibleNavItems] = useState<INavItem[]>([]);
  
  const location = useLocation();

  const currentLoginUser = location.state?.userLogin;

  if (!currentLoginUser) {
    navigateHome()
    return null;
  }

  useEffect(() => {
    if (currentLoginUser?.role) {
      const filtered = sidenavItems.filter(item =>
        item.roles.includes(currentLoginUser.role)
      );
      setVisibleNavItems(filtered);
    }
  }, [currentLoginUser]);
  
  return (
    <div className={`${styles.sideNavContainer} ${sidenavOpen ? styles.open : styles.closed}`}>
      <div className={styles.sideNavHeader}>
        <div className={styles.sideNavLogoContainer}>
          <div className={styles.sideNavLogo}>F</div>
          {sidenavOpen && (
            <div>
              <h2 className={styles.sideNavTitle}>FIRS</h2>
              <p className={styles.sideNavSubtitle}>E-Procurement System</p>
            </div>
          )}
        </div>
      </div>

      <nav className={styles.sideNavNav}>
        {visibleNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`${styles.sideNavItem} ${activeTab === item.id ? styles.active : ''}`}
          >
            <item.icon className={styles.sideNavIcon} />
            {sidenavOpen && <span className={styles.sideNavText}>{item.name}</span>}
          </button>
        ))}
      </nav>

      <div className={styles.sideNavFooter}>
        {sidenavOpen && (
          <div className={styles.sideNavFooterItems}>
            {currentLoginUser?.role === 'Administrator' &&
            <button className={styles.sideNavFooterItem}>
              <Settings className={styles.sideNavFooterIcon} />
              Settings
            </button>
            }
            <button className={styles.sideNavFooterItem}>
              <HelpCircle className={styles.sideNavFooterIcon} />
              Help
            </button>
            <button className={styles.sideNavFooterItem} onClick={navigateHome}>
              <LogOut className={styles.sideNavFooterIcon} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideNav;