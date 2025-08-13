import React, { useState, useRef, useEffect } from "react";

export const AlignClientsCell: React.FC<{ clients: string[] }> = ({ clients }) => {
  const primeClient = clients?.[0];
  const otherClients = clients?.slice(1) || [];
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col items-start gap-1 relative" ref={dropdownRef}>
  
      {primeClient && (
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium"
            title={primeClient}
          >
            {primeClient.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium">{primeClient}</span>
        </div>
      )}

      {otherClients.length > 0 && (
        <div className="flex -space-x-2">
          {otherClients.slice(0, 2).map((client, idx) => (
            <div
              key={idx}
              className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
              title={client}
            >
              {client.charAt(0).toUpperCase()}
            </div>
          ))}

          {otherClients.length > 1 && (
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-xs font-bold border-2 border-white hover:bg-gray-300"
            >
              +{otherClients.length - 1}
            </button>
          )}
        </div>
      )}

      {/* Dropdown for extra clients */}
      {showDropdown && (
        <div className="absolute top-12 left-0 bg-white shadow-lg border rounded-md p-2 z-10 min-w-[150px]">
          {otherClients.map((client, idx) => (
            <div
              key={idx}
              className="px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-sm"
            >
              {client}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
