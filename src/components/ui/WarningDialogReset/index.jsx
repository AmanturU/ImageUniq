import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../dialog"; // Импортируйте ваши компоненты из библиотеки
import { Button } from "../button";
import { useResetPasswordMutation } from "../../../services/user";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { logout } from "../../../features/authSlice";
import { clearUser } from "../../../features/userSlice";

const WarningDialogReset = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [resetPassword] = useResetPasswordMutation();
  const { toast } = useToast();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(["access"]);

  const onSuccessful = () => {
    toast({
      title: "Success.",
      description: "A password reset link has been sent to your email address.",
    });

    dispatch(logout());
    dispatch(clearUser());
    removeCookie("access");
    navigate("/login");
  };

  const handleConfirm = async () => {
    if (email) {
      try {
        await resetPassword(email);
        setIsOpen(false);
        onSuccessful();
      } catch (error) {
        console.error("Reset Password Error:", error);
      }
    } else {
      console.error("Email not provided");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <a href="#" className="text-sm text-accent">
              Reset the password
        </a>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <div className="mt-3">
            <DialogDescription>
              Please enter your email address to receive a link to reset your password.
              <br />
              If you proceed, the link will be sent to the provided email address.
            </DialogDescription>

          </div>
          <div className="mt-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Email"
            />
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={handleConfirm}
            className="bg-accent text-white hover:bg-accent-foreground"
          >
            Confirm
          </Button>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="border border-gray-500 text-gray-500 text-sm font-medium py-2 px-4 rounded-md w-full bg-transparent hover:bg-gray-500 hover:text-white transition-colors duration-300"
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WarningDialogReset;
