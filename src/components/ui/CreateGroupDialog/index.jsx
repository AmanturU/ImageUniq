import React, { useState } from "react";
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

const CreateGroupDialog = ({ addUser, selectedUsers, removeUser, maxUsers }) => {
  const handleAddUser = (event) => {
    event.preventDefault();
    const email = event.target.email.value.trim();
    if (email) {
      addUser(email);
      event.target.reset();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="btn w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-black ml-2">
          +
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md mx-auto p-6 bg-white rounded-md shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Create group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Name"
            />
          </div>

          {/* Add Users by Email */}
          <div className="mt-4 mb-2">
            {/* Поле для ввода email */}
            <form onSubmit={handleAddUser}>
              <div>
                <div className="flex justify-between">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter email"
                    required
                  />
                  <button type="submit" className="px-4 py-3 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent-foreground transition-colors duration-300">
                    Add
                  </button>
                </div>
              </div>
            </form>

            {/* Отображение выбранных пользователей */}
            <ul className="space-y-2">
              {/* {selectedUsers.map((user, index) => (
                <li key={index} className="flex items-center justify-between text-sm text-gray-700 my-2">
                  {user}
                  <button
                    type="button"
                    onClick={() => removeUser(user)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))} */}
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
            <label htmlFor="group-leader-only" className="ml-2 block text-sm text-gray-700">
              Only group leader can invite users
            </label>
          </div>
        </div>
        <DialogFooter>
          <button className="mt-4 w-full px-4 py-2 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent-foreground transition-colors duration-300">
            Create
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
