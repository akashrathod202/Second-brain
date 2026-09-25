type ContentItemProps = {
    icon: ReactNode;
    title: string;
    type: string;
    collection: string;
    time: string;
  };
  
function  ContenItem  ({ icon, title, type, collection, time }: ContentItemProps) {
    return (
      <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5 last:border-b-0 hover:bg-white/[0.03] transition-colors">
        <div className="w-10 h-10 rounded-xl bg-white/5 text-gray-400 flex items-center justify-center shrink-0">
          {icon}
        </div>
  
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white truncate">{title}</h3>
  
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500">{type}</span>
            <span className="text-gray-700">•</span>
            <span className="text-xs text-amber-400">#{collection}</span>
          </div>
        </div>
  
        <span className="text-xs text-gray-500 shrink-0">{time}</span>
      </div>
    );
  };

  export default ContenItem
   
  
  
  