export default function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold text-primary-500">{title}</h1>
      {description && <p className="text-sm text-neutral-400">{description}</p>}
    </div>
  );
}
