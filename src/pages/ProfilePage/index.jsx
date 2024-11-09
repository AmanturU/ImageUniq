import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Button } from "../../components/ui/button";
import OrderTable from "../../components/ui/OrderTable";
import EditGroupDialog from "../../components/ui/EditGroupDialog";
import WarningDialog from "../../components/ui/WarningDialog";
import { useGetFoldersQuery, useGetMeQuery } from "../../services/user";
import { logout } from "../../features/authSlice";
import { clearUser } from "../../features/userSlice";
import { mockProductsList } from "../../services/mocks/productMocks";

// Helper functions
const getMockProduct = (id) =>
  mockProductsList.find((product) => product.id === id);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const getRandomColor = () => {
  const colors = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-teal-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(["access"]);

  const { data: user } = useGetMeQuery();
  const { data: folders } = useGetFoldersQuery(user?.id, { skip: !user?.id });

  const [mockProduct, setMockProduct] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const maxUsers = 20;

  useEffect(() => {
    if (user && user.id) {
      setMockProduct(getMockProduct(user.product));
    }
  }, [user]);

  const addUser = (email) => {
    if (selectedUsers.length < maxUsers && !selectedUsers.includes(email)) {
      setSelectedUsers([...selectedUsers, email]);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUser());
    removeCookie("access");
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Profile and Subscription Info */}
      <div className="flex justify-between items-center mt-8 gap-4 flex-col md:flex-row">
        {/* User Profile Section */}
        <div className="flex flex-col justify-between bg-white p-10 rounded-lg shadow-lg w-full md:w-[469px] h-[420px]">
          <p className="md:text-x truncate font-medium">
            {user?.email || "Email not available"}
          </p>
          <p className="text-md text-gray-500 mb-4">
            Created in{" "}
            {user ? formatDate(user.created_at) : "Date not available"}
          </p>
          <div className="w-full h-[1px] mb-6 bg-[#EDEDED]"></div>

          <p className="text-sm font-medium">
            Subscription status -{" "}
            {user?.is_paid ? (
              <span className="text-green-500">Active</span>
            ) : (
              <span className="text-red-500">Inactive</span>
            )}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {mockProduct?.description}
          </p>
          <p className="text-sm font-medium mb-4">
            End of subscription -{" "}
            {user?.is_paid ? (
              formatDate(user.subsciption_end)
            ) : (
              <span>Not subscribed</span>
            )}
          </p>

          <div className="w-full h-[1px] mb-6 bg-[#EDEDED]"></div>
          <div className="flex flex-col gap-4">
            <WarningDialog />
            <Button
              variant="ghost"
              className="border border-red-500 text-red-500 text-sm font-medium py-2 px-4 rounded-md w-full bg-transparent hover:bg-red-500 hover:text-white transition-colors duration-300"
              onClick={handleLogout}
            >
              Log out
            </Button>
          </div>
        </div>

        {/* Subscription Summary Section */}
        <div className="flex flex-col justify-between bg-white p-10 rounded-lg shadow-lg w-full h-[420px]">
          <p className="text-xl font-medium mb-4">Summary</p>
          <div className="w-full h-[1px] mb-6 bg-[#EDEDED]"></div>

          {/* Subscription Info */}
          <div className="mb-2 flex justify-between">
            <p className="text-sm text-[#4B4B4B]">Subscription</p>
            <p
              className={`text-sm font-medium text-white py-1 px-3 rounded-lg
              ${user?.is_paid ? "bg-green-500" : "bg-red-500"}`}
            >
              {user?.is_paid ? mockProduct?.name : "None"}
            </p>
          </div>

          <div className="w-full h-[1px] mb-6 bg-[#EDEDED]"></div>

          {/* Billing Info */}
          <div className="mb-2 flex justify-between">
            <p className="text-sm text-[#4B4B4B]">Billed Monthly</p>
            <p className="text-md font-bold">${mockProduct?.price_amount}</p>
          </div>

          <div className="w-full h-[1px] mb-6 bg-[#EDEDED]"></div>

          {/* Usage Info */}
          <div className="mb-2 flex justify-between">
            <p className="text-sm text-[#4B4B4B]">Daily tokens</p>
            <p className="text-sm font-medium">
              {user?.daily_usage_limit} / {user?.max_daily_usage_limit}
            </p>
          </div>

          <div className="w-full h-[1px] mb-6 bg-[#EDEDED]"></div>

          {/* Group Participants */}
          <div className="mb-2 flex justify-between">
            <p className="text-sm text-[#4B4B4B]">Subscription participants</p>
            <div className="flex items-center">
              <p className="text-sm font-medium text-gray-200 bg-gray-500 px-2 py-1 rounded-2xl">
                    Soon
              </p>
              {/* Soon */}
              {/* {user?.group_users.length === 0 ? (
                <>
                  <p className="text-sm font-medium text-gray-500">
                    Group is empty
                  </p>
                  <EditGroupDialog
                    addUser={addUser}
                    selectedUsers={selectedUsers}
                    maxUsers={maxUsers}
                  />
                </>
              ) : (
                <div className="flex justify-end space-x-1">
                  {user?.group_users.slice(0, 10).map((participant, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getRandomColor()}`}
                    >
                      {participant?.id}
                    </div>
                  ))}
                  {user?.group_users.length > 10 && (
                    <p className="text-sm font-medium text-gray-500 ml-2">
                      +{user?.group_users.length - 10} members
                    </p>
                  )}
                  <EditGroupDialog
                    addUser={addUser}
                    selectedUsers={selectedUsers}
                    maxUsers={maxUsers}
                  />
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white p-4 sm:p-8 mt-4 sm:mt-8 rounded-lg shadow-lg mb-6 sm:mb-12">
        <p className="text-xl sm:text-2xl font-bold mb-1">Your Orders</p>
        <p className="text-sm sm:text-md text-gray-500 mb-4 sm:mb-8">
          Access to all previous orders
        </p>

        <table className="w-full text-left font-Poppins">
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
              <OrderTable orders={folders} />
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No orders available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-4 sm:mt-6">
          <nav className="inline-flex -space-x-px">
            <button className="py-1 px-2 sm:py-2 sm:px-3 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700">
              &lt;
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className="py-1 px-2 sm:py-2 sm:px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              >
                {page}
              </button>
            ))}
            <button className="py-1 px-2 sm:py-2 sm:px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700">
              &gt;
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
