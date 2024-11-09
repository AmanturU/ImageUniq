import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie } from "../utils/cookie.util";
import userSlice, { setUser } from "../features/userSlice";

const customBaseQuery = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_API}/api/v1`,
    prepareHeaders: (headers) => {
      const token = getCookie("access");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    localStorage.removeItem("persist:root");
    window.location.href = "/login"; // Redirect to login page
  }

  return result;
};

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "/get-me/",
      keepUnusedDataFor: 0,
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setUser({
              id: data.id,
              email: data.email,
              is_paid: data.is_paid,
              daily_usage_limit: data.daily_usage_limit,
            }),
          );
        } catch (error) {
          console.error("Get Me error:", error);
        }
      },
    }),
    createImageUniquizer: builder.mutation({
      query: (body) => ({
        url: "/image-uniq-create/",
        method: "POST",
        body,
      }),
      keepUnusedDataFor: 0,
    }),
    getFolders: builder.query({
      query: (user) => ({
        url: `/folders/?user=${user}`,
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
      }),
      keepUnusedDataFor: 0,
    }),
    resetPassword: builder.mutation({
      query: (email) => ({
        url: "/reset_password/",
        method: "POST",
        body: { email },
      }),
      keepUnusedDataFor: 0,
    }),
    confirmPassword: builder.mutation({
      query: (body) => ({
        url: "/confirm_password/",
        method: "POST",
        body,
      }),
      keepUnusedDataFor: 0,
    }),
    getUserGroupInfo: builder.query({
      query: (id) => ({
        url: `/users/${id}/`,
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
      }),
      keepUnusedDataFor: 0,
    }),
    addUserToGroup: builder.mutation({
      query: ({ id, group_user_email }) => ({
        url: `/users/${id}/add_to_group/`,
        method: "POST",
        body: { group_user_email },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: 0,
    }),
    removeUserToGroup: builder.mutation({
      query: ({ id, group_user_id }) => ({
        url: `/users/${id}/remove_from_group/`,
        method: "POST",
        body: { group_user_id },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useGetMeQuery,
  useCreateImageUniquizerMutation,
  useGetFoldersQuery,
  useResetPasswordMutation,
  useConfirmPasswordMutation,
  useGetUserGroupInfoQuery,
  useAddUserToGroupMutation,
  useRemoveUserToGroupMutation,
} = userApi;
