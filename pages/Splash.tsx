import React from 'react';
import { AlphalyticLogo } from '../components/Icons';

interface SplashProps {
  onClick: () => void;
}

const Splash: React.FC<SplashProps> = ({ onClick }) => {
  return (
    <div 
      className="bg-gray-900 text-white h-screen w-full flex flex-col justify-center items-center p-8 cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      <div className="flex-grow flex flex-col justify-center items-center">
        <AlphalyticLogo className="w-48 h-48 text-green-500" />
        <h1 className="text-5xl font-bold text-gray-200 -mt-4" style={{ letterSpacing: '0.05em' }}>
          Alphalytic
        </h1>
      </div>
      
      <div className="pb-8">
        <p className="text-gray-500">Ketuk untuk melanjutkan</p>
      </div>
    </div>
  );
};

export default Splash;
