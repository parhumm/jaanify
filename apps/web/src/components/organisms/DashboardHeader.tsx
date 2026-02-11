interface DashboardHeaderProps {
  userName: string | null;
  date: Date;
}

function getGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardHeader({ userName, date }: DashboardHeaderProps) {
  const greeting = getGreeting(date.getHours());
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="space-y-1">
      <h1 className="text-2xl font-bold text-(--color-text)">
        {greeting}
        {userName ? `, ${userName}` : ""}
      </h1>
      <p className="text-sm text-(--color-text)/60">{formattedDate}</p>
    </header>
  );
}
