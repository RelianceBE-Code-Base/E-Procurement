import * as React from 'react';
import { 
 Search, Bell, Menu, X
} from 'lucide-react';


interface ITopNavigation{
    sidenavOpen: any;
     setSidenavOpen: any; 
}
// Header Component
const TopNavigation:React.FC<ITopNavigation> = ({ sidenavOpen, setSidenavOpen }) => {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidenavOpen(!sidenavOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                {sidenavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Federal Inland Revenue Service</h1>
                <p className="text-sm text-gray-600">Procurement Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search requests..." 
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-500">Procurement Officer</p>
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  JD
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  };

  export default TopNavigation;