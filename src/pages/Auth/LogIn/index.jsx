import { useGetMeQuery } from "../../../services/user";
import { LoginForm } from "./../../../components/Form/LoginForm";
import React from "react";

export const LogIn = () => {
  return (
    <main className="flex flex-col justify-center items-center h-full w-full container">
      <LoginForm />
    </main>
  );
};
