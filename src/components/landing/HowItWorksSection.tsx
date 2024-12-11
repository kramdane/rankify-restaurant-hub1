export const HowItWorksSection = () => {
  return (
    <section className="w-full py-12 md:py-24 bg-accent" id="how-it-works">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
            How It Works 🎯
          </h2>
          <p className="max-w-[900px] text-muted md:text-xl">
            Three simple steps to transform your customer relationships
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="rounded-full bg-[#8B5CF6] p-4">
              <span className="text-2xl text-white">1</span>
            </div>
            <h3 className="text-xl font-bold">Sign Up in Minutes ⚡</h3>
            <p className="text-muted">Set up your profile and link your business</p>
          </div>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="rounded-full bg-[#8B5CF6] p-4">
              <span className="text-2xl text-white">2</span>
            </div>
            <h3 className="text-xl font-bold">Engage Customers 🤝</h3>
            <p className="text-muted">Collect reviews and send offers easily</p>
          </div>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="rounded-full bg-[#8B5CF6] p-4">
              <span className="text-2xl text-white">3</span>
            </div>
            <h3 className="text-xl font-bold">Grow Your Business 📈</h3>
            <p className="text-muted">Watch your reviews, loyalty, and sales soar</p>
          </div>
        </div>
      </div>
    </section>
  );
};