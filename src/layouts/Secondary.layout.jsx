import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { NavBar } from "../components/ui/NavBar";
import { Footer } from "../components/ui/Footer";

export const SecondaryLayout = () => {
  return (
    <div className="px-0 w-full flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-grow flex items-center justify-center">
        <Outlet />
        <Toaster />
      </div>
      <Footer />
    </div>
  );
};
