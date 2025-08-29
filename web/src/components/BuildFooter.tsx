import React from 'react';

// Default fallback data
const DEFAULT_BUILD_INFO = {
  commit: {
    sha: 'unknown',
    shortSha: 'dev',
    date: new Date().toISOString(),
    branch: 'development',
    tag: null
  },
  build: {
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    runId: null,
    runNumber: null,
    actor: null,
    repository: null
  },
  version: '1.0.0'
};

// Try to import build info, fallback to default if not available
let BUILD_INFO = DEFAULT_BUILD_INFO;
try {
  // This will be replaced by bundler at build time
  const buildInfoModule = require('../build-info');
  BUILD_INFO = buildInfoModule.BUILD_INFO || buildInfoModule.default || DEFAULT_BUILD_INFO;
} catch (e) {
  // Use default if import fails
  console.debug('Build info not available, using defaults');
}

interface BuildFooterProps {
  className?: string;
}

/**
 * BuildFooter component displays build metadata including commit info, build time, and branch
 * Honors VITE_SHOW_BUILD_INFO environment variable - if not 'true', component is hidden
 */
export const BuildFooter: React.FC<BuildFooterProps> = ({ className = '' }) => {
  // Check if build info should be shown (defaults to false for security)
  const showBuildInfo = import.meta.env.VITE_SHOW_BUILD_INFO === 'true';
  
  if (!showBuildInfo) {
    return null;
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getCommitUrl = () => {
    if (BUILD_INFO?.build?.repository && BUILD_INFO?.commit?.sha) {
      return `https://github.com/${BUILD_INFO.build.repository}/commit/${BUILD_INFO.commit.sha}`;
    }
    return null;
  };

  const commitUrl = getCommitUrl();

  return (
    <footer className={`text-xs text-[#6b7280] bg-[#0a0d14] border-t border-[#1a2033] px-4 py-2 ${className}`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <span className="text-[#9fb3ff] font-medium">QuantumCore v{BUILD_INFO?.version || '1.0.0'}</span>
          
          {BUILD_INFO?.commit && (
            <div className="flex items-center space-x-2">
              <span>•</span>
              {commitUrl ? (
                <a 
                  href={commitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#60a5fa] hover:text-[#93c5fd] underline transition-colors"
                  title={`Commit ${BUILD_INFO.commit.sha}`}
                >
                  {BUILD_INFO.commit.shortSha}
                </a>
              ) : (
                <span className="text-[#60a5fa]">{BUILD_INFO.commit.shortSha}</span>
              )}
              
              {BUILD_INFO.commit.branch && BUILD_INFO.commit.branch !== 'main' && (
                <>
                  <span className="text-[#4b5563]">on</span>
                  <span className="text-[#fbbf24] bg-[#1a1a1a] px-1.5 py-0.5 rounded text-xs">
                    {BUILD_INFO.commit.branch}
                  </span>
                </>
              )}
              
              {BUILD_INFO.commit.tag && (
                <>
                  <span className="text-[#4b5563]">•</span>
                  <span className="text-[#10b981] bg-[#064e3b] px-1.5 py-0.5 rounded text-xs">
                    {BUILD_INFO.commit.tag}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {BUILD_INFO?.build?.timestamp && (
            <span title={`Built: ${BUILD_INFO.build.timestamp}`}>
              Built {formatDate(BUILD_INFO.build.timestamp)}
            </span>
          )}
          
          {BUILD_INFO?.build?.runId && (
            <>
              <span>•</span>
              <span title={`Build Run: ${BUILD_INFO.build.runId}`}>
                Run #{BUILD_INFO.build.runNumber || BUILD_INFO.build.runId}
              </span>
            </>
          )}
        </div>
      </div>
    </footer>
  );
};

export default BuildFooter;