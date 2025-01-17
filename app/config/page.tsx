"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConfigData {
  facebookApiKey: string;
  instagramApiKey: string;
  linkedinApiKey: string;
}

export default function ConfigPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<ConfigData>({
    facebookApiKey: "",
    instagramApiKey: "",
    linkedinApiKey: "",
  });
  const router = useRouter();

  useEffect(() => {
    // Fetch existing config when component mounts
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/config");
        if (!response.ok) throw new Error("Failed to fetch configuration");
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          setConfig({
            facebookApiKey: data.facebookApiKey || "",
            instagramApiKey: data.instagramApiKey || "",
            linkedinApiKey: data.linkedinApiKey || "",
          });
        }
      } catch (error) {
        console.error("Error fetching config:", error);
        toast({
          title: "Error",
          description: "Failed to load configuration",
          variant: "destructive",
        });
      }
    };

    fetchConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) throw new Error("Failed to save configuration");

      toast({
        title: "Success",
        description: "Configuration saved successfully",
      });

      // Wait briefly for the toast to be visible
      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.location.href = "/";
    } catch (error) {
      console.error("Error saving config:", error);
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="facebookApiKey">Facebook API Key</Label>
                <Input
                  id="facebookApiKey"
                  name="facebookApiKey"
                  type="password"
                  value={config.facebookApiKey}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="instagramApiKey">Instagram API Key</Label>
                <Input
                  id="instagramApiKey"
                  name="instagramApiKey"
                  type="password"
                  value={config.instagramApiKey}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="linkedinApiKey">LinkedIn API Key</Label>
                <Input
                  id="linkedinApiKey"
                  name="linkedinApiKey"
                  type="password"
                  value={config.linkedinApiKey}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Configuration"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
