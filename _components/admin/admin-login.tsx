"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/_actions/admin-stock-actions";

const AdminLogin = () => {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      const result = await adminLogin(prevState, formData);
      if (!result.error) {
        router.refresh();
      }
      return result;
    },
    { error: null as string | null },
  );

  return (
    <form action={formAction} className="grid gap-5 w-full max-w-[400px]">
      <label htmlFor="password" className="text-white text-subheading">
        Admin password
      </label>
      <div className="relative rounded-md">
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="bg-transparent text-white w-full px-3 py-2.5 focus:outline-none"
        />
        <div className="absolute border border-green border-solid inset-0 pointer-events-none rounded-md" />
      </div>
      {state.error && <p className="text-red">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-green px-3 py-2 rounded-md justify-self-start ease-in-out duration-300 desktop:hover:cursor-pointer desktop:hover:opacity-80"
      >
        <span className="text-black text-subheading">
          {isPending ? "Checking..." : "Log in"}
        </span>
      </button>
    </form>
  );
};

export default AdminLogin;
