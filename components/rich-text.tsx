import type { ReactNode } from "react";

function renderInline(text: string) {
  const strongPattern = /\*\*(.*?)\*\*/g;
  const parts = text.split(strongPattern);

  return parts.map((part, index) =>
    index % 2 === 1 ? <strong key={index}>{part}</strong> : part,
  );
}

export function RichText({ body }: { body: string }) {
  const lines = body.split("\n");
  const nodes: ReactNode[] = [];
  let listItems: string[] = [];

  function flushList() {
    if (!listItems.length) return;

    nodes.push(
      <ul className="mt-4 grid gap-2" key={`list-${nodes.length}`}>
        {listItems.map((item) => (
          <li className="flex gap-3 text-sm leading-7 text-stone-700" key={item}>
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-olive-600" />
            <span>{renderInline(item)}</span>
          </li>
        ))}
      </ul>,
    );
    listItems = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      continue;
    }

    if (line.startsWith("- ")) {
      listItems.push(line.slice(2));
      continue;
    }

    flushList();

    if (line.startsWith("### ")) {
      nodes.push(
        <h3 className="mt-8 text-xl font-semibold text-stone-950" key={line}>
          {renderInline(line.slice(4))}
        </h3>,
      );
      continue;
    }

    if (line.startsWith("## ")) {
      nodes.push(
        <h2 className="mt-10 text-2xl font-semibold text-stone-950" key={line}>
          {renderInline(line.slice(3))}
        </h2>,
      );
      continue;
    }

    nodes.push(
      <p className="mt-4 text-base leading-8 text-stone-700" key={line}>
        {renderInline(line)}
      </p>,
    );
  }

  flushList();

  return <div className="rich-text">{nodes}</div>;
}
