"use client";

import { useState, useEffect, useActionState } from "react";
import classNames from "classnames";
import { changePassword } from "@/_actions/admin-stock-actions";
import { passwordRequirements } from "@/_lib/utils/password-utils";

const passwordFields = [
  { name: "currentPassword", label: "Current password" },
  { name: "newPassword", label: "New password" },
  { name: "confirmPassword", label: "Confirm new password" },
];

const emptyValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const ChangePasswordForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState(emptyValues);
  const [visibleFields, setVisibleFields] = useState<string[]>([]);

  const [state, formAction, isPending] = useActionState(changePassword, {
    success: false,
    error: null as string | null,
  });

  useEffect(() => {
    if (state.success) {
      setValues(emptyValues);
      setVisibleFields([]);
    }
  }, [state.success]);

  const toggleVisibility = (name: string) =>
    setVisibleFields((current) =>
      current.includes(name)
        ? current.filter((field) => field !== name)
        : [...current, name]
    );

  return (
    <div className="grid gap-5 border-t border-white/20 pt-10">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="justify-self-start ease-in-out duration-300 desktop:hover:cursor-pointer desktop:hover:opacity-80"
      >
        <span className="text-white underline">
          {isOpen ? "Hide password settings" : "Change password"}
        </span>
      </button>

      {isOpen && (
        <form action={formAction} className="grid gap-5 w-full max-w-[400px]">
          {passwordFields.map((field) => {
            const isVisible = visibleFields.includes(field.name);

            return (
              <div key={field.name} className="grid gap-2">
                <label htmlFor={field.name} className="text-white">
                  {field.label}
                </label>
                <div className="relative rounded-md">
                  <input
                    id={field.name}
                    name={field.name}
                    type={isVisible ? "text" : "password"}
                    required
                    autoComplete="off"
                    value={values[field.name as keyof typeof values]}
                    onChange={(event) =>
                      setValues({ ...values, [field.name]: event.target.value })
                    }
                    className="bg-transparent text-white w-full pl-3 pr-16 py-2.5 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility(field.name)}
                    className={classNames(
                      "absolute right-3 top-1/2 -translate-y-1/2 ease-in-out duration-300",
                      "desktop:hover:cursor-pointer desktop:hover:opacity-80"
                    )}
                  >
                    <span className="text-white text-[14px] underline">
                      {isVisible ? "Hide" : "Show"}
                    </span>
                  </button>
                  <div className="absolute border border-green border-solid inset-0 pointer-events-none rounded-md" />
                </div>
              </div>
            );
          })}

          <ul className="grid gap-1">
            {passwordRequirements.map((requirement) => {
              const isMet = requirement.test(values.newPassword);

              return (
                <li key={requirement.label} className="flex items-center gap-2">
                  <span
                    className={classNames("text-[14px]", {
                      "text-green": isMet,
                      "text-white/60": !isMet,
                    })}
                  >
                    {isMet ? "✓" : "•"} {requirement.label}
                  </span>
                </li>
              );
            })}
          </ul>

          {state.error && <p className="text-red">{state.error}</p>}
          {state.success && !isPending && (
            <p className="text-green">
              Password changed. It will take a minute or two to take effect —
              use your new password next time you log in.
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="bg-green px-5 py-2 rounded-md justify-self-start ease-in-out duration-300 desktop:hover:cursor-pointer desktop:hover:opacity-80"
          >
            <span className="text-black text-subheading">
              {isPending ? "Saving..." : "Update password"}
            </span>
          </button>
        </form>
      )}
    </div>
  );
};

export default ChangePasswordForm;
