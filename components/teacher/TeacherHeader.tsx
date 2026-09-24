export default function TeacherHeader() {
  return (
    <header className="fixed top-0 left-0 z-50 h-16 w-full border-b border-blue-950/20 bg-blue-950 text-white shadow-md">
      <div className="flex h-full items-center justify-between px-6">
        
        {/* Logo */}
        <div className="text-xl font-bold tracking-tight">
          Campus Arena
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6">
          <button className="text-sm text-blue-100 transition-colors hover:text-white">
            Notifications
          </button>

          <div className="text-sm font-medium text-blue-100">
            Teacher
          </div>
        </div>

      </div>
    </header>
  );
}
