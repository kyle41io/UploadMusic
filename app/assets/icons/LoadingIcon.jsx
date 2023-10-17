import * as React from "react";
const LoadingIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={13}
    height={13}
    fill="none"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        fill="#fff"
        d="M10.175 2.825c.975.9 1.575 2.25 1.575 3.675a5.218 5.218 0 0 1-5.25 5.25A5.218 5.218 0 0 1 1.25 6.5c0-1.425.6-2.775 1.575-3.675l-.6-.6C1.175 3.35.5 4.85.5 6.5c0 3.3 2.7 6 6 6s6-2.7 6-6c0-1.65-.675-3.15-1.725-4.275l-.6.6Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M.5.5h12v12H.5z" />
      </clipPath>
    </defs>
  </svg>
);
export default LoadingIcon;
