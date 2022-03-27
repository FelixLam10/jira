import React from "react";
import { ReactNode } from 'react';

type FallbackRender = (props: { error: Error | null }) => React.ReactElement;

//fallbackRender异常发生时，显示备用方案渲染出来，不显示空白页面
//https://github.com.bvaughn/react-error-boundary
export class ErrorBoundary extends React.Component<React.PropsWithChildren<{ fallbackRender: FallbackRender }>, {error: Error | null}>{
    state = { error: null } 

    // 当子组件抛出异常，这里会接收到并且调用
    static getDerivedStateFromError(error: Error) {
        return {error}
    }

    render() { 
        const { error } = this.state
        const { fallbackRender, children } = this.props
        if (error) {
            return fallbackRender({error})
        }
        return children
    }
}