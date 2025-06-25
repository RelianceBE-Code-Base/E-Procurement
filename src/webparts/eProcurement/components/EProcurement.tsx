import * as React from 'react';
import styles from './EProcurement.module.scss';
import type { IEProcurementProps } from './IEProcurementProps';
import FIRSProcurementSystem from './Home';

export default class EProcurement extends React.Component<IEProcurementProps> {
  public render(): React.ReactElement<IEProcurementProps> {

    return (
      <section className={`${styles.eProcurement}`}>
        <FIRSProcurementSystem />
      </section>
    );
  }
}
