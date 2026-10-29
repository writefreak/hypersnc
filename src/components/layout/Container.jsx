export default function Container({ className = "", children }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 md:px-8 2xl:max-w-7xl ${className}`}>{children}</div>;
}
