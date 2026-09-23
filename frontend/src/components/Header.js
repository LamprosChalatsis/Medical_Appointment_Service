import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { Link, NavLink, useNavigate } from "react-router-dom";
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

function getRole() {
  try {
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");
    return roles[0] || localStorage.getItem("role");
  } catch {
    return localStorage.getItem("role");
  }
}

const NAV_BY_ROLE = {
  ROLE_PATIENT: [
    { name: "Doctors", href: "/doctors" },
    { name: "My Appointments", href: "/appointments" },
  ],
  ROLE_DOCTOR: [
    { name: "Manage Appointments", href: "/doctor-appointments" },
    { name: "Availability", href: "/availability" },
  ],
  ROLE_ADMIN: [{ name: "Users", href: "/users" }],
};

const DASHBOARD_ROUTE = {
  ROLE_PATIENT: "/dashboard/patient",
  ROLE_DOCTOR: "/dashboard/doctor",
  ROLE_ADMIN: "/dashboard/admin",
};

export default function Header() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const role = getRole();

  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Load notifications
  useEffect(() => {
    if (!loggedIn) return;

    const load = async () => {
      try {
        const data = await fetchUnreadNotifications();
        setNotifications(Array.isArray(data) ? data : []);
      } catch {
        setNotifications([]);
      }
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

  const navigation = loggedIn ? NAV_BY_ROLE[role] || [] : [];
  const dashboardHref = DASHBOARD_ROUTE[role] || "/dashboard";

  const handleLogout = () => {
    Logout();
    navigate("/login");
  };

  const menuItemClass = (focus) =>
    classNames(
      focus ? "bg-[#F5F9FA] text-[#0C2340]" : "text-[#0C2340]/80",
      "block w-full px-4 py-3 text-left text-sm"
    );

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0C2340]/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="flex h-20 items-center justify-between">
          {/* LEFT SIDE */}
          <div className="flex items-center gap-8">
            {/* LOGO */}
            <Link to="/" className="flex shrink-0 items-center">
              <img
                src={Logo}
                alt="MediBook"
                className="h-16 w-auto sm:h-20"
              />
            </Link>

            {/* NAVIGATION (desktop) */}
            {loggedIn && navigation.length > 0 && (
              <div className="hidden items-center gap-1 md:flex">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      classNames(
                        "border-b-2 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
                        isActive
                          ? "border-[#2D8A9E] text-white"
                          : "border-transparent text-[#F5F9FA]/70 hover:text-white"
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3 sm:gap-4">
            {loggedIn ? (
              <>
                {/* Dashboard Button */}
                <Link
                  to={dashboardHref}
                  className="hidden bg-[#2D8A9E] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#257485] sm:inline-flex"
                >
                  Dashboard
                </Link>

                {/* Notifications */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    aria-label="Notifications"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="relative p-2 text-[#F5F9FA]/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <BellIcon className="h-6 w-6" />
                    {notifications.length > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 min-w-[1.25rem] rounded-full bg-[#2D8A9E] px-1.5 py-0.5 text-center text-[10px] font-semibold leading-none text-white">
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
                  <MenuButton
                    aria-label="Account menu"
                    className="flex rounded-full ring-1 ring-white/20 transition hover:ring-[#2D8A9E]"
                  >
                    <img
                      src={ProfilePic}
                      alt="User avatar"
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  </MenuButton>

                  <MenuItems className="absolute right-0 z-50 mt-3 w-56 overflow-hidden border border-[#0C2340]/10 bg-white shadow-xl focus:outline-none">
                    {/* Mobile-only links */}
                    <div className="md:hidden">
                      {navigation.map((item) => (
                        <MenuItem key={item.name}>
                          {({ focus }) => (
                            <Link to={item.href} className={menuItemClass(focus)}>
                              {item.name}
                            </Link>
                          )}
                        </MenuItem>
                      ))}
                      <div className="border-t border-[#0C2340]/10" />
                    </div>

                    <div className="sm:hidden">
                      <MenuItem>
                        {({ focus }) => (
                          <Link to={dashboardHref} className={menuItemClass(focus)}>
                            Dashboard
                          </Link>
                        )}
                      </MenuItem>
                    </div>

                    <MenuItem>
                      {({ focus }) => (
                        <Link to="/settings" className={menuItemClass(focus)}>
                          Settings
                        </Link>
                      )}
                    </MenuItem>

                    <div className="border-t border-[#0C2340]/10" />

                    <MenuItem>
                      {({ focus }) => (
                        <button
                          type="button"
                          onClick={handleLogout}
                          className={menuItemClass(focus)}
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
                className="bg-[#2D8A9E] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#257485]"
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