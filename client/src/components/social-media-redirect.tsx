import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trackEvent } from "@/lib/analytics";
import { Facebook, Instagram, Twitter, Youtube, MessageCircle } from "lucide-react";

interface SocialMediaRedirectProps {
  source?: string;
  campaign?: string;
  medium?: string;
}

export default function SocialMediaRedirect({ source = "website", campaign = "social-redirect", medium = "referral" }: SocialMediaRedirectProps) {
  
  const socialPlatforms = [
    {
      name: "Facebook",
      icon: <Facebook className="w-6 h-6" />,
      url: "https://facebook.com/mxsmiles",
      description: "Follow us for daily updates and patient stories",
      color: "bg-blue-600 hover:bg-blue-500",
      utmParams: `?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}_facebook`
    },
    {
      name: "Instagram", 
      icon: <Instagram className="w-6 h-6" />,
      url: "https://instagram.com/mxsmiles",
      description: "See before/after photos and behind-the-scenes content",
      color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
      utmParams: `?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}_instagram`
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-6 h-6" />,
      url: "https://twitter.com/mxsmiles", 
      description: "Get real-time updates and dental health tips",
      color: "bg-sky-500 hover:bg-sky-600",
      utmParams: `?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}_twitter`
    },
    {
      name: "YouTube",
      icon: <Youtube className="w-6 h-6" />,
      url: "https://youtube.com/@mxsmiles",
      description: "Watch patient testimonials and procedure explanations",
      color: "bg-red-600 hover:bg-red-700",
      utmParams: `?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}_youtube`
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle className="w-6 h-6" />,
      url: "https://wa.me/15588458889",
      description: "Chat with us directly for immediate assistance",
      color: "bg-green-600 hover:bg-green-700",
      utmParams: `?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}_whatsapp`
    }
  ];

  const handleSocialClick = (platform: string, url: string, utmParams: string) => {
    // Track the social media redirect
    trackEvent('social_media_click', 'engagement', `${platform.toLowerCase()}_redirect`);
    
    // Open in new tab with UTM parameters
    const fullUrl = url + utmParams;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4">
      {socialPlatforms.map((platform) => (
        <Card key={platform.name} className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full text-white ${platform.color}`}>
                  {platform.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                  <p className="text-sm text-gray-600">{platform.description}</p>
                </div>
              </div>
              <Button
                onClick={() => handleSocialClick(platform.name, platform.url, platform.utmParams)}
                className={`${platform.color} text-white`}
                size="sm"
              >
                Follow
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Floating Social Media Widget
export function FloatingSocialWidget() {
  const socialLinks = [
    { name: "Facebook", icon: <Facebook className="w-5 h-5" />, url: "https://facebook.com/mxsmiles", color: "bg-blue-600" },
    { name: "Instagram", icon: <Instagram className="w-5 h-5" />, url: "https://instagram.com/mxsmiles", color: "bg-pink-600" },
    { name: "WhatsApp", icon: <MessageCircle className="w-5 h-5" />, url: "https://wa.me/15588458889", color: "bg-green-600" }
  ];

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 space-y-2">
      {socialLinks.map((social) => (
        <Button
          key={social.name}
          size="sm"
          className={`${social.color} hover:${social.color.replace('bg-', 'bg-').replace('-600', '-700')} text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110`}
          onClick={() => {
            trackEvent('floating_social_click', 'engagement', `${social.name.toLowerCase()}_floating`);
            window.open(social.url, '_blank', 'noopener,noreferrer');
          }}
          title={`Follow us on ${social.name}`}
        >
          {social.icon}
        </Button>
      ))}
    </div>
  );
}