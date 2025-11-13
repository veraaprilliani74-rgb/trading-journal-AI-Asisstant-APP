
import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { MarketAsset } from '../types';
import { mockCandlestickData } from '../data/mockData';

interface TradingChartProps {
    asset: MarketAsset;
}

const TradingChart: React.FC<TradingChartProps> = ({ asset }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
    const seriesRef = useRef<any>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#1a202c' }, // gray-900
                textColor: '#A0AEC0', // gray-400
            },
            grid: {
                vertLines: { color: '#2D3748' }, // gray-800
                horzLines: { color: '#2D3748' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 350,
            timeScale: {
                borderColor: '#4A5568', // gray-600
            },
            rightPriceScale: {
                borderColor: '#4A5568',
            },
        });
        chartRef.current = chart;

        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#22c55e', // green-500
            downColor: '#ef4444', // red-500
            borderDownColor: '#ef4444',
            borderUpColor: '#22c55e',
            wickDownColor: '#ef4444',
            wickUpColor: '#22c55e',
        });
        seriesRef.current = candlestickSeries;

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, []); 

    useEffect(() => {
        if (seriesRef.current && asset) {
            const data = mockCandlestickData[asset.pair] || [];
            seriesRef.current.setData(data);
            if (chartRef.current) {
                chartRef.current.timeScale().fitContent();
            }
        }
    }, [asset]); 

    if (!asset) {
        return null;
    }

    return (
        <div className="bg-gray-800 p-2 rounded-xl animate-fade-in">
            <div className="flex justify-between items-center mb-2 px-2">
                <div className="flex items-center space-x-2">
                    <asset.icon className="w-6 h-6" />
                    <h3 className="font-bold text-lg">{asset.fullName} ({asset.pair})</h3>
                </div>
                <div className="text-right">
                    <p className="font-mono text-lg">{asset.price.toFixed(asset.category === 'FX' ? 4 : 2)}</p>
                    <p className={`text-sm font-semibold ${asset.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </p>
                </div>
            </div>
            <div ref={chartContainerRef} style={{ width: '100%', height: '350px' }} />
        </div>
    );
};

export default TradingChart;
