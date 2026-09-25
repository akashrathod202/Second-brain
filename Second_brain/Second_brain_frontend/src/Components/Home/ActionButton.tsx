type ActionButtonProps = {
    icon: ReactNode;
    label: string;
  };
  
 export const ActionButton = ({ icon, label }: ActionButtonProps) => {
    return (
      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:bg-amber-500/10 hover:text-amber-400 transition-colors">
        <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
          {icon}
        </span>
        <span>{label}</span>
      </button>
    );
  };