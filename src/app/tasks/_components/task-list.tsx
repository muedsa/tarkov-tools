import Link from "next/link";

export default function TaskListComponent({
  tasks,
}: {
  tasks: TarkovTraderTask[];
}) {
  return (
    <ul className="list-disc list-inside mt-2 ml-2">
      {tasks.map((t) => (
        <li key={t.normalizedName}>
          <Link href={`/tasks/${t.normalizedName}`} target="_blank">
            {t.name}
            {t.kappaRequired ? " ⁽ᴷ⁾" : ""}
          </Link>
        </li>
      ))}
    </ul>
  );
}
