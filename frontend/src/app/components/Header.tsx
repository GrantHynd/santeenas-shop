import React from "react";

import Link from "next/link";
import Navigation from "./Navigation";

export const Header = () => (
  <>
    <div className="flex justify-center bg-primary">
      <div className="flex flex-col mt-14 px-6">
        <Link href="/" className="text-4xl text-white">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl underline underline-offset-3 decoration-8 decoration-primary-300 text-white">
            Santeena's Styles
          </h1>
        </Link>
        <span className="text-md text-base-100">choose your look</span>
      </div>
    </div>
    <Navigation />
  </>
);

export default Header;
