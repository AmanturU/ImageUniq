import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "productSlice",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_API }),
  endpoints: (builder) => ({
    createStripeCheckoutSession: builder.mutation({
      query: (data) => ({
        url: "/api/v1/create_checkout/",
        method: "POST",
        body: data,
      }),
    }),
    verifyStripeCheckoutSession: builder.mutation({
      query: ({ session_id }) => {
        return {
          url: `/api/v1/checking_session/`,
          method: "POST",
          body: { sessionId: session_id },
        };
      },
    }),
  }),
});

export const { useCreateStripeCheckoutSessionMutation, useVerifyStripeCheckoutSessionMutation } = paymentApi;
