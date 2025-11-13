

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { MarketAsset, AiSignal, CandlestickData } from '../types';
import { mockCandlestickData } from '../data/mockData';

interface TradingChartProps {
    asset: MarketAsset;
    signals?: AiSignal[];
}

const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D'];
const TIMEFRAME_SECONDS: Record<string, number> = {
    '1m': 60,
    '5m': 300,
    '15m': 900,
    '1H': 3600,
    '4H': 14400,
    '1D': 86400,
};

const TradingChart: React.FC<TradingChartProps> = ({ asset, signals }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
    const seriesRef = useRef<any>(null);
    const [activeTimeframe, setActiveTimeframe] = useState('1D');
    const intervalRef = useRef<number | null>(null);
    const dataRef = useRef<CandlestickData[]>([]);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#1F2937' }, // gray-800
                textColor: '#9CA3AF', // gray-400
            },
            grid: {
                vertLines: { color: '#374151' }, // gray-700
                horzLines: { color: '#374151' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 350,
            timeScale: {
                borderColor: '#4B5563', // gray-600
                timeVisible: true,
                secondsVisible: false,
            },
            rightPriceScale: {
                borderColor: '#4B5563',
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
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, []); 

    useEffect(() => {
        if (!seriesRef.current || !asset) return;

        if (intervalRef.current) clearInterval(intervalRef.current);

        const data = [...(mockCandlestickData[asset.pair]?.[activeTimeframe] || [])];
        dataRef.current = data;
        seriesRef.current.setData(data);

        if (signals && signals.length > 0 && data.length > 0) {
            const markers = signals.map((signal, index) => {
                const dataIndex = data.length - 1 - (index * 10);
                if (dataIndex < 0) return null;

                const candle = data[dataIndex];
                const isBuy = signal.signal.includes('BUY');
                
                return {
                    time: candle.time,
                    position: isBuy ? 'belowBar' : 'aboveBar',
                    color: isBuy ? '#22c55e' : '#ef4444',
                    shape: isBuy ? 'arrowUp' : 'arrowDown',
                    text: signal.signal.split(' ')[0],
                    size: 1,
                };
            }).filter((m): m is any => m !== null);
            
            seriesRef.current.setMarkers(markers);
        } else {
            seriesRef.current.setMarkers([]);
        }

        if (chartRef.current) {
            chartRef.current.timeScale().fitContent();
        }

        const timeDelta = TIMEFRAME_SECONDS[activeTimeframe];
        intervalRef.current = window.setInterval(() => {
            if (seriesRef.current && dataRef.current.length > 0) {
                const currentData = dataRef.current;
                const lastCandle = currentData[currentData.length - 1];
                
                const newClose = lastCandle.close * (1 + (Math.random() - 0.5) * 0.0005);
                const newHigh = Math.max(lastCandle.high, newClose);
                const newLow = Math.min(lastCandle.low, newClose);
                
                const updatedCandle = { ...lastCandle, close: newClose, high: newHigh, low: newLow };
                
                dataRef.current[dataRef.current.length - 1] = updatedCandle;
                seriesRef.current.update(updatedCandle);
            }
        }, 2000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };

    }, [asset, signals, activeTimeframe]);

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
             <div className="flex items-center space-x-1 px-2 pb-2 border-b border-gray-700 mb-1 overflow-x-auto">
                {timeframes.map(tf => (
                    <button 
                        key={tf}
                        onClick={() => setActiveTimeframe(tf)}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors flex-shrink-0 ${
                            activeTimeframe === tf ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                        }`}
                    >
                        {tf}
                    </button>
                ))}
            </div>
            <div ref={chartContainerRef} style={{ width: '100%', height: '350px' }} />
        </div>
    );
};

export default TradingChart;