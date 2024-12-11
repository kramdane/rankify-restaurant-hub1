import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const PricingSection = () => {
  return (
    <section className="w-full py-12 md:py-24" id="pricing">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
            Simple, Transparent Pricing 💰
          </h2>
          <p className="max-w-[900px] text-muted md:text-xl">
            Choose the plan that's right for your business
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Starter</CardTitle>
              <div className="text-3xl font-bold">$29/mo</div>
              <CardDescription>Perfect for small businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-left">
                <li>✅ Up to 100 reviews/month</li>
                <li>✅ Basic analytics</li>
                <li>✅ Email support</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-[#8B5CF6]">
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <div className="text-3xl font-bold">$99/mo</div>
              <CardDescription>For growing businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-left">
                <li>✅ Unlimited reviews</li>
                <li>✅ Advanced analytics</li>
                <li>✅ Priority support</li>
                <li>✅ Custom branding</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <div className="text-3xl font-bold">Custom</div>
              <CardDescription>For large organizations</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-left">
                <li>✅ All Pro features</li>
                <li>✅ Custom integration</li>
                <li>✅ Dedicated support</li>
                <li>✅ SLA guarantee</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};