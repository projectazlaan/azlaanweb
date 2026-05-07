'use client'

import React from 'react'
import { Clock, User, ShieldCheck, ShoppingBag } from 'lucide-react'

interface Activity {
  id: string
  user: string
  action: string
  timestamp: string
}

export default function ActivityFeed({ activities }: { activities: Activity[] }) {
  const getIcon = (action: string) => {
    if (action.toLowerCase().includes('order')) return <ShoppingBag size={14} className="text-blue-500" />
    if (action.toLowerCase().includes('product')) return <ShieldCheck size={14} className="text-green-500" />
    return <User size={14} className="text-purple-500" />
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm h-full flex flex-col border border-transparent">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-primary flex items-center gap-2">
          <Clock size={18} className="text-secondary" /> Activity Feed
        </h3>
      </div>
      <div className="space-y-4 overflow-y-auto pl-3 pr-2 flex-1 scrollbar-hide">
        {activities.map((activity) => (
          <div key={activity.id} className="relative pl-7 pb-6 last:pb-0 border-l border-border-light last:border-0">
            <div className="absolute -left-[10.5px] top-0 w-5 h-5 rounded-full bg-white border-2 border-border-light flex items-center justify-center shadow-sm">
              {getIcon(activity.action)}
            </div>
            <div>
              <p className="text-sm text-primary font-bold leading-tight">{activity.action}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-text-muted bg-section-bg px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                  {activity.user}
                </span>
                <span className="text-[10px] text-text-muted">
                  {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
