import React from 'react';
import { Wind, Droplets, Thermometer, Sun } from 'lucide-react';

interface WeatherCardProps {
  title: string;
  temperature?: string;
  windSpeed?: string;
  humidity?: string;
  uvIndex?: string;
  feelsLike?: string;
}

export function WeatherCard({
  title,
  temperature = '--',
  windSpeed = '--',
  humidity = '--',
  uvIndex = '--',
  feelsLike = '--',
}: WeatherCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">{title}</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex items-center gap-3">
          <Thermometer className="w-5 h-5 text-orange-500" />
          <div>
            <p className="text-sm text-gray-500">Temperature</p>
            <p className="font-medium">{temperature}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Wind className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Wind Speed</p>
            <p className="font-medium">{windSpeed}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Droplets className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-sm text-gray-500">Humidity</p>
            <p className="font-medium">{humidity}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Sun className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500">UV Index</p>
            <p className="font-medium">{uvIndex}</p>
          </div>
        </div>
      </div>
    </div>
  );
}