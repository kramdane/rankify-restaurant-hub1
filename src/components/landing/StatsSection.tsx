export const StatsSection = () => {
  return (
    <section className="w-full border-t bg-accent py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-[#8B5CF6]">40% 📈</div>
              <p className="text-muted">More repeat customers with loyalty rewards</p>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-[#8B5CF6]">20% ⭐</div>
              <p className="text-muted">Increase in average customer ratings</p>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-[#8B5CF6]">2x 🚀</div>
              <p className="text-muted">Faster review responses vs competitors</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};