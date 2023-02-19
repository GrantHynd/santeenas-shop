import React from "react";

import Link from "next/link";
import Navigation from "./Navigation";

export const Header = () => (
  <>
    <div className="flex justify-center bg-primary">
      <div className="flex flex-col mt-14 px-6">
        <Link href="/" passHref={true}>
          <a className="text-4xl text-white">Santeena's Shop</a>
        </Link>
        <span className="text-md text-primary-800">customise your look</span>
      </div>
    </div>
    <Navigation />
  </>
);

export default Header;
