import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "public/assets/icons/logo.svg";
import { Input } from "@nextui-org/react";
import { useState } from "react";
import NavBarSearch from "./NavBarSearch";

const navIcons = [
  { src: '/assets/icons/black-heart.svg', alt:'black-heart'},
  { src: '/assets/icons/user.svg', alt:'user'},
]

const Navbar = () => {


  return (
    <header className="w-full">
      <nav className="nav">
        <Link href={"/"} className="flex items-center gap-1">
          <Image src={Logo} width={27} height={27} alt="logo" />
          <p className="nav-logo">
            Price
            <span className="text-primary">Wise</span>
          </p>
        </Link>
        <div className="flex items-center gap-5">
          <NavBarSearch/>
          {
            navIcons.map(icon => (
              <Image
                key={icon.alt}
                src={icon.src}
                alt={icon.alt}
                height={28}
                width={28}
                className="object-contain cursor-pointer"
              />
            ))
          }
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
