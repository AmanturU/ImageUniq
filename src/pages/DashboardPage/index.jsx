import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { useGetFoldersQuery, useGetMeQuery } from "../../services/user";
import DropzoneComponent from "../../components/ui/DropZone";
import { useForm } from "react-hook-form";
import { getCookie } from "../../utils/cookie.util";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import OrderTable from "../../components/ui/OrderTable";
import { Rules } from "../../services/Forms/rules";

export const DashboardPage = () => {
  const { toast } = useToast();
  const isAuthenticated = useAuth();
  const { data: user, error, isLoading } = useGetMeQuery();
  const [uploadedFile, setUploadedFile] = useState([]);
  const [clearFiles, setClearFiles] = useState(false);
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [isSingle, setIsSingle] = useState(null);
  const [numberOfCopiesLevel, setNumberOfCopiesLevel] = useState(1);

  const { data: folders, refetch } = useGetFoldersQuery(user?.id, {
    skip: !user?.id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (clearFiles) {
      setClearFiles(false);
    }
  }, [clearFiles]);

  const onSuccessful = () => {
    toast({
      title: "Success.",
      type: "success",
      description: "Your order has been successfully completed.",
    });
    refetch();
  };

  const resetFiles = () => {
    setUploadedFile([]);
    setClearFiles(true);
  };

  const onSubmit = async (body) => {
    if (uploadedFile.length === 0) {
      toast({
        title: "Error.",
        type: "error",
        description: "Please upload at least one file.",
      });
      return;
    }

    setIsPending(true);
    setUploadProgress(0); // Сброс прогресса

    const formData = new FormData();
    formData.append("folder_name", body.folder_name);
    formData.append("modification_level", body.modification_level);
    formData.append("user", user.id);

    if (isSingle && uploadedFile.length > 0) {
      const numberOfCopies = Number(numberOfCopiesLevel);
      const file = uploadedFile[0];

      for (let i = 0; i < numberOfCopies; i++) {
        formData.append("images", file);
      }
    } else {
      uploadedFile.forEach((file) => {
        formData.append("images", file);
      });
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/v1/image-uniq-create/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getCookie("access")}`,
          },
        },
      );
      const taskId = response.data.task_id;
      if (taskId) {
        await subscribeToTask(taskId);
      }
    } catch (error) {
      console.error(error);
      setClearFiles(true);
      setIsPending(false);

      if (error.response && error.response.data) {
        toast({
          title: "Error.",
          type: "error",
          description: error.response.data.message || "An unexpected error occurred.",
        });
      } else {
        toast({
          title: "Error.",
          type: "error",
          description: "An unexpected error occurred.",
        });
      }

    }
  };


  const subscribeToTask = async (taskId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/api/v1/image-uniq-task/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("access")}`,
          },
        },
      );

      if (uploadProgress < 100) {
        setUploadProgress((prevProgress) => {
          // Calculate random increment while ensuring progress never decreases or exceeds 100
          const randomIncrement = Math.floor(Math.random() * 20) + 1;
          return Math.min(prevProgress + randomIncrement, 100);
        });
      }

      if (
        response.data.status === "PENDING" ||
        response.data.status === "STARTED"
      ) {
        setTimeout(() => subscribeToTask(taskId), 5000);
      } else if (response.data.status === "SUCCESS") {
        setUploadProgress(100);
        setIsPending(false);
        onSuccessful();
      } else if (response.data.status === "FAILURE") {
        setIsPending(false);
        toast({
          title: "Error.",
          description: "Image processing failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error subscribing to task:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading user data</div>;
  }

  const fileNames =
    Array.isArray(uploadedFile) && uploadedFile.length > 0
      ? uploadedFile.map((file) => file.name)
      : [];

  return (
    <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-8 mt-10">
      <div className="w-full lg:w-2/5 rounded-lg shadow-lg h-full mb-8 md:mb-0 relative">
        {!isAuthenticated ? (
          <div className="absolute w-full h-full z-10 flex justify-center items-center backdrop-blur-sm">
            <Button asChild className="relative z-20">
              <Link to="/login" className="text-white">
                Login to unify the images
              </Link>
            </Button>
          </div>
        ) : null}

        <div className="flex justify-between pt-8 px-8 text-2xl font-Poppins mb-4">
          <h2 className="font-medium">Create Order</h2>
          <div className="flex gap-3 items-center flex-row-reverse">
            <div className="hidden sm:block">
              <Button onClick={resetFiles}> Reset</Button>
            </div>


            <div className="flex bg-gray-300 rounded-full p-1 w-36 text-sm">
              <button
                className={`flex-1 py-1 rounded-full text-center transition-colors duration-300 ${isSingle ? "bg-accent text-white" : "text-gray-500"}`}
                onClick={() => {
                  setIsSingle(true);
                  setClearFiles(true); // Очистка загруженных файлов при выборе "Single"
                }}
              >
                Single
              </button>
              <button
                className={`flex-1 py-1 rounded-full text-center transition-colors duration-300 ${!isSingle ? "bg-accent text-white" : "text-gray-500"}`}
                onClick={() => {
                  setIsSingle(false);
                  setClearFiles(true); // Очистка загруженных файлов при выборе "Multiple"
                }}
              >
                Multiple
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full h-[2px] bg-[#EDEDED]"></div>

          <div className="flex flex-col justify-around w-full p-8">
            <div className="flex gap-2 flex-col md:flex-row">
              <div className="md:w-9/12">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="ZIP-file_name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name
                  </label>
                  <h1 className="text-md text-red-600">
                    {errors.folder_name && errors.folder_name.message}
                  </h1>
                </div>
                <div className="relative mb-2">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <img width="12px" src="/stars.png" alt="start" />
                  </div>
                  <input
                    type="text"
                    id="input-group-1"
                    className={`border shadow-sm border-gray-300 text-gray-900 text-md rounded-lg block w-full ps-8 p-2.5 ${
                      isPending ? "cursor-not-allowed" : ""
                    }`}
                    placeholder="Enter the name of the ZIP file"
                    disabled={isPending}
                    {...register("folder_name", Rules.Orders.Title)}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="modification_level"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Modification level
                  </label>
                </div>
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <img width="12px" src="/stars.png" alt="start" />
                  </div>
                  <input
                    type="number"
                    id="input-group-1"
                    className={`border shadow-sm border-gray-300 text-gray-900 text-md rounded-lg block w-full ps-8 p-2.5 ${
                      isPending ? "cursor-not-allowed" : ""
                    }`}
                    placeholder="Enter the modification level"
                    disabled={isPending}
                    defaultValue={30}
                    {...register("modification_level")}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value > 50) {
                        e.target.value = 50;
                      } else if (value < 1) {
                        e.target.value = 1;
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {isSingle && (
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="number_of_copies"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Number of copies - {numberOfCopiesLevel}
                  </label>
                </div>
                <div className="relative mb-4">
                  <input
                    type="range"
                    id="number_of_copies"
                    min="1"
                    max="15"
                    className="w-full"
                    value={numberOfCopiesLevel}
                    onChange={(e) =>
                      setNumberOfCopiesLevel(Number(e.target.value))
                    }
                  />
                  <div className="flex items-center justify-between text-sm text-gray-900 dark:text-white">
                    <span>1</span>
                    <span>15</span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <DropzoneComponent
                upload={setUploadedFile}
                multiple={isSingle ? false : true}
                clearFiles={clearFiles}
              >
                {fileNames.length === 0 ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="35"
                      height="34"
                      viewBox="0 0 25 24"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.56934 5C3.56934 2.79086 5.3602 1 7.56934 1H15.9125C16.9733 1 17.9908 1.42143 18.7409 2.17157L20.3978 3.82843C21.1479 4.57857 21.5693 5.59599 21.5693 6.65685V19C21.5693 21.2091 19.7785 23 17.5693 23H7.56934C5.3602 23 3.56934 21.2091 3.56934 19V5ZM19.5693 8V19C19.5693 20.1046 18.6739 21 17.5693 21H7.56934C6.46477 21 5.56934 20.1046 5.56934 19V5C5.56934 3.89543 6.46477 3 7.56934 3H14.5693V5C14.5693 6.65685 15.9125 8 17.5693 8H19.5693ZM19.4584 6C19.3602 5.7176 19.199 5.45808 18.9836 5.24264L17.3267 3.58579C17.1113 3.37035 16.8517 3.20914 16.5693 3.11094V5C16.5693 5.55228 17.0171 6 17.5693 6H19.4584Z"
                        fill="#777E91"
                      />
                      <path
                        d="M12.1866 9.07588C12.0686 9.12468 11.9581 9.19702 11.8622 9.29289L8.86223 12.2929C8.4717 12.6834 8.4717 13.3166 8.86223 13.7071C9.25275 14.0976 9.88592 14.0976 10.2764 13.7071L11.5693 12.4142V17C11.5693 17.5523 12.0171 18 12.5693 18C13.1216 18 13.5693 17.5523 13.5693 17V12.4142L14.8622 13.7071C15.2528 14.0976 15.8859 14.0976 16.2764 13.7071C16.667 13.3166 16.667 12.6834 16.2764 12.2929L13.2764 9.29289C12.9818 8.99825 12.549 8.92591 12.1866 9.07588Z"
                        fill="#777E91"
                      />
                    </svg>
                    <h1 className="pt-4 text-black px-4 text-center">
                      Select a file or drag and drop here (Max 25 files)
                    </h1>
                  </>
                ) : null}

                <h1 className="py-2">JPG. Max size: 5MB</h1>
                {uploadedFile === null ? (
                  <button
                    type="button"
                    className="text-sm font-semibold text-accent px-8 py-2 border border-gray-300 rounded-xl mb-2"
                  >
                    Upload
                  </button>
                ) : null}
              </DropzoneComponent>
            </div>

            {/* Progress Bar */}
            {isPending && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full">
                  <div
                    className="bg-accent text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    {uploadProgress}%
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center px-4 items-center">
              <button
                type="submit"
                className={`mt-4 px-16 py-2 border border-gray-300 rounded-xl ${
                  uploadedFile.length === 0 || isPending
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : ""
                }`}
                disabled={uploadedFile.length === 0 || isPending}
                title={uploadedFile.length === 0 ? "Select an image" : ""}
                onClick={() => setClearFiles(true)} // Clear files on button click
              >
                {isPending ? "Processing..." : "Get Started"}
              </button>

              <div className="sm:hidden">
                <Button
                  onClick={resetFiles}
                  className="mt-4 px-6 mx-2 py-2 border border-gray-300 rounded-xl"
                > Reset</Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="w-full lg:w-3/5 h-[580px] rounded-lg shadow-lg m-0">
        <div className="w-full text-left font-Poppins">
          <div className="flex justify-between">
            <h1 className="text-2xl font-medium mb-4 pl-8 mt-4">History</h1>
            <button
              className="px-8 py-2 rounded-xl text-accent font-mediyum"
              onClick={() => navigate("/profile")}
            >
              Go to profile
            </button>
          </div>

          <div className="w-full h-[2px] bg-[#EDEDED]"></div>

          <div className="flex flex-col justify-between px-4 pt-1">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="md:p-4 p-1 text-[12px] md:text-base font-medium">
                      Name
                    </th>
                    <th className="md:p-4 p-1 text-[12px] md:text-base font-medium">
                      Images
                    </th>
                    <th className="md:p-4 p-1 text-[12px] md:text-base font-medium">
                      Date
                    </th>
                    <th className="md:p-4 p-1 text-[12px] md:text-base font-medium">
                      Status
                    </th>
                    <th className="md:p-4 p-1 text-[12px] md:text-base font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {folders && folders.length > 0 ? (
                    <OrderTable orders={folders.slice(-6).reverse()} />
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        No orders available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
