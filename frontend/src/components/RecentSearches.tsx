import React from 'react';
import { MapPin } from 'lucide-react';

interface SearchListProps {
  title: string;
  locations: string[];
}

export function SearchList({ title, locations }: SearchListProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {locations.length > 0 ? (
        <ul className="space-y-3">
          {locations.map((location, index) => (
            <li key={index} className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              {location}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No locations yet</p>
      )}
    </div>
  );
}