import React from 'react';
import { AlertTriangle, RotateCcw, Swords } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  resetKey?: string | number;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
  resetLabel?: string;
  onSecondaryAction?: () => void;
  secondaryLabel?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || "Une erreur d'affichage est survenue.",
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, errorMessage: '' });
    }
  }

  handleRecover = () => {
    this.setState({ hasError: false, errorMessage: '' });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="my-4 mx-auto max-w-xl bg-[#181410] border-2 border-[#a33939] rounded-2xl p-6 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 mx-auto rounded-xl bg-[#3b1515] border border-[#a33939] flex items-center justify-center text-[#ff9999]">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">
              {this.props.fallbackTitle || "Affichage interrompu sur cette vue"}
            </h3>
            <p className="text-xs text-[#cbb8a7] leading-relaxed">
              {this.props.fallbackMessage ||
                "Une donnée incomplète ou ancienne a provoqué une erreur sur cet onglet. Vos fiches et votre partie restent intactes."}
            </p>
            {this.state.errorMessage && (
              <p className="text-[11px] font-mono text-[#ff9999]/90 bg-[#120d0a] border border-[#3d2323] rounded-lg px-3 py-1.5 break-words">
                {this.state.errorMessage}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={this.handleRecover}
              className="px-4 py-2 rounded-xl bg-[#d4a84a] hover:bg-[#e5bd62] text-[#1a1208] text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{this.props.resetLabel || "Réessayer l'affichage"}</span>
            </button>
            {this.props.onSecondaryAction && (
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, errorMessage: '' });
                  this.props.onSecondaryAction?.();
                }}
                className="px-4 py-2 rounded-xl bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-[#ede3d1] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Swords className="w-3.5 h-3.5 text-[#d4a84a]" />
                <span>{this.props.secondaryLabel || 'Revenir à Combat & Init'}</span>
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
