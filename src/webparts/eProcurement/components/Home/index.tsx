import * as React from 'react';
import { useState } from 'react';
import styles from '../EProcurement.module.scss';
import { FileText, CheckCircle, Plus, Home, BarChart3, ShoppingCart, ClipboardList, DollarSign, Archive } from 'lucide-react';
import SideNav from '../SideNavigation';
import TopNavigation from '../TopNavigation';
import SubNavigation from '../SubNavigation';
import Footer from '../Footer';

const FIRSProcurementSystem = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidenavOpen, setSidenavOpen] = useState(true);
  const [activeSubtab, setActiveSubtab] = useState('overview');

  const sidenavItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, active: true },
    { id: 'requests', name: 'All Requests', icon: FileText },
    { id: 'new-request', name: 'New Request', icon: Plus },
    { id: 'approvals', name: 'Approvals', icon: CheckCircle },
    { id: 'tenders', name: 'Tender Management', icon: ShoppingCart },
    { id: 'contracts', name: 'Contract Management', icon: ClipboardList },
    { id: 'payments', name: 'Payment Processing', icon: DollarSign },
    { id: 'reports', name: 'Reports & Analytics', icon: BarChart3 },
    { id: 'archive', name: 'Archive', icon: Archive }
  ];

  const subtabsByMainTab = {
    dashboard: [
      { id: 'overview', name: 'Overview' },
      { id: 'workflow', name: 'Process Workflow' },
      { id: 'analytics', name: 'Analytics' }
    ],
    requests: [
      { id: 'all', name: 'All Requests' },
      { id: 'active', name: 'Active' },
      { id: 'completed', name: 'Completed' },
      { id: 'draft', name: 'Drafts' }
    ],
    'new-request': [
      { id: 'goods', name: 'Goods' },
      { id: 'works', name: 'Works' },
      { id: 'services', name: 'Services' }
    ],
    approvals: [
      { id: 'pending', name: 'Pending Review' },
      { id: 'approved', name: 'Approved' },
      { id: 'rejected', name: 'Rejected' }
    ]
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'new-request':
      case 'approvals':
      default:
        return null;
    }
  };

  return (
    <div className={`${styles.layoutContainer} ${styles.uFullHeight}`}>
      <SideNav
        sidenavOpen={sidenavOpen}
        setSidenavOpen={setSidenavOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidenavItems={sidenavItems}
      />

      <div className={`${styles.layoutMainContent} ${styles.uFullHeight}`}>
        <TopNavigation
          sidenavOpen={sidenavOpen}
          setSidenavOpen={setSidenavOpen}
        />

        <SubNavigation
          subtabsByMainTab={subtabsByMainTab}
          activeTab={activeTab}
          activeSubTab={activeSubtab}
          setActiveSubTab={setActiveSubtab}
        />

        <main className={styles.layoutContentArea}>
          {renderMainContent()}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default FIRSProcurementSystem;