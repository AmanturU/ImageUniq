import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productSlice = createApi({
  reducerPath: "prodcutSlice",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_API }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/api/v1/products/",
    }),
    fetchUser: builder.query({
      query: () => "/user",
    }),
    getAllProducts: builder.query({
      query: () => "/api/v1/monthly_products/",
    }),
  }),
});

export const {
  useGetProductsQuery,
  useFetchUserQuery,
  useGetAllProductsQuery,
} = productSlice;
