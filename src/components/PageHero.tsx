import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PageHeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  height?: string;
}

export function PageHero({ 
  title, 
  subtitle, 
  backgroundImage, 
  height = "min-h-[50vh]" 
}: PageHeroProps) {
  return (
    <section 
      className={`relative text-white ${height} flex items-center`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-primary/80"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl opacity-95 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}