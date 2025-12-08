export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background/80 backdrop-blur-sm z-50">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-200 animate-pulse opacity-50"></div>
      </div>
    </div>
  );
}
