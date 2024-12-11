export const StatsSection = () => {
  return (
    <section className="w-full border-t bg-accent py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="text-4xl font-bold text-[#8B5CF6] mb-2">40% 📈</div>
            <p className="text-muted">More repeat customers with loyalty rewards</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="text-4xl font-bold text-[#8B5CF6] mb-2">20% ⭐</div>
            <p className="text-muted">Increase in average customer ratings</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="text-4xl font-bold text-[#8B5CF6] mb-2">2x 🚀</div>
            <p className="text-muted">Faster review responses vs competitors</p>
          </div>
        </div>
      </div>
    </section>
  );
};