import React from "react";
import { Button } from "../../components/ui/button";

export const CancelPage = () => {
  return (
    <>
      <div className="grid min-h-full h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-3xl font-bold text-accent">Sorry</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Your payment was canceled
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            If you think it was by mistake. Please contact our support
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button href="/">Go back home</Button>
            <Button href="https://t.me/isceassistant" variant="ghost">
              Contact support <span aria-hidden="true">&rarr;</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
