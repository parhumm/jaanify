"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/stores/auth-store";

/**
 * NavbarAuth — Authentication-aware navbar component
 *
 * When authenticated: user avatar + name + dropdown (Dashboard, Sign Out)
 * When not authenticated: "Sign In" button linking to /login
 */

export default function NavbarAuth() {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [dropdownOpen]);

  // Loading state — show skeleton
  if (isLoading) {
    return (
      <div className="h-9 w-20 rounded-lg bg-(--color-sage-light)/10 animate-pulse" />
    );
  }

  // Not authenticated — show Sign In button
  if (!isAuthenticated || !user) {
    return (
      <a
        href="/login"
        className={cn(
          "inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium",
          "text-(--color-sage-dark) border border-(--color-sage-light)/30",
          "hover:bg-(--color-sage-light)/10 hover:border-(--color-sage-light)/50",
          "active:scale-[0.98]",
          "transition-all duration-150 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-sage) focus-visible:ring-offset-2"
        )}
      >
        Sign In
      </a>
    );
  }

  // Authenticated — show avatar + dropdown
  const displayName = user.name ?? user.email ?? "User";
  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-lg",
          "hover:bg-(--color-sage-light)/10",
          "transition-all duration-150 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-sage) focus-visible:ring-offset-2"
        )}
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
        aria-label="Account menu"
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt=""
            className="h-8 w-8 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-(--color-sage) text-white flex items-center justify-center text-xs font-semibold">
            {initials}
          </div>
        )}
        <span className="text-sm font-medium text-(--color-text) hidden sm:inline max-w-[120px] truncate">
          {displayName}
        </span>
        <svg
          className={cn(
            "h-4 w-4 text-(--color-text)/40 transition-transform duration-150",
            dropdownOpen && "rotate-180"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {dropdownOpen && (
        <div
          className={cn(
            "absolute right-0 mt-2 w-48 rounded-xl py-1",
            "bg-(--color-bg) border border-(--color-sage-light)/20",
            "shadow-lg",
            "z-50"
          )}
          role="menu"
          aria-label="Account options"
        >
          <a
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 text-sm",
              "text-(--color-text) hover:bg-(--color-sage-light)/10",
              "transition-colors duration-100"
            )}
            role="menuitem"
            onClick={() => setDropdownOpen(false)}
          >
            <svg
              className="h-4 w-4 text-(--color-text)/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            Dashboard
          </a>

          <div className="border-t border-(--color-sage-light)/15 my-1" />

          <button
            type="button"
            onClick={async () => {
              setDropdownOpen(false);
              await logout();
            }}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left",
              "text-(--color-text)/70 hover:bg-red-50 hover:text-red-600",
              "transition-colors duration-100"
            )}
            role="menuitem"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
