import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Compass } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in WANDER.CCU component tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7EBDD] text-[#351E1A] flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#FFF8EF] border border-[#E8D5C2] shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C6532B] text-white flex items-center justify-center mx-auto shadow-sm">
              <Compass className="w-6 h-6 text-[#FFF8EF]" />
            </div>

            <div className="space-y-1">
              <h2 className="font-serif text-2xl font-bold text-[#351E1A]">
                WANDER<span className="text-[#C6532B] font-sans text-xs font-black ml-1">.CCU</span>
              </h2>
              <p className="text-xs text-[#351E1A]/70">
                The Calcutta Travel Journal encountered a temporary display issue.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs font-mono text-amber-900 overflow-x-auto max-h-32">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#351E1A] hover:bg-[#582822] text-[#FFF8EF] text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Journal</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
