import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t.errors.pageNotFound}</h1>
          <p className="text-gray-600 mb-6">
            {t.errors.somethingWrong}
          </p>
          <Button asChild>
            <Link href="/">{t.errors.goHome}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
