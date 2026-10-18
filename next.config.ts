import type { NextConfig } from "next";

// GitHub Pages sirve este repositorio bajo /Guadalupe-pagina/.
// El basePath debe compilarse dentro de los chunks de Next.js; reescribir
// solo los src/href del HTML deja la hidratación de React sin funcionar.
const basePath = process.env.GUADALUPE_GITHUB_PAGES === "true"
  ? "/Guadalupe-pagina"
  : undefined;

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
