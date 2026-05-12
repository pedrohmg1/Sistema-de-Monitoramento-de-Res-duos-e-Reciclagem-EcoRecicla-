import React from 'react';

interface SelectEstadoProps {
  value: string;
  onChange: (value: string) => void;
}

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export function SelectEstado({ value, onChange }: SelectEstadoProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className="select-custom clique" // Você pode estilizar no App.css
    >
      <option value="" disabled>Selecione o Estado</option>
      {estados.map((uf) => (
        <option key={uf} value={uf}>
          {uf}
        </option>
      ))}
    </select>
  );
}