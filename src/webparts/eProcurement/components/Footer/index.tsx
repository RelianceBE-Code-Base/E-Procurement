import * as React from 'react';
import styles from '../EProcurement.module.scss';

const Footer: React.FC = () => {
  return (
    <footer className={`${styles.footerContainer} bg-white border-t px-6 py-4 w-full`}>
      <div className={styles.footerContent}>
        <div className={styles.footerLeftSection}>
          <p>© {new Date().getFullYear()} Nigeria Revenue Service</p>
          <span className={styles.footerDivider}>•</span>
          <p>Procurement Management System v2.1</p>
          <span className={styles.footerDivider}>•</span>

        </div>
        <div className={styles.footerRightSection}>
          <button className={styles.footerLink}>Privacy Policy</button>
          <span className={styles.footerDivider}>•</span>
          <button className={styles.footerLink}>Terms of Service</button>
          <span className={styles.footerDivider}>•</span>
          <button className={styles.footerLink}>Support</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;