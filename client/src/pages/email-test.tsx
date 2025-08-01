import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Mail, Users, Clock, CheckCircle, XCircle, Send } from "lucide-react";

export default function EmailTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [customEmails, setCustomEmails] = useState("");
  const [subject, setSubject] = useState("Your Dental Treatment Quote is Ready - MxSmiles");
  const [template, setTemplate] = useState(`Hi {{name}},

Thank you for your interest in {{treatmentType}} treatment with MxSmiles!

We're excited to help you achieve your perfect smile. Our team in Mexico offers world-class dental care at affordable prices.

Best regards,
The MxSmiles Team`);

  const runDemoEmails = async () => {
    setIsLoading(true);
    setResults(null);
    
    try {
      const response = await fetch('/api/emails/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error sending demo emails:', error);
      setResults({
        success: false,
        message: 'Failed to send demo emails',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendCustomBulkEmails = async () => {
    if (!customEmails.trim()) {
      alert('Please enter email addresses');
      return;
    }

    setIsLoading(true);
    setResults(null);

    const emailList = customEmails.split('\n').filter(email => email.trim());
    const recipients = emailList.map(email => ({
      email: email.trim(),
      name: email.split('@')[0].replace(/[._]/g, ' '),
      personalizedData: { treatmentType: 'Dental Consultation' }
    }));

    try {
      const response = await fetch('/api/emails/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients,
          subject,
          template,
          sender: {
            name: "MxSmiles Team",
            email: "hello@mxsmiles.com"
          },
          options: {
            batchSize: 3,
            delayBetweenEmails: 500,
            delayBetweenBatches: 1000,
            maxRetries: 2
          }
        }),
      });
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error sending bulk emails:', error);
      setResults({
        success: false,
        message: 'Failed to send bulk emails',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendNewsletterDemo = async () => {
    setIsLoading(true);
    setResults(null);

    const subscriberEmails = [
      "subscriber1@example.com",
      "subscriber2@example.com",
      "subscriber3@example.com",
      "subscriber4@example.com"
    ];

    try {
      const response = await fetch('/api/emails/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriberEmails,
          subject: "MxSmiles Monthly Newsletter - January 2025",
          content: `Dear Subscriber,

Welcome to our monthly newsletter! Here's what's new at MxSmiles:

🦷 New dental implant packages starting at $899
🎯 35% off all cosmetic treatments this month
📍 We've opened a new clinic in Cancun

Don't miss out on these limited-time offers!

Best regards,
The MxSmiles Team`,
          sender: {
            name: "MxSmiles Newsletter",
            email: "newsletter@mxsmiles.com"
          }
        }),
      });
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error sending newsletter:', error);
      setResults({
        success: false,
        message: 'Failed to send newsletter',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Loop Testing</h1>
          <p className="text-gray-600">Test the loop-based email sending functionality</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Send className="w-5 h-5 text-blue-600" />
                Demo Emails
              </CardTitle>
              <CardDescription>
                Send emails to 5 sample recipients using loops
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={runDemoEmails} 
                disabled={isLoading} 
                className="w-full"
              >
                {isLoading ? "Sending..." : "Send Demo Emails"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-green-600" />
                Newsletter
              </CardTitle>
              <CardDescription>
                Send newsletter to subscribers using loops
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={sendNewsletterDemo} 
                disabled={isLoading} 
                className="w-full"
                variant="outline"
              >
                {isLoading ? "Sending..." : "Send Newsletter"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="w-5 h-5 text-purple-600" />
                Custom Bulk
              </CardTitle>
              <CardDescription>
                Send custom emails to your own list
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={sendCustomBulkEmails} 
                disabled={isLoading || !customEmails.trim()} 
                className="w-full"
                variant="secondary"
              >
                {isLoading ? "Sending..." : "Send Custom Bulk"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Custom Email Configuration</CardTitle>
              <CardDescription>Configure your bulk email settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject"
                />
              </div>
              
              <div>
                <Label htmlFor="template">Email Template</Label>
                <Textarea
                  id="template"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  rows={8}
                  placeholder="Enter email template with {{name}} and {{treatmentType}} placeholders"
                />
              </div>
              
              <div>
                <Label htmlFor="emails">Email Addresses (one per line)</Label>
                <Textarea
                  id="emails"
                  value={customEmails}
                  onChange={(e) => setCustomEmails(e.target.value)}
                  rows={6}
                  placeholder="Enter email addresses, one per line&#10;example1@email.com&#10;example2@email.com"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>Email sending results and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              {!results ? (
                <div className="text-center py-8 text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No results yet. Run an email campaign to see results here.</p>
                </div>
              ) : results.success ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Success!</span>
                  </div>
                  
                  <p className="text-sm text-gray-600">{results.message}</p>
                  
                  {results.data?.summary && (
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {results.data.summary.total}
                        </div>
                        <div className="text-sm text-blue-600">Total</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {results.data.summary.sent}
                        </div>
                        <div className="text-sm text-green-600">Sent</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {results.data.summary.failed}
                        </div>
                        <div className="text-sm text-red-600">Failed</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {results.data.summary.successRate}%
                        </div>
                        <div className="text-sm text-purple-600">Success Rate</div>
                      </div>
                    </div>
                  )}
                  
                  {results.data?.results && (
                    <div className="pt-4">
                      <Separator className="mb-4" />
                      <h4 className="font-semibold mb-3">Individual Results:</h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {results.data.results.map((result: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              {result.success ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                              <span className="text-sm">{result.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {result.email}
                              </Badge>
                            </div>
                            {result.sentAt && (
                              <span className="text-xs text-gray-500">
                                {new Date(result.sentAt).toLocaleTimeString()}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="w-5 h-5" />
                    <span className="font-semibold">Error</span>
                  </div>
                  <p className="text-sm text-gray-600">{results.message}</p>
                  {results.error && (
                    <p className="text-xs text-red-500 font-mono bg-red-50 p-2 rounded">
                      {results.error}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              How Email Loops Work
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">1. Batch Processing</h4>
                <p className="text-gray-600">
                  Emails are processed in small batches to avoid overwhelming the email service
                  and ensure reliable delivery.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">2. Retry Logic</h4>
                <p className="text-gray-600">
                  Failed emails are automatically retried up to 3 times with exponential backoff
                  to handle temporary issues.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">3. Rate Limiting</h4>
                <p className="text-gray-600">
                  Configurable delays between emails and batches prevent rate limiting
                  and ensure compliance with email service policies.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}