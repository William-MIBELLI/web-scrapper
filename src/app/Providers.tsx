'use client';
import { NextUIProvider } from "@nextui-org/react";
import  { FC } from "react";

interface IProviders {
  children: React.ReactNode
}

const Providers: FC<IProviders> = ({ children }) => {
  return (
      <NextUIProvider>
        {children}
      </NextUIProvider>
  )
}

export default Providers