import * as React from "react";
const ErrorTickIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={21}
    fill="none"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        fill="#FF4040"
        d="M19.688 10.5c0 5.35-4.338 9.688-9.688 9.688-5.35 0-9.688-4.338-9.688-9.688C.313 5.15 4.65.812 10 .812c5.35 0 9.688 4.338 9.688 9.688ZM8.879 15.63l7.188-7.188a.625.625 0 0 0 0-.884l-.884-.884a.625.625 0 0 0-.884 0l-5.861 5.862L5.7 9.799a.625.625 0 0 0-.884 0l-.884.884a.625.625 0 0 0 0 .884l4.063 4.062c.244.245.64.245.883 0Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 .5h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default ErrorTickIcon;
