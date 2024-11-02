const SuggestedGifts = () => {
  return (
    <div className="w-full space-y-4 bg-gradient-to-b from-[#1B1404] to-[#2C1F06] py-4">
      <h3 className="px-8 text-2xl font-bold text-white">Suggested Gifts</h3>
      <div className="flex items-center space-x-3 overflow-x-auto px-8 no-scrollbar">
        {Array.from({ length: 13 }).map((_, index) => (
          <div
            className="flex w-[115px] shrink-0 flex-col rounded-lg"
            key={index}
          >
            <img
              className="aspect-[115/80] w-full rounded-md object-cover"
              src="https://picsum.photos/id/237/200/300"
            />
            <div className="line-clamp-2 py-2 text-left text-[0.625rem] font-semibold text-white">
              Item name Tom Ford Item name Tom Ford
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[0.5rem] text-white/60">Brand Name</p>
              <div className="flex flex-wrap items-center justify-end gap-x-1">
                <span className="text-[0.625rem] font-bold text-white">
                  $15
                </span>
                <span className="text-[0.5rem] text-white/50 line-through">
                  $23
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedGifts;
