export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* This layout will hide navbar/footer for resume page */
    <div className="flex-1">
      {children}
    </div>
  );
}
