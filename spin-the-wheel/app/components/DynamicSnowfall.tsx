'use client'

import dynamic from 'next/dynamic'

const Snowfall = dynamic(() => import('react-snowfall'), { ssr: false })

interface DynamicSnowfallProps {
  snowflakeCount?: number
}

const DynamicSnowfall: React.FC<DynamicSnowfallProps> = ({ snowflakeCount = 200 }) => {
  return (
    <Snowfall
      snowflakeCount={snowflakeCount}
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        zIndex: 0,
      }}
    />
  )
}

export default DynamicSnowfall

