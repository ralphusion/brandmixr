import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { SparkleIcon } from "@/components/SparkleIcon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FontSettings } from "@/types/FontSettings";

interface BrandLogoSectionProps {
  fonts: FontSettings | null;
  handleDownloadLogo: () => void;
  handleRegenerateLogo: () => void;
  selectedCardId: string | null;
}

export function BrandLogoSection({ 
  fonts, 
  handleDownloadLogo, 
  handleRegenerateLogo, 
  selectedCardId 
}: BrandLogoSectionProps) {
  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2
            className="text-xl font-semibold"
            style={fonts?.primary ? {
              fontFamily: fonts.primary.family,
              fontWeight: fonts.primary.weight,
              fontStyle: fonts.primary.style,
            } : undefined}
          >
            Brand Logo
          </h2>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownloadLogo}
                  disabled={!selectedCardId}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download selected logo as PNG</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRegenerateLogo}
                >
                  <SparkleIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Generate new variations</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
