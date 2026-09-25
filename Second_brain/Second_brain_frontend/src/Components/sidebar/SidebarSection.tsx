type SidebarSectionProps = {
    title: string;
    action?: React.ReactNode;
    children: React.ReactNode;
  };
  
  const SidebarSection = ({
    title,
    action,
    children,
  }: SidebarSectionProps) => {
    return (
      <div className="mt-7">
        <div className="mb-2 flex items-center justify-between px-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
            {title}
          </p>
  
          {action}
        </div>
  
        <div className="space-y-1">
          {children}
        </div>
      </div>
    );
  };
  
  export default SidebarSection;