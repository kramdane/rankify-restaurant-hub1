import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactSelection } from "@/components/ContactSelection";
import { TemplateSelection } from "@/components/TemplateSelection";
import { toast } from "sonner";

const CAMPAIGN_STEPS = ["contacts", "template", "preview"] as const;
type CampaignStep = typeof CAMPAIGN_STEPS[number];

const NewCampaign = () => {
  const [currentStep, setCurrentStep] = useState<CampaignStep>("contacts");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const form = useForm({
    defaultValues: {
      name: "",
      template: "",
      channel: "email",
    },
  });

  const toggleContact = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleNext = async () => {
    if (currentStep === "contacts" && selectedContacts.length === 0) {
      toast.error("Please select at least one contact");
      return;
    }

    const currentIndex = CAMPAIGN_STEPS.indexOf(currentStep);
    if (currentIndex < CAMPAIGN_STEPS.length - 1) {
      setCurrentStep(CAMPAIGN_STEPS[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = CAMPAIGN_STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(CAMPAIGN_STEPS[currentIndex - 1]);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={currentStep} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="contacts">1. Select Contacts</TabsTrigger>
                <TabsTrigger value="template">2. Choose Template</TabsTrigger>
                <TabsTrigger value="preview">3. Preview & Send</TabsTrigger>
              </TabsList>

              <TabsContent value="contacts">
                <div className="space-y-4">
                  <Form {...form}>
                    <FormField
                      control={form.control}
                      name="channel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Communication Channel</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="email" id="email" />
                                <label htmlFor="email">Email</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="sms" id="sms" />
                                <label htmlFor="sms">SMS</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="whatsapp" id="whatsapp" />
                                <label htmlFor="whatsapp">WhatsApp</label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </Form>

                  <ContactSelection
                    selectedContacts={selectedContacts}
                    onContactToggle={toggleContact}
                    channel={form.watch("channel")}
                  />
                </div>
              </TabsContent>

              <TabsContent value="template">
                <Form {...form}>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campaign Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter campaign name" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="template"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Template</FormLabel>
                          <FormControl>
                            <TemplateSelection
                              value={field.value}
                              onChange={field.onChange}
                              channel={form.watch("channel")}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
              </TabsContent>

              <TabsContent value="preview">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Selected Contacts ({selectedContacts.length})</h3>
                    <div className="text-sm text-gray-600">
                      {/* Contact preview will be populated by the query */}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => currentStep === "contacts" ? navigate("/dashboard/campaigns") : handleBack()}
              >
                {currentStep === "contacts" ? "Cancel" : "Back"}
              </Button>
              <Button onClick={handleNext}>
                {currentStep === "preview" ? "Send Campaign" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewCampaign;
