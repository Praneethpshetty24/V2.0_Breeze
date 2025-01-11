export function Separator({ className = "", ...props }) {
    return (
      <div
        className={`w-full h-[1px] bg-slate-200 dark:bg-slate-700 ${className}`}
        {...props}
      ></div>
    );
  }
  