"use client"
//ejemplo para el iniicio
export const InstanciasAutoscalingGroupsChartComponent = () => {
  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      <h2 className="text-lg font-bold mb-2 text-orange-700">Auto Scaling groups Chart</h2>
      <p className="text-gray-600">
        Este es un ejemplo temporal de <strong>Auto Scaling groups</strong>.
      </p>

      <div className="mt-4 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-orange-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
          <path d="M8 12h8M12 8v8" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}