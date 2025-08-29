interface BuildFooterProps {
  className?: string
}

// Define fallback build info for development
const fallbackBuildInfo = {
  commitSha: 'dev',
  commitShaFull: 'development',
  buildTime: new Date().toISOString(),
  branch: 'local',
  buildNumber: '0',
  version: 'dev-local',
  buildDate: new Date().toLocaleDateString(),
  buildTimeFormatted: new Date().toLocaleString()
}

export function BuildFooterSync({ className = '' }: BuildFooterProps) {
  const showBuildInfo = import.meta.env.VITE_SHOW_BUILD_INFO === 'true'
  
  if (!showBuildInfo) {
    return null
  }

  let buildInfo = fallbackBuildInfo

  // Try to get build info if available (will work after build)
  try {
    // @ts-ignore - Dynamic import will exist after build metadata generation
    const buildInfoModule = require('../build-info')
    if (buildInfoModule?.buildInfo) {
      buildInfo = buildInfoModule.buildInfo
    }
  } catch (error) {
    // Use fallback in development - this is expected
  }

  return (
    <div className={`text-xs text-gray-400 opacity-75 ${className}`}>
      <div className="flex items-center justify-between gap-2 text-[10px]">
        <span>v{buildInfo.version.split('-')[0] || 'dev'}</span>
        <span>#{buildInfo.commitSha}</span>
        <span>{buildInfo.buildDate}</span>
      </div>
    </div>
  )
}