import React from "react";

interface Props {
  countryName: string;
  isLoading: boolean;
  population: string;
}

const formatIter = (input: string, output: string): string => {
  if (!input.length) {
    return output.slice(0, -1);
  }
  const lastThree = input.slice(-3);
  const nextStep = `${lastThree},${output}`;
  const endIndex = input.length - 3 > 0 ? input.length - 3 : 0;
  const truncatedInput = input.slice(0, endIndex);
  return formatIter(truncatedInput, nextStep);
};

export const formatLongNumber = (longNum: string): string => {
  return formatIter(longNum, "");
};

export const PopulationDisplay = (props: Props) => {
  if (props.isLoading) {
    return <div>...</div>;
  }
  return props.population
    ? (<div>
        {props.countryName}: {formatLongNumber(props.population)}
      </div>)
    : <div />;
};

export default PopulationDisplay;
