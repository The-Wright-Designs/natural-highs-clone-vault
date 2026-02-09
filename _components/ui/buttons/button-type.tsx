import { useFormStatus } from "react-dom";
import { ButtonProps } from "@/_types/button-types";
import { buttonStyles } from "@/_styles/button-styles";
import classNames from "classnames";

const ButtonType = ({
  children,
  onClick,
  cssClasses,
  type = "submit",
  disabled = false,
  colorBlack = false,
  ariaLabel,
  title,
  greenStroke = false,
}: ButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={buttonStyles(
        cssClasses,
        disabled,
        pending,
        colorBlack,
        greenStroke,
      )}
      disabled={disabled || pending}
      style={{ fontVariant: "small-caps" }}
      title={title}
    >
      {pending && type === "submit" ? (
        <div className="py-[3px]">
          <div
            className={classNames({
              "spinner-green": colorBlack,
              "spinner-black": !colorBlack,
            })}
          ></div>
        </div>
      ) : (
        <>{children}</>
      )}
    </button>
  );
};

export default ButtonType;
