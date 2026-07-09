type SectionHeaderProps = {
  label: string;
  title: string;
  dark?: boolean;
};

export default function SectionHeader({
  label,
  title,
  dark = false,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-bold uppercase tracking-wide text-accent">
        {label}
      </p>
      <h2
        className={`text-3xl font-extrabold sm:text-4xl lg:text-5xl ${
          dark ? "text-white" : "text-brand"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}
