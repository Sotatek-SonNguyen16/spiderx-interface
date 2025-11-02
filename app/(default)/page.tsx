import { activeVersion } from "./version-config";

// Import version pages
import HomeV1 from "./versions/v1/page";
import HomeV2 from "./versions/v2/page";

// Export metadata (will be inherited from the active version or use default)
export const metadata = {
  title: "Home - Open PRO",
  description: "Page description",
};

/**
 * Main Landing Page Component
 * 
 * This component dynamically loads the active version based on version-config.ts
 * To switch versions, update activeVersion in version-config.ts
 */
export default function Home() {
  // Render the active version based on config
  if (activeVersion === 'v2') {
    return <HomeV2 />;
  }
  
  return <HomeV1 />;
}
