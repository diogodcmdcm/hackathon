import { useState } from 'react';
import { hackathon_backend } from 'declarations/hackathon_backend';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Evento from './components/evento';
import Equipe from './components/equipe';

function App() {
   

  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Evento/>} />
        <Route path="/equipeLink/:idEvento" element={<Equipe/>} />
      </Routes>
    </Router>

  );
}

export default App;
