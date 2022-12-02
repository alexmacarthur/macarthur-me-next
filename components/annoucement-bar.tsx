const AnnouncementBar = ({ children }) => {
  return (
    <div className="bg-purple-500 text-center p-3 text-white mb-8 text-sm">
      {children}
    </div>
  );
};

export default AnnouncementBar;
