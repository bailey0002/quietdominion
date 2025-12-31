import { useEffect } from 'react'

function Notification({ notification, onDismiss }) {
  useEffect(() => {
    if (notification.duration) {
      const timeout = setTimeout(() => {
        onDismiss(notification.id)
      }, notification.duration)
      
      return () => clearTimeout(timeout)
    }
  }, [notification, onDismiss])
  
  const typeStyles = {
    event: 'border-gold/50 bg-gold/5',
    success: 'border-moss/50 bg-moss/5',
    warning: 'border-rust/50 bg-rust/5',
    info: 'border-sepia/50 bg-sepia/5',
  }
  
  return (
    <div 
      className={`
        p-4 rounded border backdrop-blur-sm
        animate-slide-up
        ${typeStyles[notification.type] || typeStyles.info}
      `}
    >
      <p className="font-body text-sm text-parchment/90">
        {notification.message}
      </p>
      
      {notification.dismissible !== false && (
        <button
          onClick={() => onDismiss(notification.id)}
          className="absolute top-2 right-2 text-parchment/50 hover:text-parchment"
        >
          ×
        </button>
      )}
    </div>
  )
}

export function NotificationStack({ notifications, onDismiss }) {
  if (notifications.length === 0) return null
  
  return (
    <div className="fixed bottom-4 right-4 z-40 w-80 space-y-2">
      {notifications.slice(-3).map(notification => (
        <Notification
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  )
}
