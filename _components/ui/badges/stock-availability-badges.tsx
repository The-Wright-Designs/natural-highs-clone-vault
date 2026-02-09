interface StockAvailabilityBadgesProps {
  inStock: boolean;
}

const StockAvailabilityBadges = ({ inStock }: StockAvailabilityBadgesProps) => {
  if (inStock) {
    return (
      <div className="bg-white/90 flex items-center justify-center px-2.5 py-[3px] border-2 border-black rounded-md">
        <p
          className="text-black text-[14px] text-subheading"
          style={{ fontVariant: "small-caps" }}
        >
          In Stock
        </p>
      </div>
    );
  }

  return (
    <div className="bg-red border-4 border-red flex items-center justify-center px-1 rounded-md">
      <p
        className="text-white text-[14px] text-subheading"
        style={{ fontVariant: "small-caps" }}
      >
        Out of Stock
      </p>
    </div>
  );
};

export default StockAvailabilityBadges;
