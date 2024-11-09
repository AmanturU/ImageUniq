import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import {
  useGetMeQuery,
  useGetUserGroupInfoQuery,
  useAddUserToGroupMutation,
  useRemoveUserToGroupMutation,
} from "../../../services/user";
import { useForm } from "react-hook-form";
import { Rules } from "../../../services/Forms/rules";
import { useToast } from "@/components/ui/use-toast";

const EditGroupDialog = ({ selectedUsers, maxUsers }) => {
  const [addUserToGroup] = useAddUserToGroupMutation();
  const [removeUserFromGroup] = useRemoveUserToGroupMutation();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const {
    data: user,
    error: userError,
    isLoading: userLoading,
  } = useGetMeQuery();
  const [groupData, setGroupData] = useState(null);

  const { data: groupInfo, refetch } = useGetUserGroupInfoQuery(user?.id, {
    skip: !user?.id,
  });

  useEffect(() => {
    if (groupInfo) {
      setGroupData(groupInfo);
    }
  }, [groupInfo]);

  const onSubmit = async (formData) => {
    const email = formData.email.trim();

    if (email) {
      try {
        await addUserToGroup({ id: user.id, group_user_email: email }).unwrap();

        toast({
          title: "Success.",
          description: "The user has been added to the group.",
        });

        reset();
        refetch();
      } catch (error) {
        console.error(error);
        toast({
          title: "Error.",
          description: error.data.detail || JSON.stringify(error),
          variant: "destructive",
        });
      }
    }
  };

  const removeUser = async (groupUser) => {
    if (groupUser) {
      try {
        await removeUserFromGroup({ id: user.id, group_user_id: groupUser.id });

        toast({
          title: "Success.",
          description: "The user has been removed from the group.",
        });

        refetch();
      } catch (error) {
        console.error(error);
        toast({
          title: "Error.",
          description: error.data.detail || JSON.stringify(error),
          variant: "destructive",
        });
      }
    }
  };

  if (userLoading) return <div>Loading...</div>;
  if (userError) return <div>Error loading user info</div>;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="btn w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-black ml-2">
          +
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md mx-auto p-6 bg-white rounded-md shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Add Users by Email */}
          <div className="mb-2 mt-1">
            {/* Поле для ввода email */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div className="flex justify-between">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Add User by Email
                  </label>

                  <div className="text-sm text-gray-500">
                    {selectedUsers.length}/{maxUsers} users selected
                  </div>
                </div>
                <div className="flex justify-between items-center space-x-2">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    {...register("email", Rules.Auth.Email)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter email"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent-foreground transition-colors duration-300"
                  >
                    Invite
                  </button>
                </div>
              </div>
            </form>

            {/* Отображение выбранных пользователей */}
            <ul className="space-y-2">
              {groupData?.group_users.length === 0 ? (
                <p className="text-[14px] font-medium text-gray-500 mt-3 mb-5">
                  Group is empty
                </p>
              ) : (
                <div>
                  <p className="text-[14px] font-medium text-black mt-3 mb-3">
                    Group members:
                  </p>

                  {groupData?.group_users.map((user) => (
                    <div
                      key={user?.id}
                      className="flex justify-between items-center my-1 text-gray-700"
                    >
                      <p>{user?.email}</p>
                      <button
                        type="button"
                        onClick={() => removeUser(user)}
                        className="text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </ul>
          </div>

          {/* Checkbox */}
          <div className="flex items-center my-2">
            <input
              id="group-leader-only"
              name="group-leader-only"
              type="checkbox"
              className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label
              htmlFor="group-leader-only"
              className="ml-2 block text-sm text-gray-700"
            >
              Only group leader can invite users
            </label>
          </div>
        </div>
        <DialogFooter>
          <button className="w-full px-4 py-2 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent-foreground transition-colors duration-300">
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditGroupDialog;
