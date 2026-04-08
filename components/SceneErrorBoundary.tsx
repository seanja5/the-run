'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export default class SceneErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[SceneErrorBoundary] 3D scene crashed:', error, info)
  }

  render() {
    if (this.state.error) {
      console.error('[Scene] Render error:', this.state.error.message)
      return null
    }
    return this.props.children
  }
}
