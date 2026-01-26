import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2a10 10 0 0 0-10 10c0 1.5.3 2.9.9 4.2" />
      <path d="M12 22a10 10 0 0 0 9.1-5.8" />
      <path d="M2 12h2.5" />
      <path d="M19.5 12h2.5" />
      <path d="M12 2v2.5" />
      <path d="M12 19.5V22" />
      <path d="M16.2 4.8a6.5 6.5 0 0 0-8.4 0" />
      <path d="M16.2 19.2a6.5 6.5 0 0 1-8.4 0" />
      <path d="M4.8 7.8a6.5 6.5 0 0 1 0 8.4" />
      <path d="M19.2 7.8a6.5 6.5 0 0 0 0 8.4" />
      <path d="M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0" />
    </svg>
  ),
};
