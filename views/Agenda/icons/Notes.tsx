import type { SVGProps } from "react";

export default function Notes({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="26"
      height="27"
      viewBox="0 0 26 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M21.2079 16.3496V21.5567C21.2079 23.6028 19.6304 25.25 17.671 25.25H4.78691C2.82747 25.25 1.25 23.6028 1.25 21.5567V4.9433C1.25 2.89721 2.82747 1.25 4.78691 1.25H17.671C19.6304 1.25 21.2079 2.89721 21.2079 4.9433V10.0955M5.09778 7.98451H10.6882M5.09778 13.2076H17.9979M5.09778 18.5123H13.832M23.6057 10.5902C24.4648 11.4873 24.4648 12.9316 23.6057 13.8286L18.3566 19.3098C17.4975 20.2069 14.567 21.8227 13.7079 20.9257C12.8489 20.0286 14.3963 16.9685 15.2553 16.0714L20.5044 10.5902C21.3635 9.69319 22.7467 9.69319 23.6057 10.5902Z"
        stroke="#009FE3"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
