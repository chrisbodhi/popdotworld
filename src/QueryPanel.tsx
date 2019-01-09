import React from "react";

import { Query } from "./Query";
import { ResetButton } from "./ResetButton";

import "./QueryPanel.css";
import "./panel.css";

interface Props {
  query: string;
  resetView: () => void;
}

export const QueryPanel = (props: Props) => {
  const { query, resetView } = props;
  return (
    query.length ? (
      <div className="panel queryPanel">
        <Query query={query} />
        <ResetButton resetView={resetView} />
      </div>
    ) : null
  );
}

export default QueryPanel;
