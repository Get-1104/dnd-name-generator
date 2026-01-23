// components/JsonLd.tsx
type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // 让它输出为 SSR 的结构化数据（view-source 能看到）
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
