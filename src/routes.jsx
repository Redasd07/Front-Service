import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp, ForgotPassword, ResetPassword, OTPVerification } from "@/pages/auth";
import ScanMe from "@/pages/client/scan-me";
import ProtectedRoute from "@/components/ProtectedRoute";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    title: "client pages",
    layout: "client",
    pages: [
      {
        name: "scan me",
        path: "/client/scan-me",
        element: (
          <ProtectedRoute allowedRoles={["client"]}>
            <ScanMe />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    title: "Admin pages",
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        name: "forgot password",
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        name: "reset password",
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        name: "OTPVerification",
        path: "/OTP-verification",
        element: <OTPVerification />,
      },
    ],
  },
];

export default routes;
