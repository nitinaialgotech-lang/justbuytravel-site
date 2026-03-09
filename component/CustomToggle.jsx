import { forwardRef } from "react";
import { FaChevronDown } from "react-icons/fa";

export const CustomToggle = forwardRef(({ children, onClick, show }, ref) => (
    <button
        ref={ref}
        className="flex items-center gap-1 capitalize"
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
        <FaChevronDown
            className={`transition-transform duration-200 ${show ? "rotate-180" : "rotate-0"
                }`}
        />
    </button>
));
