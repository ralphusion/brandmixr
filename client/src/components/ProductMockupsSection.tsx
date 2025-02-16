import { Card, CardContent } from "@/components/ui/card";
import { FontSettings } from "@/types/FontSettings";

interface ProductMockupsSectionProps {
  selectedCardId: string | null;
  cardBackgrounds: string[];
  logoSvg: string;
  brandName: string;
  fonts: FontSettings | null;
}

export function ProductMockupsSection({
  selectedCardId,
  cardBackgrounds,
  logoSvg,
  brandName,
  fonts
}: ProductMockupsSectionProps) {
  const selectedBackground = selectedCardId ? cardBackgrounds[parseInt(selectedCardId.split('-')[1])] : undefined;

  const textStyle = {
    fontFamily: fonts?.primary?.family || 'Inter',
    fontWeight: fonts?.primary?.weight || '600',
    fontStyle: fonts?.primary?.style || 'normal',
    color: 'white'
  };

  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground" style={textStyle}>
            Brand Applications
          </h2>
        </div>

        {selectedCardId && (
          <div className={`${selectedBackground} w-full h-48 flex items-center justify-center p-8 rounded-lg mb-8`}>
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-white/90 dark:bg-white/80 rounded-xl p-4 shadow-lg">
                {logoSvg && (
                  <img
                    src={logoSvg}
                    alt="Brand Logo"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              <h3
                className="text-3xl text-center text-white"
                style={textStyle}
              >
                {brandName}
              </h3>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
