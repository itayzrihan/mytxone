export default function CreateCommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* This layout will conditionally show/hide navbar based on the content */
    /* The upgrade wall will hide navbar/footer, placeholder pages will show them */
    <div className="flex-1">
      {children}
    </div>
  );
}