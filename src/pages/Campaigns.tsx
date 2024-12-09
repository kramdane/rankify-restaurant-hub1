import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface Campaign {
  id: string;
  name: string;
  template_id: string;
  status: 'draft' | 'sent' | 'scheduled';
  created_at: string;
  total_recipients: number;
  opened_count: number;
  response_count: number;
}

const Campaigns = () => {
  const navigate = useNavigate();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Campaign[];
    },
  });

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <Button onClick={() => navigate('/dashboard/campaigns/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>

        {isLoading ? (
          <div>Loading campaigns...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {campaigns?.map((campaign) => (
              <Card 
                key={campaign.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/dashboard/campaigns/${campaign.id}`)}
              >
                <CardHeader>
                  <CardTitle>{campaign.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Recipients:</span>
                      <span>{campaign.total_recipients}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Open Rate:</span>
                      <span>
                        {((campaign.opened_count / campaign.total_recipients) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Response Rate:</span>
                      <span>
                        {((campaign.response_count / campaign.total_recipients) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Campaigns;