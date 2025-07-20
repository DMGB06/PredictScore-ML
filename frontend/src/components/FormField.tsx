import React from 'react';

interface FormFieldProps {
  name: string;
  label: string;
  type: 'number' | 'select';
  placeholder?: string;
  min?: string;
  max?: string;
  options?: { value: string; label: string }[];
  value: string; // Solo string, no number
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  required?: boolean;
}

export default function FormField({
  name,
  label,
  type,
  placeholder,
  min,
  max,
  options,
  value,
  onChange,
  required = false
}: FormFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange(e);
  };

  // Estilos mejorados
  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    backgroundColor: 'white',
    color: '#1a202c',
    fontSize: '16px',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const inputFocusStyle = {
    ...inputStyle,
    borderColor: '#3182ce',
    boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)'
  };

  const labelStyle = {
    display: 'block' as const,
    color: '#2d3748',
    marginBottom: '8px',
    fontWeight: '600' as const,
    fontSize: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  if (type === 'select' && options) {
    return (
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: '#e53e3e', marginLeft: '4px' }}>*</span>}
        </label>
        <select
          name={name}
          value={value}
          onChange={handleChange}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.target.style, inputStyle)}
        >
          {value === "" && <option value="">Seleccione una opción</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: '#e53e3e', marginLeft: '4px' }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        placeholder={placeholder}
        style={inputStyle}
        onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
        onBlur={(e) => Object.assign(e.target.style, inputStyle)}
      />
    </div>
  );
}
