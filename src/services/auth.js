import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCookie } from "../utils/cookie.util";
import { login, signUp } from "../features/authSlice";
import { userApi } from "./user";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_API}/api/v1`,
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/login/",
        method: "POST",
        body: data,
      }),
      keepUnusedDataFor: 0,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(login({ token: data.access }));
          setCookie("access", data.access, {
            path: "/",
            secure: true,
            sameSite: "Strict",
          });
          await dispatch(
            userApi.endpoints.getMe.initiate({
              subscribe: false,
              forceRefetch: true,
            }),
          );
        } catch (error) {
          console.error("Login error:", error);
        }
      },
    }),
    signUp: builder.mutation({
      query: (data) => ({
        url: "/sign-up/",
        method: "POST",
        body: data,
      }),
      keepUnusedDataFor: 0,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(signUp({ token: data.access }));
          setCookie("access", data.access, {
            path: "/",
            secure: true,
            sameSite: "Strict",
          });
          await dispatch(
            userApi.endpoints.getMe.initiate({
              subscribe: false,
              forceRefetch: true,
            }),
          );
        } catch (error) {
          console.error("Sign Up error:", error);
        }
      },
    }),
    fetchUser: builder.query({
      query: () => "/user",
    }),
  }),
});

export const { useLoginMutation, useSignUpMutation, useFetchUserQuery } =
  authApi;
