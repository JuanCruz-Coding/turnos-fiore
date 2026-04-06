import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 w-full max-w-sm text-center">
            <p className="text-2xl mb-3">Algo salió mal</p>
            <p className="text-gray-400 text-sm mb-5">
              Ocurrió un error inesperado. Por favor, recargá la página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg text-sm transition"
            >
              Recargar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
