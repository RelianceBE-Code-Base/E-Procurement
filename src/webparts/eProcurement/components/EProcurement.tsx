import * as React from 'react';
//import styles from './EProcurement.module.scss';
import type { IEProcurementProps } from './IEProcurementProps';
//import Home from '../components/Home'
import {  useNavigate } from 'react-router-dom';
import "./eprocurementlanding.css";
import land from "../assets/procure.jpg";
import coat from "../assets/Group5.png";
import firslogo from "../assets/FIRS-logo.png";

const EProcurement: React.FC<IEProcurementProps> = (props) => {
  //const { description, isDarkTheme, environmentMessage, userDisplayName } = props;


    const navigate = useNavigate();

    const navigateToMain=()=>{
      navigate('/home')
    }

    return (
      <section>
        <div className="flex-1 p-1 overflow-auto">
        <header>
        <div className="nav">
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
            <div
              style={{
                paddingLeft: "50px",
                paddingTop: "0px",
                paddingBottom: "0px",
              }}
            >
              <h1 className='nav-title'>
                Federal Inland Revenue Service
              </h1>
              <p className='nav-Subtitle'>
                Procurement Management System
              </p>
            </div>
          </div>
 
          <div>
            <ul className="nav-links">
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#benefits">Benefits</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </header>
 
      {/* <!-- Hero Section --> */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Streamline Your Tax Agency Procurement</h1>
              <p className="subtitle">
                Modern e-Procurement solution designed specifically for
                government tax collection agencies. Ensure compliance,
                transparency, and efficiency in every purchase.
              </p>
              <button className="cta-button p-2 hover:bg-gray-100 rounded-lg" onClick={navigateToMain}>
                Get Started
              </button>
            </div>
            <div className="hero-visual">
              <div className="dashboard-mockup">
                <div className="mockup-header">
                  <div className="mockup-dots">
                    <div className="dot red"></div>
                    <div className="dot yellow"></div>
                    <div className="dot green"></div>
                  </div>
                </div>
                <div className="mockup-content">
                  <img src={land} alt="Dashboard preview"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* <!-- Features Section --> */}
      <section className="features" id="features">
        <div className="container">
          <h2 className="section-title" style={{ color: "black" }}>
            Built for Government Excellence
          </h2>
          <p className="section-subtitle" style={{ color: "black" }}>
            Comprehensive procurement management tailored for tax collection
            agencies with built-in compliance and audit trails.
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🔒</span>
            <h3>Compliance First</h3>
            <p>
              Built-in government procurement regulations with automated
              compliance checks and audit trails for complete transparency.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📊</span>
            <h3>Advanced Analytics</h3>
            <p>
              Real-time procurement analytics and reporting to optimize spending
              and identify cost-saving opportunities.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🤝</span>
            <h3>Vendor Management</h3>
            <p>
              Comprehensive vendor onboarding, qualification, and performance
              tracking with automated notifications.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📋</span>
            <h3>Workflow Automation</h3>
            <p>
              Streamlined approval workflows with role-based permissions and
              automated routing for faster processing.
            </p>
          </div>
        </div>
      </section>
 
      {/* <!-- Benefits Section --> */}
      <section className="benefits" id="benefits">
        <div className="container">
          <h2 className="section-title">Measurable Impact</h2>
          <p className="section-subtitle">
            Government agencies using our e-Procurement solution report
            significant improvements in efficiency and cost savings.
          </p>
 
          <div className="benefits-grid">
            <div className="benefit-item">
              <span className="benefit-number">75%</span>
              <h3>Faster Processing</h3>
              <p>
                Reduce procurement cycle time with automated workflows and
                digital approvals.
              </p>
            </div>
            <div className="benefit-item">
              <span className="benefit-number">40%</span>
              <h3>Cost Reduction</h3>
              <p>
                Lower administrative costs through process automation and better
                vendor management.
              </p>
            </div>
            <div className="benefit-item">
              <span className="benefit-number">100%</span>
              <h3>Compliance</h3>
              <p>
                Maintain complete audit trails and regulatory compliance with
                built-in controls.
              </p>
            </div>
            <div className="benefit-item">
              <span className="benefit-number">24/7</span>
              <h3>Availability</h3>
              <p>
                Cloud-based solution with enterprise-grade security and
                continuous availability.
              </p>
            </div>
          </div>
        </div>
      </section>

        </div>
       
      </section>
    );
  }

  export default EProcurement;