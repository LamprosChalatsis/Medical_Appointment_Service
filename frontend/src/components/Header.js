import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/MediBookLogo.png";
import ProfilePic from "../assets/Profile.jpg";
import { isLoggedIn } from "../utils/auth";
import { Logout } from "../api/auth";
import { useEffect, useState, useRef } from "react";
import NotificationDropdown from "./NotificationDropdown";
import { fetchUnreadNotifications } from "../api/notifications";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  const role = roles[0] || localStorage.getItem("role");

  // Load notifications
  useEffect(() => {
    if (!loggedIn) return;

    const load = async () => {
      const data = await fetchUnreadNotifications();
      setNotifications(data);
    };

    load();
  }, [loggedIn]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navByRole = {
    ROLE_PATIENT: [
      { name: "Doctors", href: "/doctors" },
      { name: "My Appointments", href: "/appointments" },
    ],
    ROLE_DOCTOR: [
      { name: "Manage Appointments", href: "/doctor-appointments" },
      { name: "Availability", href: "/availability" },
    ],
    ROLE_ADMIN: [
      { name: "Users", href: "/users" },
    ],
  };

  const dashboardRoute = {
    ROLE_PATIENT: "/dashboard/patient",
    ROLE_DOCTOR: "/dashboard/doctor",
    ROLE_ADMIN: "/dashboard/admin",
  };

  const navigation = loggedIn ? (navByRole[role] || []) : [];

  const handleLogout = () => {
    Logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/85 backdrop-blur-md border-b border-white/10 shadow-sm">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-8">

            {/* LOGO */}
            <Link to="/" className="flex items-center">
              <img
                src={Logo}
                alt="MediBook Logo"
                className="h-16 sm:h-20 w-auto scale-110"

              />
            </Link>

            {/* NAVIGATION */}
            {loggedIn && (
              <div className="flex items-center gap-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-slate-200 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-medium transition"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            {loggedIn ? (
              <>
                {/* Dashboard Button */}
                <Link
                  to={dashboardRoute[role] || "/dashboard"}
                  className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow"
                >
                  Dashboard
                </Link>

                {/* Notifications */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="relative p-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 transition"
                  >
                    <BellIcon className="h-6 w-6" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  <NotificationDropdown
                    open={dropdownOpen}
                    notifications={notifications}
                    setNotifications={setNotifications}
                  />
                </div>

                {/* Profile Menu */}
                <Menu as="div" className="relative">
                  <MenuButton className="flex rounded-full ring-1 ring-white/10 hover:ring-white/20 transition">
                    <img
                      src={ProfilePic}
                      alt="User avatar"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </MenuButton>

                  <MenuItems className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">

                {/* Settings */}
                <MenuItem>
                  {({ focus }) => (
                    <Link
                      to="/settings"
                      className={classNames(
                        focus ? "bg-gray-50" : "",
                        "block px-4 py-3 text-sm text-gray-700"
                      )}
                    >
                      Settings
                    </Link>
                  )}
                </MenuItem>

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Sign Out */}
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={handleLogout}
                      className={classNames(
                        focus ? "bg-gray-50" : "",
                        "block w-full text-left px-4 py-3 text-sm text-gray-700"
                      )}
                    >
                      Sign out
                    </button>
                  )}
                </MenuItem>

              </MenuItems>
                </Menu>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition shadow"
              >
                Login
              </Link>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}