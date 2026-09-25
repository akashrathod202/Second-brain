type Variant = "primary" | "secondary";

interface ButtonProps {
  variant: Variant;
  size: "sm" | "md" | "lg";
  name: string;
  startIcon?: any;
  endIcon?: any;
  onClick: () => void;
}

const sizeStyle = {
    sm: "px-3 py-1",
    md: "px-5 py-2",
    lg: "px-7 py-3",
  };

const defaultStyle = "rounded-md";

const Variantstyle = {
  primary: "bg-purple-600 text-white",
  secondary: "bg-purple-400 text-purple-600",
};

export const Hbutton = (props: ButtonProps) => {
  return (
    <button
      className={`${Variantstyle[props.variant]} ${defaultStyle} ${sizeStyle[props.size]}`}
      onClick={props.onClick}
    >
      {props.name}
    </button>
  );
};