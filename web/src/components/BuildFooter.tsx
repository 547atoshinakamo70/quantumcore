import React from 'react';

export default function BuildFooter() {
  // Check if build info should be shown
  const showBuildInfo = import.meta.env.VITE_SHOW_BUILD_INFO === '1' || 
                        import.meta.env.VITE_SHOW_BUILD_INFO === 'true';

  if (!showBuildInfo) {
    return null;
  }

  // Check if BUILD_INFO is available
  const buildInfo = (globalThis as any).BUILD_INFO;
  if (!buildInfo) {
    return null;
  }

  const timestamp = new Date(buildInfo.timestamp).toLocaleString();

  return (
    <div className="mt-auto p-3 text-[#9fb3ff] text-xs opacity-60 border-t border-[#1a2033]">
      <div className="space-y-1">
        <div>
          Build: {buildInfo.shortCommit} on {buildInfo.branch}
        </div>
        <div>
          {timestamp}
          {buildInfo.tag && (
            <span className="ml-2 px-1 bg-[#1a2342] rounded text-blue-300">
              {buildInfo.tag}
            </span>
          )}
        </div>
        <div>
          <a 
            href={buildInfo.commitUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            View commit
          </a>
        </div>
      </div>
    </div>
  );
}