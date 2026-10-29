import { buttonClasses } from "./Button.jsx";

export default function LinkButton({ variant, full, className, children, ...props }) {
  return (
    <a className={buttonClasses({ variant, full, className })} {...props}>
      {children}
    </a>
  );
}
