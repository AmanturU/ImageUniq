import { CircleCheck } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "../../components/ui/button";
import { useVerifyStripeCheckoutSessionMutation } from "../../services/payment";
import { Navigate } from "react-router-dom";

export const SuccessfulPage = () => {
  const [verifyPayment, { data, isLoading, isSuccess, isError }] =
    useVerifyStripeCheckoutSessionMutation();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    verifyPayment({ session_id: query.get("session_id") });
  }, [verifyPayment]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || (isSuccess && data.status !== "complete")) {
    return <Navigate to="/" />;
  }

  if (isSuccess && data.status === "complete") {
    return (
      <div className="flex flex-col justify-center items-center h-screen ">
        <CircleCheck className="w-14 h-14 mb-4 text-accent" />
        <h1 className="text-2xl font-medium mb-2">Payment Successful!</h1>
        <h2 className="text-lg text-gray-600 mb-6">
          Your payment has been completed.
        </h2>

        <Button href="/">Back to the main page</Button>
      </div>
    );
  }

  return null;
};
