import { Component, ErrorInfo, ReactNode } from "react";
import { FaExclamationTriangle, FaSyncAlt } from "react-icons/fa";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Uncaught error in ${this.props.name || 'Component'}:`, error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full p-8 lg:p-12 bg-base-300/50 backdrop-blur-sm rounded-3xl border border-error/20 flex flex-col items-center justify-center text-center shadow-xl">
          <h2 className="text-2xl font-bold text-neutral-content/90 mb-2">
            Error 💀
          </h2>

          <p className="text-neutral-content/60 max-w-md mb-8">
            {this.props.name || 'feature'} encountered an error. Your browser might have a limitation that prevents it from working, or it just broke for some stupid reason
          </p>

          <button
            onClick={this.handleReset}
            className="btn rounded-lg px-8 flex items-center gap-2"
          >
            <FaSyncAlt />
            Reload Feature
          </button>

          {import.meta.env.DEV && (
            <div className="mt-8 p-4 bg-black/20 rounded-lg text-left w-full overflow-auto max-h-40">
              <p className="text-xs font-mono text-error/80 break-words">
                {this.state.error?.toString()}
              </p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
