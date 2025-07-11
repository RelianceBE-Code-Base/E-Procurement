import * as React from "react";
 
import { Search, Bell, Menu, X } from "lucide-react";
 
import styles from "../EProcurement.module.scss";
import coat from "../../assets/Group5.png";
import firslogo from "../../assets/FIRS-logo.png";
 
interface ITopNavigation {
  sidenavOpen: boolean;
 
  setSidenavOpen: (open: boolean) => void;
}
 
const TopNavigation: React.FC<ITopNavigation> = ({
  sidenavOpen,
  setSidenavOpen,
}) => {
  return (
    <header
      className={`${styles.topNavHeader} bg-white shadow-sm border-b w-full`}
    >
      <div className={styles.topNavContainer}>
        <div className={styles.topNavFlexContainer}>
          <div className={styles.topNavFlexContainer} style={{ gap: "1rem" }}>
            <button
              onClick={() => setSidenavOpen(!sidenavOpen)}
              className={styles.topNavButton}
            >
              {sidenavOpen ? (
                <X className={styles.topNavIcon} />
              ) : (
                <Menu className={styles.topNavIcon} />
              )}
            </button>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto auto 1fr",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <img
                src={coat}
                alt="coat"
                style={{ height: "60px", width: "60px", objectFit: "contain" }}
              />
              <img
                src={firslogo}
                alt="Logo"
                style={{ height: "90px", width: "90px", objectFit: "contain" }}
              />
              <div style={{ paddingLeft: "50px" }}>
                <h1 className={styles.topNavTitle}>
                  Federal Inland Revenue Service
                </h1>
                <p className={styles.topNavSubtitle}>
                  Procurement Management System
                </p>
              </div>
            </div>
          </div>
 
          <div className={styles.topNavFlexContainer} style={{ gap: "1rem" }}>
            <div className={styles.topNavSearchContainer}>
              <Search className={styles.topNavSearchIcon} />
              <input
                type="text"
                placeholder="Search requests..."
                className={styles.topNavSearchInput}
              />
            </div>
 
            <button className={styles.topNavNotificationButton}>
              <Bell className={styles.topNavNotificationIcon} />
              <span className={styles.topNavNotificationBadge}></span>
            </button>
 
            <div
              className={styles.topNavFlexContainer}
              style={{ gap: "0.75rem" }}
            >
              <div style={{ textAlign: "right" }}>
                <p className={styles.topNavUserName}>John Doe</p>
                <p className={styles.topNavUserRole}>Procurement Officer</p>
              </div>
              <div className={styles.topNavUserInitials}>JD</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
 
export default TopNavigation;