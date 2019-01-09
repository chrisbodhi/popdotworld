import React from "react";

import { PopulationDisplay } from "./PopulationDisplay";
import { Slider } from "./Slider";

import "./InfoPanel.css";

interface Props {
  countryName: string;
  isLoading: boolean;
  onChange: (ev: React.FormEvent<HTMLInputElement>) => void;
  population: string;
  year: string;
}

export const InfoPanel = (props: Props) => {
  const { countryName, population, isLoading, onChange, year } = props;
  return countryName ?
    (<div className="infoPanel">
      <PopulationDisplay
        countryName={countryName}
        population={population}
        isLoading={isLoading}
      />
      <Slider
        onChange={onChange}
        year={year}
      />
    </div>) :
    null;
}

export default InfoPanel;
