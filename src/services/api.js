import axios from "axios";
import { createApi } from "@reduxjs/toolkit/query/react";

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: import.meta.env.VITE_API_BASE_URL }) =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: {
          ...headers,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return { data: result.data };
    } catch (axiosError) {
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data || axiosError.message,
        },
      };
    }
  };

export const api = createApi({
  baseQuery: axiosBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        data: credentials,
      }),
    }),
    addFeedback: builder.mutation({
      query: (data) => ({
        url: "/feedback/add",
        method: "POST",
        data,
      }),
    }),
    getAllFeedbacks: builder.query({
      query: () => ({
        url: "/feedback/all",
        method: "GET",
      }),
      providesTags: ["Feedback"],
    }),
    getUser: builder.query({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
    }),
    getFormStatus: builder.query({
      query: () => ({
        url: "/form/status",
        method: "GET",
      }),
      providesTags: ["FormStatus"],
    }),
    scheduleForm: builder.mutation({
      query: (data) => ({
        url: "/form/schedule",
        method: "PUT",
        data,
      }),
    }),
    getFeedbackData: builder.query({
      query: () => ({
        url: "/feedback/all",
        method: "GET",
      }),
    }),
    // Schools
    getSchools: builder.query({
      query: () => ({ url: "/school", method: "GET" }),
      providesTags: ["Schools"],
    }),
    addSchool: builder.mutation({
      query: (data) => ({ url: "/school/add", method: "POST", data }),
      invalidatesTags: ["Schools"],
    }),
    // Departments
    getDepartments: builder.query({
      query: () => ({ url: "/department", method: "GET" }),
      providesTags: ["Departments"],
    }),
    addDepartment: builder.mutation({
      query: (data) => ({ url: "/department/add", method: "POST", data }),
      invalidatesTags: ["Departments"],
    }),
    // Faculty
    getFaculty: builder.query({
      query: () => ({ url: "/faculty", method: "GET" }),
      providesTags: ["Faculty"],
    }),
    addFaculty: builder.mutation({
      query: (data) => ({ url: "/faculty/add", method: "POST", data }),
      invalidatesTags: ["Faculty"],
    }),
    // Courses
    getCourses: builder.query({
      query: () => ({ url: "/course", method: "GET" }),
      providesTags: ["Courses"],
    }),
    addCourse: builder.mutation({
      query: (data) => ({ url: "/course/add", method: "POST", data }),
      invalidatesTags: ["Courses"],
    }),
    getDashboard: builder.query({
      query: () => ({ url: "/dashboard", method: "GET" }),
    }),
    validateForm: builder.query({
      query: (token) => ({
        url: `/form/validate/${token}`,
        method: "GET",
      }),
    }),
  }),
  tagTypes: [
    "FormStatus",
    "Schools",
    "Departments",
    "Faculty",
    "Courses",
    "Dashboard",
  ],
});

export const {
  useLoginMutation,
  useAddFeedbackMutation,
  useGetAllFeedbacksQuery,
  useGetUserQuery,
  useGetFormStatusQuery,
  useScheduleFormMutation,
  useGetFeedbackDataQuery,
  useGetSchoolsQuery,
  useAddSchoolMutation,
  useGetDepartmentsQuery,
  useAddDepartmentMutation,
  useGetFacultyQuery,
  useAddFacultyMutation,
  useGetCoursesQuery,
  useAddCourseMutation,
  useGetDashboardQuery,
  useValidateFormQuery,
} = api;
