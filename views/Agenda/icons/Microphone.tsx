import type { SVGProps } from "react";

export default function Microphone({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="21"
      height="29"
      viewBox="0 0 21 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M19.25 13.8438C19.25 18.7798 15.2205 22.7812 10.25 22.7812M10.25 22.7812C5.27943 22.7812 1.25 18.7798 1.25 13.8438M10.25 22.7812V27.25M10.25 27.25H14.75M10.25 27.25H5.75M14.75 5.71875V13.8438C14.75 16.3118 12.7353 18.3125 10.25 18.3125C7.76465 18.3125 5.75 16.3118 5.75 13.8438V5.71875C5.75 3.25073 7.76465 1.25 10.25 1.25C12.7353 1.25 14.75 3.25073 14.75 5.71875Z"
        stroke="#009FE3"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
