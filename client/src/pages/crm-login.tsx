import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Shield } from "lucide-react";

export default function CrmLogin() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">MxSmiles CRM</CardTitle>
          <CardDescription>
            Sign in to access the sales lead management system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleLogin}
            className="w-full"
            size="lg"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign in with Replit
          </Button>
          <p className="text-xs text-gray-500 text-center">
            This system is restricted to authorized sales team members only.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}