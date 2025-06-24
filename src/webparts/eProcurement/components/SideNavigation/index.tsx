import * as React from 'react';
import { 
  Settings, 
  HelpCircle, LogOut 
} from 'lucide-react';


interface ISideNav{
    sidenavOpen: any;
     setSidenavOpen: any; 
     activeTab: any; setActiveTab: any; sidenavItems: any;
}

const SideNav:React.FC<ISideNav> = ({ sidenavOpen, setSidenavOpen, activeTab, setActiveTab, sidenavItems }) => {

    return (
        <div className={`bg-gray-900 text-white transition-all duration-300 ${sidenavOpen ? 'w-64' : 'w-16'} flex-shrink-0`}>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                F
              </div>
              {sidenavOpen && (
                <div>
                  <h2 className="font-bold text-sm">FIRS</h2>
                  <p className="text-xs text-gray-400">Procurement System</p>
                </div>
              )}
            </div>
          </div>
          
          <nav className="mt-8">
            {sidenavItems.map((item:any) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800 transition-colors ${
                  activeTab === item.id ? 'bg-blue-600 border-r-2 border-blue-400' : ''
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidenavOpen && <span className="text-sm">{item.name}</span>}
              </button>
            ))}
          </nav>
    
          <div className="absolute bottom-4 left-4 right-4">
            {sidenavOpen && (
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-2 py-2 text-left hover:bg-gray-800 transition-colors text-sm">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button className="w-full flex items-center gap-3 px-2 py-2 text-left hover:bg-gray-800 transition-colors text-sm">
                  <HelpCircle className="w-4 h-4" />
                  Help
                </button>
                <button className="w-full flex items-center gap-3 px-2 py-2 text-left hover:bg-gray-800 transition-colors text-sm">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      );
}

export default SideNav