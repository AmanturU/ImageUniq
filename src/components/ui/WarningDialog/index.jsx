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
import { useGetMeQuery, useResetPasswordMutation } from "../../../services/user";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { logout } from "../../../features/authSlice";
import { clearUser } from "../../../features/userSlice";

const WarningDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: user, refetch } = useGetMeQuery();
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
    refetch();

    dispatch(logout());
    dispatch(clearUser());
    removeCookie("access");
    navigate("/login");
  };

  const handleConfirm = async () => {
    if (user?.email) {
      try {
        await resetPassword(user.email);
        setIsOpen(false);
        onSuccessful();
      } catch (error) {
        console.error("Reset Password Error:", error);
      }

    } else {
      console.error("Email not found");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="border border-accent text-accent text-sm font-medium py-2 px-4 rounded-md w-full bg-transparent hover:bg-accent hover:text-white transition-colors duration-300"
        >
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <div className="mt-3">
            <DialogDescription>
              Are you sure you want to change your password?
              <br />
              If you confirm, a message with a link to reset your password will be sent to your email.
            </DialogDescription>
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

export default WarningDialog;
