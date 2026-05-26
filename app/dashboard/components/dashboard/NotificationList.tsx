
import { ArrowLeft, Bell, Check} from 'lucide-react';
import type { Notification } from '@/types';

interface NotificationListProps {
  notifications: Notification[];
  onBack: () => void;
}

const NotificationsList = ({ notifications, onBack }: NotificationListProps) => {

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* 1. Header (Consistent with your current UI) */}

      {/* 2. Main Content Area */}
      <div className="max-w-4xl mx-auto mt-8 px-4">
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Dashboard
            
          </span>
        </button>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
            {notifications.length > 0 && (
              <span className="bg-blue-100 text-blue-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
                {notifications.filter(n => !n.read).length} New
              </span>
            )}
          </div>
        </div>

        {/* 3. The Notification List */}
        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
            <Bell className="mx-auto text-gray-300 mb-3" size={40} />
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No Notifications</h3>
            <p className="text-sm text-gray-500">You don not have any notifications yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {notifications.map((item, index) => (
              <div 
                key={item.id}
                className={`flex items-start gap-4 p-5 hover:bg-gray-50 transition-colors cursor-pointer group ${
                  index !== notifications.length - 1 ? 'border-b border-gray-100' : ''
                } ${!item.read ? 'bg-blue-50/30' : ''}`}
              >
                {/* Status Icon */}
                <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  !item.read ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {!item.read ? <Bell size={18} /> : <Check size={18} />}
                </div>

                {/* Text Content */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <p className={`text-sm md:text-base ${!item.read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                      {item.message}
                    </p>
                    {!item.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-4"></div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              
              </div>
            ))}
          </div>
        )}
        {/* Footer info */}
        <p className="text-center text-xs text-gray-400 mt-8">
          SecurePay CH Platform · Trusted Intermediary · Demo Mode
        </p>
      </div>
    </div>
  );
};

export default NotificationsList;