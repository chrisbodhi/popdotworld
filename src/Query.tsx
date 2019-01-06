import React from "react";

import './Query.css';

interface Props {
  query: string;
}

export const Query = (props: Props) => {
  return <pre><code>{props.query}</code></pre>;
}

export default Query;
