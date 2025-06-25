import * as React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import EProcurement from './EProcurement';
import Home from './Home';
import type { IEProcurementProps } from './IEProcurementProps';
import '../../../index.css'

const App: React.FC<IEProcurementProps> = (props) => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<EProcurement {...props} />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
