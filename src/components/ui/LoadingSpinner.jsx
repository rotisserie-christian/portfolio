import { cn } from "@/utils/cn";

const sizeClasses = {
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg",
};

export default function LoadingSpinner({ size = "lg", className, label = "Loading" }) {
    return (
        <span
            role="status"
            aria-label={label}
            className={cn("loading loading-spinner", sizeClasses[size], className)}
        />
    );
}
