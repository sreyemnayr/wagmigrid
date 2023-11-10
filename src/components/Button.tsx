import { FC, ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  as?: "button" | "a";
  color?: "red" | "blue";
  href?: string;
  target?: string;
}

const colorStyles = {
  red: "bg-red-500 hover:bg-white hover:text-red-500 hover:border-red-500 hover:shadow-red-500",
  blue: "bg-blue-500 hover:bg-white hover:text-blue-500 hover:border-blue-500 hover:shadow-blue-500",
};

export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  color = "red",
  as: Component = "button",
  href,
  target,
}) => {
  const props = href ? { href, target } : {};
  return (
    <Component
      type="button"
      className={` px-4 py-2 mx-1 my-1 text-center text-white text-sm font-bold border-2 shadow-black  border-black  rounded-lg shadow-[5px_5px_0px_0px] transform transition-all duration-300 scale-90 ${colorStyles[color]} hover:scale-100 active:bg-yellow-300 active:shadow-[1px_1px_0px_0px] active:translate-y-1 active:translate-x-1 h-fit`}
      {...props}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};
