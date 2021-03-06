import React from 'react';

interface Props {
  onChange: (ev: React.FormEvent<HTMLInputElement>) => void;
  year: string;
}

export const Slider = (props: Props) => {
  const { onChange, year } = props;
  return (
    <React.Fragment>
      <input type="range" onChange={onChange} value={year} min="1980" max="2010" />
      <label>{year}</label>
    </React.Fragment>
)
}

export default Slider;
