"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminLogout } from "@/_actions/admin-stock-actions";

const AdminLogoutButton = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await adminLogout();
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="justify-self-start ease-in-out duration-300 desktop:hover:cursor-pointer desktop:hover:opacity-80"
    >
      <span className="text-white/60 underline">
        {isPending ? "Logging out..." : "Log out"}
      </span>
    </button>
  );
};

export default AdminLogoutButton;
