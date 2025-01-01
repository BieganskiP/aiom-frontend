interface TableWrapperProps {
  children: React.ReactNode;
}

export const TableWrapper = ({ children }: TableWrapperProps) => {
  return (
    <div className="w-full max-w-[100vw] rounded-lg bg-bg-800 overflow-x-auto">
      {children}
    </div>
  );
};
