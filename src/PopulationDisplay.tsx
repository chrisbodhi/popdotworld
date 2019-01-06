import React from "react";

interface Props {
  countryName: string;
  population: string;
}

export const PopulationDisplay = (props: Props) => {
  return props.population
    ? (<div>{props.countryName}: {props.population}</div>)
    : <div />
};

export default PopulationDisplay;
