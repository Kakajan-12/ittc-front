import { AntdRegistry } from "@ant-design/nextjs-registry";

export default function AntProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AntdRegistry>{children}</AntdRegistry>;
}
