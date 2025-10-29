import path from "path";
import { existsSync } from "fs";
import Link from "next/link";

const __mdxDir = path.resolve(process.cwd(), "src", "app", "tasks", "[task]");

const existMdxFile = (task: string) => {
  const mdxFilePath = path.resolve(__mdxDir, `${task}.mdx`);
  return existsSync(mdxFilePath);
};

export default function TaskListComponent({
  tasks,
}: {
  tasks: TarkovTraderTask[];
}) {
  return (
    <ul className="list-disc list-inside mt-2 ml-2">
      {tasks.map((t) => (
        <li key={t.normalizedName}>
          <Link
            href={`/tasks/${t.normalizedName}`}
            target="_blank"
            className={existMdxFile(t.normalizedName) ? "underline" : ""}
          >
            {t.name}
            {t.kappaRequired ? " ⁽ᴷ⁾" : ""}
            {t.factionName != "Any" ? ` (${t.factionName})` : ""}
          </Link>
        </li>
      ))}
    </ul>
  );
}
