// src/services/cryptoPaymentApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = "https://api.plisio.net/api/v1/invoices/new";

export const cryptoPaymentApi = createApi({
  reducerPath: "cryptoPaymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
  }),
  endpoints: (builder) => ({
    createCryptoInvoice: builder.mutation({
      query: ({
        source_currency,
        source_amount,
        order_number,
        currency,
        email,
        order_name,
        callback_url,
        api_key,
      }) => ({
        url: `?source_currency=${source_currency}&source_amount=${source_amount}&order_number=${order_number}&currency=${currency}&email=${email}&order_name=${order_name}&callback_url=${callback_url}&api_key=${api_key}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateCryptoInvoiceMutation } = cryptoPaymentApi;
