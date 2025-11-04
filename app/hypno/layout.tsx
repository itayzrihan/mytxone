export default function HypnoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* This layout will hide navbar/footer for hypno pages */
    <div className="flex-1">
      {children}
    </div>
  );
}
