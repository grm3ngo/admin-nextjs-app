interface StatsCardProps {
  title: string;
  value: string | number;
  className?: string;
}

export function StatsCard({ title, value, className = '' }: StatsCardProps) {
  return (
    <div className={`card flex flex-col gap-2 ${className}`}>
      <span className="text-muted text-responsive">{title}</span>
      <span className="text-3xl md:text-4xl font-bold">{value}</span>
    </div>
  );
}
