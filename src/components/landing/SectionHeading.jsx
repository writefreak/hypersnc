export default function SectionHeading({ title, children }) {
  return (
    <div className="max-w-2xl space-y-3">
      <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl 2xl:text-5xl">{title}</h2>
      {children && <p className="text-lg leading-relaxed text-muted">{children}</p>}
    </div>
  );
}
