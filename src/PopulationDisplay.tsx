import React from "react";

interface ObjectLiteral {
  [key: string]: any;
}

interface Props {
  countryName: string;
  isLoading: boolean;
  data: ObjectLiteral[];
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

// todo: rename this thing

export const PopulationDisplay = (props: Props) => {
  if (props.isLoading) {
    return <div>...</div>;
  }
  return props.data
    ? (<ul>
        {props.data.map(({ k, v }) => {
          return (
            <li>
              {props.countryName}: {k} &mdash; {formatLongNumber(v)}
            </li>
          );
        })}
      </ul>)
    : <div />;
};

export default PopulationDisplay;
