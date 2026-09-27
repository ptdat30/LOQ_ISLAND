import React from 'react';
import { IslandContainer } from './components/Island/IslandContainer';

export const App: React.FC = () => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-transparent select-none">
      <IslandContainer />
    </div>
  );
};

export default App;
