import classNames from "classnames";

export const buttonStyles = (
  cssClasses?: string,
  disabled?: boolean,
  pending?: boolean,
  colorBlack?: boolean,
  yellowStroke?: boolean,
) =>
  classNames(
    "border-4 flex text-subheading text-center py-0.5 px-4 justify-center ease-in-out duration-300 rounded-md min-w-[100px]",
    cssClasses,
    {
      "opacity-50 cursor-not-allowed hover:none": pending || disabled,
      "cursor-pointer": !(disabled || pending),
      "bg-black border-black text-white": colorBlack,
      "bg-yellow border-yellow text-black": !colorBlack,
      "desktop:hover:bg-black desktop:hover:text-white":
        !colorBlack && !(disabled || pending),
      "desktop:hover:bg-yellow desktop:hover:text-black":
        colorBlack && !(disabled || pending),
      "border-yellow": yellowStroke,
    },
  );
