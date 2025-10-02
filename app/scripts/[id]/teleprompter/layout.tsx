export default function TeleprompterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* Custom layout without navbar - no main wrapper, prevent body scrolling */
    <div className="fixed inset-0 overflow-hidden">
      {children}
    </div>
  );
}