import * as React from 'react';
import styles from '../EProcurement.module.scss';

interface ISubTab {
  id: string;
  name: string;
}

interface ISubNavigation {
  subtabsByMainTab: Record<string, ISubTab[]>;
  activeTab: string;
  activeSubTab: string;
  setActiveSubTab: (subTabId: string) => void;
}

const SubNavigation: React.FC<ISubNavigation> = ({
  subtabsByMainTab,
  activeTab,
  activeSubTab,
  setActiveSubTab
}) => {
  if (!subtabsByMainTab[activeTab]) return null;

  return (
    <div className={styles.subNavContainer}>
      <div className={styles.subNavItems}>
        {subtabsByMainTab[activeTab].map((subTab) => (
          <button
            key={subTab.id}
            onClick={() => setActiveSubTab(subTab.id)}
            className={`${styles.subNavButton} ${activeSubTab === subTab.id ? 'active' : 'inactive'
              }`}
          >
            {subTab.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubNavigation;