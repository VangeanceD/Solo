"use client"

import React from "react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
          <div className="text-center p-8 bg-black/60 backdrop-blur-md border border-red-500/30">
            <h1 className="text-2xl font-bold text-red-500 mb-4 font-michroma">APPLICATION ERROR</h1>
            <p className="text-white/70 mb-6 font-electrolize">
              Something went wrong. This might be due to corrupted data or a compatibility issue.
            </p>
            <div className="space-y-3">
              <Button
                onClick={this.resetError}
                className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 mr-3"
              >
                Try Again
              </Button>
              <Button
                onClick={() => {
                  localStorage.clear()
                  window.location.reload()
                }}
                className="bg-red-900/20 hover:bg-red-900/30 text-red-400 border border-red-500/30"
              >
                Reset All Data
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
