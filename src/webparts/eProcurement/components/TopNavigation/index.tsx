import * as React from 'react';
import { Search, Bell, Menu, X } from 'lucide-react';
import styles from './TopNavigation.module.scss';

interface ITopNavigation {
  sidenavOpen: boolean;
  setSidenavOpen: (open: boolean) => void;
}

const TopNavigation: React.FC<ITopNavigation> = ({ sidenavOpen, setSidenavOpen }) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.flexContainer}>
          <div className={styles.flexContainer} style={{ gap: '1rem' }}>
            <button
              onClick={() => setSidenavOpen(!sidenavOpen)}
              className={styles.navButton}
            >
              {sidenavOpen ? <X className={styles.navIcon} /> : <Menu className={styles.navIcon} />}
            </button>
            <div>
              <h1 className={styles.title}>Federal Inland Revenue Service</h1>
              <p className={styles.subtitle}>Procurement Management System</p>
            </div>
          </div>

          <div className={styles.flexContainer} style={{ gap: '1rem' }}>
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search requests..."
                className={styles.searchInput}
              />
            </div>

            <button className={styles.notificationButton}>
              <Bell className={styles.notificationIcon} />
              <span className={styles.notificationBadge}></span>
            </button>

            <div className={styles.flexContainer} style={{ gap: '0.75rem' }}>
              <div style={{ textAlign: 'right' }}>
                <p className={styles.userName}>John Doe</p>
                <p className={styles.userRole}>Procurement Officer</p>
              </div>
              <div className={styles.userInitials}>JD</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;