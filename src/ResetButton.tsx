import React from "react";

import "./ResetButton.css";

interface Props {
  resetView: () => void;
}

export const ResetButton = (props: Props) => {
  const { resetView } = props;
  return (
    <button onClick={resetView}>
      Reset view
    </button>
  );
}

export default ResetButton;
