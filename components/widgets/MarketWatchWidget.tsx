import React, { useState, useEffect } from 'react';
import { mockMarketWatch } from '../../data/mockData';
import { MarketAsset } from '../../types';

interface MarketDataWithChange extends MarketAsset {
    priceChangeDirection?: 'up' | 'down' | 'none';
}

const MarketWatchWidget: React.FC = () => {
    const [marketData, setMarketData] = useState<MarketDataWithChange[]>(
        mockMarketWatch.slice(0, 5).map(asset => ({ ...asset, priceChangeDirection: 'none' }))
    );

    useEffect(() => {
        const initialPrices = mockMarketWatch.reduce((acc, asset) => {
            acc[asset.pair] = asset.price;
            return acc;
        }, {} as Record<string, number>);

        const intervalId = setInterval(() => {
            setMarketData(currentData =>
                currentData.map(asset => {
                    const lastPrice = asset.price;
                    const newPrice = lastPrice * (1 + (Math.random() - 0.5) * 0.001);
                    const openPrice = initialPrices[asset.pair];
                    const newChangeValue = newPrice - openPrice;
                    const newChangePercent = (newChangeValue / openPrice) * 100;
                    const direction = newPrice > lastPrice ? 'up' : newPrice < lastPrice ? 'down' : 'none';

                    return {
                        ...asset,
                        price: newPrice,
                        changeValue: newChangeValue,
                        changePercent: newChangePercent,
                        priceChangeDirection: direction,
                    };
                })
            );

            setTimeout(() => {
                setMarketData(currentData =>
                    currentData.map(asset => ({ ...asset, priceChangeDirection: 'none' }))
                );
            }, 500);

        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="space-y-2">
            <h2 className="text-lg font-bold">Market Watch</h2>
            {marketData.map((asset) => (
                <div
                    key={asset.pair}
                    className={`
                        flex justify-between items-center p-3 rounded-lg transition-colors duration-300 ease-in-out
                        ${asset.priceChangeDirection === 'up' ? 'bg-green-500/10' : asset.priceChangeDirection === 'down' ? 'bg-red-500/10' : 'bg-gray-800'}
                    `}
                >
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-700 rounded-full">
                            <asset.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold text-base">{asset.pair}</p>
                            <p className="text-xs text-gray-400">{asset.fullName}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-mono font-semibold">
                            {asset.price.toFixed(asset.pair.includes('USD') ? 4 : 2)}
                        </p>
                        <div className={`px-2 py-0.5 rounded-md text-sm mt-1 ${asset.changePercent >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MarketWatchWidget;
