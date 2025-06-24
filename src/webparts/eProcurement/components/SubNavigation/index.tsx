import * as React from 'react';

interface ISubNavigation{
    subtabsByMainTab: any; 
     activeTab: any; setActiveSubTab: any; activeSubTab: any;
}
// Sub Navigation Component
const SubNavigation:React.FC<ISubNavigation> = ({ subtabsByMainTab, activeTab, activeSubTab, setActiveSubTab }) => {
    if (!subtabsByMainTab[activeTab]) return null;
  
    return (
      <div className="bg-white border-b px-6">
        <div className="flex space-x-8">
          {subtabsByMainTab[activeTab].map((subTab: { id: React.Key | null | undefined; name: any; }) => (
            <button
              key={subTab.id}
              onClick={() => setActiveSubTab(subTab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeSubTab === subTab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {subTab.name}
            </button>
          ))}
        </div>
      </div>
    );
  };

  export default SubNavigation;