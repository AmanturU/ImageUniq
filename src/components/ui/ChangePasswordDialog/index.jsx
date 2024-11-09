import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '../dialog';
import { Rules } from '../../../services/Forms/rules';
import { Eye, EyeOff } from 'lucide-react';
import { useConfirmPasswordMutation } from '../../../services/user';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

const ChangePasswordDialog = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [confirmPassword] = useConfirmPasswordMutation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    const queryParams = new URLSearchParams(window.location.search);
    const uid = queryParams.get('uid');
    let token = queryParams.get('token');

    if (token && token.endsWith('/')) {
      token = token.replace(/\/$/, '');
    }

    if (uid && token) {
      try {
        await confirmPassword({
          uidb64: uid,
          token,
          new_password: data.newPassword,
        }).unwrap();

        setIsOpen(false);
        navigate("/login");
        toast({
          title: "Success.",
          description: "Your password has been updated.",
        });
      } catch (error) {
        console.error('Error resetting password:', error);
        toast({
          title: "Error.",
          description: "There was a problem resetting your password.",
          variant: 'destructive',
        });
      }
    } else {
      console.error('Invalid or missing UID/token');
      toast({
        title: "Error.",
        description: "Invalid or missing UID/token.",
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const uid = queryParams.get('uid');
    const token = queryParams.get('token');

    if (uid && token) {
      setIsOpen(true);
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md mx-auto p-6 bg-white rounded-md shadow-lg">
        <DialogHeader>
          <DialogTitle>Update Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                {...register('newPassword', Rules.Auth.Password)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
                placeholder="New Password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                {...register('confirmPassword', {
                  validate: (value) => value === newPassword || 'Passwords do not match',
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
                placeholder="Confirm Password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <DialogFooter>
            <button
              type="submit"
              className="border border-accent text-white text-sm py-2 px-4 rounded-md w-full bg-accent hover:bg-accent-foreground transition-colors duration-300"
            >
              Change Password
            </button>
            <DialogClose asChild>
              <button className="w-full px-4 py-2 bg-gray-200 text-sm font-medium rounded-md hover:bg-gray-300">
                Cancel
              </button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
