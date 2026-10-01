import React from 'react';
import { IslandContainer } from './components/Island/IslandContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';

export const App: React.FC = () => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-transparent select-none">
      <ErrorBoundary name="AppRoot">
        <IslandContainer />
      </ErrorBoundary>
    </div>
  );
};

export default App;
