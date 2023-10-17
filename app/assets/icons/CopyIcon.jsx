import * as React from "react";
const CopyIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    fill="none"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        fill="#979797"
        d="M9.625 12.25v1.094a.656.656 0 0 1-.656.656H1.53a.656.656 0 0 1-.656-.656V3.28c0-.362.294-.656.656-.656H3.5v8.094c0 .844.687 1.531 1.531 1.531h4.594Zm0-9.406V0H5.031a.656.656 0 0 0-.656.656V10.72c0 .362.294.656.656.656h7.438a.656.656 0 0 0 .656-.656V3.5h-2.844a.658.658 0 0 1-.656-.656Zm3.308-.849L11.13.192A.656.656 0 0 0 10.666 0H10.5v2.625h2.625v-.166c0-.174-.07-.34-.192-.464Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h14v14H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default CopyIcon;
