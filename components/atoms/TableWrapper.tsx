interface TableWrapperProps {
  children: React.ReactNode;
}

export const TableWrapper = ({ children }: TableWrapperProps) => {
  return (
    <div className="w-full max-w-[100vw] overflow-hidden rounded-lg bg-bg-800">
      <div className="w-full overflow-x-auto">{children}</div>
    </div>
  );
};
