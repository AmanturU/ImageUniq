import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../features/authSlice";
import useAuth from "../../../hooks/useAuth";
import { useCookies } from "react-cookie";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenu,
} from "../dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from "../drawer";
import { AlignJustify, Coins } from "lucide-react";
import { clearUser } from "../../../features/userSlice";

export const NavBar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useAuth();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(["access"]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUser());
    removeCookie("access");
    navigate("/login");
  };

  const navLinkUnderline = (
    <span className="block h-0.5 bg-accent absolute inset-x-0 bottom-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
  );

  return (
    <div className="container my-6">
      <div className="flex items-center bg-white shadow-cm w-full py-3 px-5 rounded-lg justify-between">
        <Link to="/">
          <img src="/Logo.png" alt="Logo" className="h-8" />
        </Link>
        <div className="hidden md:flex w-full justify-between items-center space-x-6 ml-10">
          <div className="flex gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-accent" : "relative group pb-1 text-black"
              }
            >
              Dashboard
              {navLinkUnderline}
            </NavLink>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                isActive ? "text-accent" : "relative group pb-1 text-black"
              }
            >
              Pricing
              {navLinkUnderline}
            </NavLink>
          </div>
          <div className="flex gap-4">
            {!isAuthenticated ? (
              <>
                <NavLink to="/login">
                  <Button>Login</Button>
                </NavLink>
                <NavLink to="/signup">
                  <Button>Sign up</Button>
                </NavLink>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="flex items-center font-mono space-x-1 bg-accent px-2 py-1 text-white rounded-md">
                  <svg
                    width={12}
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="coins"
                    className="svg-inline--fa fa-coins fa-fw fa-1x "
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M176 88v0c0 .1 .1 .6 .6 1.5c.6 1.2 2 3.1 4.7 5.5c.4 .3 .8 .7 1.2 1c-18.7 .4-36.9 1.7-54.4 4.1V88c0-18 9.7-32.4 21.1-42.7s26.7-18.5 43.5-24.9C226.4 7.5 271.5 0 320 0s93.6 7.5 127.3 20.3c16.8 6.4 32.1 14.6 43.5 24.9S512 70 512 88V192 296c0 18-9.7 32.4-21.1 42.7s-26.7 18.5-43.5 24.9c-9.6 3.7-20.1 6.9-31.3 9.6V323.6c5.1-1.5 9.8-3.1 14.2-4.8c13.6-5.2 23-10.8 28.5-15.7c2.7-2.4 4.1-4.3 4.7-5.5c.6-1.1 .6-1.5 .6-1.5v0V252.4c-5.3 2.6-10.9 5-16.7 7.2c-9.6 3.7-20.1 6.9-31.3 9.6V219.6c5.1-1.5 9.8-3.1 14.2-4.8c13.6-5.2 23-10.8 28.5-15.7c2.7-2.4 4.1-4.3 4.7-5.5c.5-.9 .6-1.4 .6-1.5v0 0V148.4c-5.3 2.6-10.9 5-16.7 7.2c-13.7 5.2-29.4 9.6-46.3 12.9c-5.1-7.5-11-13.9-16.8-19.1c-10.1-9.1-21.8-16.5-34-22.6c31.7-2.3 59.3-8.2 80-16.1c13.6-5.2 23-10.8 28.5-15.7c2.7-2.4 4.1-4.3 4.7-5.5c.5-.9 .6-1.4 .6-1.5v0 0 0c0 0 0-.5-.6-1.5c-.6-1.2-2-3.1-4.7-5.5c-5.5-5-14.9-10.6-28.5-15.7C403.2 54.9 364.2 48 320 48s-83.2 6.9-110.2 17.2c-13.6 5.2-23 10.8-28.5 15.7c-2.7 2.4-4.1 4.3-4.7 5.5c-.6 1.1-.6 1.5-.6 1.5l0 0zM48 216v0c0 .1 .1 .6 .6 1.5c.6 1.2 2 3.1 4.7 5.5c5.5 5 14.9 10.6 28.5 15.7c27 10.3 66 17.2 110.2 17.2s83.2-6.9 110.2-17.2c13.6-5.2 23-10.8 28.5-15.7c2.7-2.4 4.1-4.3 4.7-5.5c.5-.9 .6-1.4 .6-1.5v0 0 0c0 0 0-.5-.6-1.5c-.6-1.2-2-3.1-4.7-5.5c-5.5-5-14.9-10.6-28.5-15.7c-27-10.3-66-17.2-110.2-17.2s-83.2 6.9-110.2 17.2c-13.6 5.2-23 10.8-28.5 15.7c-2.7 2.4-4.1 4.3-4.7 5.5c-.6 1.1-.6 1.5-.6 1.5l0 0zM0 216c0-18 9.7-32.4 21.1-42.7s26.7-18.5 43.5-24.9C98.4 135.5 143.5 128 192 128s93.6 7.5 127.3 20.3c16.8 6.4 32.1 14.6 43.5 24.9S384 198 384 216V320 424c0 18-9.7 32.4-21.1 42.7s-26.7 18.5-43.5 24.9C285.6 504.5 240.5 512 192 512s-93.6-7.5-127.3-20.3c-16.8-6.4-32-14.6-43.5-24.9S0 442 0 424V320 216zM336 320V276.4c-5.3 2.6-10.9 5-16.7 7.2C285.6 296.5 240.5 304 192 304s-93.6-7.5-127.3-20.3c-5.8-2.2-11.4-4.6-16.7-7.2V320v0c0 .1 .1 .6 .6 1.5c.6 1.2 2 3.1 4.7 5.5c5.5 5 14.9 10.6 28.5 15.7c27 10.3 66 17.2 110.2 17.2s83.2-6.9 110.2-17.2c13.6-5.2 23-10.8 28.5-15.7c2.7-2.4 4.1-4.3 4.7-5.5c.5-.9 .6-1.4 .6-1.5v0 0zM64.7 387.7c-5.8-2.2-11.4-4.6-16.7-7.2V424l0 0c0 0 0 .5 .6 1.5c.6 1.2 2 3.1 4.7 5.5c5.5 5 14.9 10.6 28.5 15.7c27 10.3 66 17.2 110.2 17.2s83.2-6.9 110.2-17.2c13.6-5.2 23-10.8 28.5-15.7c2.7-2.4 4.1-4.3 4.7-5.5c.6-1.1 .6-1.5 .6-1.5v0V380.4c-5.3 2.6-10.9 5-16.7 7.2C285.6 400.5 240.5 408 192 408s-93.6-7.5-127.3-20.3z"
                    ></path>
                  </svg>
                  <p className="text-[13px]">
                    {isAuthenticated && user ? user.daily_usage_limit : "###"}{" "}
                    credits
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Menu</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <p>Logout</p>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
        <div className="md:hidden">
          {!isAuthenticated ? (
            <Drawer>
              <DrawerTrigger>
                <AlignJustify />
              </DrawerTrigger>
              <DrawerDescription></DrawerDescription>
              <DrawerContent>
                <DrawerTitle className="mx-auto pt-2 font-normal"></DrawerTitle>
                <div className="p-4 flex flex-col gap-3 items-center">
                  <DrawerClose asChild>
                    <Link to="/" className="w-full text-center">
                      Dashboard
                    </Link>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Link to="/pricing" className="w-full text-center">
                      Pricing
                    </Link>
                  </DrawerClose>
                </div>
                <DrawerFooter>
                  <DrawerClose className="w-full" asChild>
                    <Button onClick={handleLogout} className="w-full">
                      <Link to="/login" className="w-full text-center">
                        Login/Sign Up
                      </Link>
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ) : (
            <Drawer>
              <DrawerTrigger>
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DrawerTrigger>
              <DrawerDescription></DrawerDescription>
              <DrawerContent>
                <DrawerTitle className="mx-auto pt-2 font-normal"></DrawerTitle>
                <div className="p-4 flex flex-col gap-3 items-center">
                  <DrawerClose asChild>
                    <Link to="/" className="w-full text-center">
                      Dashboard
                    </Link>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Link to="/pricing" className="w-full text-center">
                      Pricing
                    </Link>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Link to="/profile" className="w-full text-center">
                      Profile
                    </Link>
                  </DrawerClose>
                </div>
                <DrawerFooter>
                  <DrawerClose className="w-full" asChild>
                    <Button onClick={handleLogout} className="w-full">
                      Logout
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )}
        </div>
      </div>
    </div>
  );
};
