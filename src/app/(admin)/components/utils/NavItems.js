"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavItems = ({ navigation }) => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href);

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex items-center justify-between rounded-md p-2 text-sm font-semibold leading-6 transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-x-3">
                      <item.icon className="h-6 w-6 shrink-0" />
                      {item.name}
                    </div>

                    {/* Notification Badge */}
                    {item.count ? (
                      <span
                        className={`ml-auto inline-flex min-w-[20px] items-center justify-center rounded-full px-2 text-xs font-medium ${
                          item.hasUnread
                            ? "bg-red-500 text-white"
                            : "bg-gray-300 text-gray-700"
                        }`}
                      >
                        {item.count}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default NavItems;
