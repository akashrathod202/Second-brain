 
type StatCardProps = {
    icon: ReactNode;
    title: string;
    value: string;
  };
  
  export const StatCard = ({ icon, title, value }: StatCardProps) => {
    return (
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.05] transition-colors">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            {icon}
          </div>
          <span className="text-2xl font-bold text-white">{value}</span>
        </div>
  
        <p className="mt-4 text-sm text-gray-500">{title}</p>
      </div>
    );
  };