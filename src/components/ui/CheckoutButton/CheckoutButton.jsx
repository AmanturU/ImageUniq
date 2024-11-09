import React from "react";
import PropTypes from "prop-types";
import { useCreateStripeCheckoutSessionMutation } from "../../../services/payment";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); // Replace with your Stripe publishable key

export const CheckoutButton = ({ items }) => {
  


  return (
    
  );
};

CheckoutButton.propTypes = {
  items: PropTypes.shape({
    productId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
  }).isRequired,
};
