import React from "react";

interface DropdownProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, selected, onSelect }) => {
  return (
    <select
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200 text-"
      value={selected}
      onChange={(e) => onSelect(e.target.value)}
    >
      <option value="" disabled>
        Select an option
      </option>
      {options.map((option, index) => (
        <option key={index} value={option} className="text-gray-900">
          {option}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
