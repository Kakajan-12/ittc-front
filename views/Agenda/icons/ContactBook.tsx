import type { SVGProps } from "react";

export default function ContactBook({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="25"
      height="27"
      viewBox="0 0 25 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M17.1389 1.25V3.65M7.36111 1.25V3.65M20.8056 25.25H3.69444C2.35 25.25 1.25 24.17 1.25 22.85V6.05C1.25 4.73 2.35 3.65 3.69444 3.65H20.8056C22.15 3.65 23.25 4.73 23.25 6.05V22.85C23.25 24.17 22.15 25.25 20.8056 25.25ZM9.80556 19.25H14.6944C17.3945 19.25 19.5833 21.5979 19.5833 24.0439V25.25H4.91667V24.0439C4.91667 21.5979 7.1055 19.25 9.80556 19.25ZM15.9167 12.05C15.9167 14.0382 14.2751 15.65 12.25 15.65C10.2249 15.65 8.58333 14.0382 8.58333 12.05C8.58333 10.0618 10.2249 8.45 12.25 8.45C14.2751 8.45 15.9167 10.0618 15.9167 12.05Z"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#009FE3"
      />
    </svg>
  );
}
