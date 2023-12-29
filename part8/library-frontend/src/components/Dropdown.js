import React, { useEffect } from 'react'
const Dropdown = ({ selectOption, options, onSelectChange }) => {
  useEffect(() => {
    if (options.length > 0 && !selectOption) {
      onSelectChange(options[0])
    }
  }, [options, selectOption, onSelectChange])
  return (
    <select
      value={selectOption}
      onChange={(e) => onSelectChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

export default Dropdown
