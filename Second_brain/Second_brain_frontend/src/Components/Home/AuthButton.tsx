import { NavLink } from "react-router-dom";

type AuthButtonProps = {
    title: string;
    to:string
    variant?: "primary" | "secondary";
    onClick?: () => void;
  };
  
  
  export const AuthButton = ({
    title,
    to,
    variant = "primary",
    onClick,
  }: AuthButtonProps) => {
    const baseStyles =
      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200";
  
    const variants = {
      primary:
        "bg-amber-500 text-black hover:bg-amber-400 shadow-sm hover:shadow-amber-500/20",
      secondary:
        "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white",
    };


    
  
    return (
      <NavLink
      to={to}
        onClick={onClick}
        className={`${baseStyles} ${variants[variant]}`}
      >
        {title}
      </NavLink>
    );
  };