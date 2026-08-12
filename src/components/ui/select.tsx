import React, { useState, useRef, useEffect, SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, value, onChange, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Parse options from children
    const options: { value: string; label: React.ReactNode; isGroup?: boolean; groupLabel?: string }[] = [];
    
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;
      
      const childProps = (child as any).props;
      
      if (child.type === 'optgroup') {
        options.push({ value: '', label: childProps.label, isGroup: true });
        React.Children.forEach(childProps.children, (opt) => {
          if (React.isValidElement(opt) && opt.type === 'option') {
            const optProps = (opt as any).props;
            options.push({ value: optProps.value, label: optProps.children });
          }
        });
      } else if (child.type === 'option') {
        options.push({ value: childProps.value, label: childProps.children });
      }
    });

    // Find the currently selected option to display its label
    const selectedOption = options.find(o => !o.isGroup && o.value === value);

    const handleSelect = (val: string) => {
      if (onChange) {
        // Mock a change event that matches what native select would emit
        const event = {
          target: { value: val }
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(event);
      }
      setIsOpen(false);
    };

    return (
      <div ref={containerRef} className={cn("relative", className)}>
        {/* Hidden real select for forms / refs */}
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          className="hidden"
          {...props}
        >
          {children}
        </select>
        
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex h-full min-h-9 w-full items-center justify-between rounded-xl border border-slate-300 dark:border-slate-800 bg-white/90 dark:bg-slate-950/60 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500 transition-all cursor-pointer shadow-sm hover:border-emerald-500/50",
            isOpen && "border-emerald-500/50 ring-2 ring-emerald-500/20"
          )}
        >
          <span className="truncate">{selectedOption ? selectedOption.label : "Selecione..."}</span>
          <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform duration-200 shrink-0 ml-2", isOpen && "rotate-180")} />
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1 max-h-60 min-w-full w-max overflow-y-auto overflow-x-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md p-1.5 text-slate-700 dark:text-slate-300 shadow-xl ring-1 ring-black/5">
            {options.map((opt, i) => (
              opt.isGroup ? (
                <div key={`group-${i}`} className="px-2 py-1.5 text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mt-2 first:mt-0 truncate">
                  {opt.label}
                </div>
              ) : (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-lg px-2 py-2 text-xs sm:text-sm outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:focus:bg-slate-800 dark:hover:text-slate-50",
                    value === opt.value && "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 font-medium"
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";
