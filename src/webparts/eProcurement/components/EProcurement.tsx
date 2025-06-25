import * as React from 'react';
import styles from './EProcurement.module.scss';
import type { IEProcurementProps } from './IEProcurementProps';
import { escape } from '@microsoft/sp-lodash-subset';
//import Home from '../components/Home'
import {  useNavigate } from 'react-router-dom';

const EProcurement: React.FC<IEProcurementProps> = (props) => {
  const { description, isDarkTheme, environmentMessage, userDisplayName } = props;


    const navigate = useNavigate();

    const navigateToMain=()=>{
      navigate('/home')
    }

    return (
      <section className={`${styles.eProcurement}`}>
        <div className="flex-1 p-6 overflow-auto">
          <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.sideNavIcon} />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
          <button onClick={navigateToMain} className="p-2 hover:bg-gray-100 rounded-lg">
          Get Started
           </button>
        </div>
       
      </section>
    );
  }

export default EProcurement;
