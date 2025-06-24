// Footer Component
const Footer = () => {
    return (
      <footer className="bg-white border-t px-6 py-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-6">
            <p>© 2025 Federal Inland Revenue Service</p>
            <span>•</span>
            <p>Procurement Management System v2.1</p>
            <span>•</span>
            <p>Last Updated: June 24, 2025</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="hover:text-blue-600">Privacy Policy</button>
            <span>•</span>
            <button className="hover:text-blue-600">Terms of Service</button>
            <span>•</span>
            <button className="hover:text-blue-600">Support</button>
          </div>
        </div>
      </footer>
    );
  };