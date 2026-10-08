/**
 * Inline JSON-LD script — server component, zero JS.
 * Pass one or more schema objects; renders a <script> per schema.
 */

/** Escape "<" so a string value can never close the script element. */
function serialize(schema: object): string {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}

export function JsonLd({ schemas }: { schemas: ReadonlyArray<object> }) {
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted internal data
          dangerouslySetInnerHTML={{ __html: serialize(schema) }}
        />
      ))}
    </>
  );
}
