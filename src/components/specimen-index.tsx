type SpecimenGroup = {
  title: string;
  items: string[];
};

/** Stack index: one ruled row per group, mono label on the left, items on the right. */
export function SpecimenIndex({ groups }: { groups: SpecimenGroup[] }) {
  return (
    <dl className="border-b border-[color:var(--border)]">
      {groups.map((group) => (
        <div
          key={group.title}
          className="grid gap-x-8 gap-y-2 border-t border-[color:var(--border)] py-4 first:border-t-0 first:pt-0 sm:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)]"
        >
          <dt className="label-mono pt-0.5 text-[color:var(--muted)]">{group.title}</dt>
          <dd>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-sm text-[color:var(--foreground)]">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}
