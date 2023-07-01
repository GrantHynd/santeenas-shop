export const LoadingSpinner = () => (
  <div className="w-full min-h-screen flex justify-center items-center">
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 animate-spin">
        <div className="h-9 w-9 rounded-full bg-white"></div>
      </div>
    </div>
  </div>
);
