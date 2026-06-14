/** Renders one or more JSON-LD objects as <script type="application/ld+json">. */
export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Escape `<` so a value containing `</script>` can't break out of the tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, '\\u003c') }}
        />
      ))}
    </>
  );
}
