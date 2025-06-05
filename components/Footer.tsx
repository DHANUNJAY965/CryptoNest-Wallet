// "use client";

// import { IconBrandGithub, IconUser } from "@tabler/icons-react";

// export function Footer() {
//   const handlePortfolioClick = () => {
//     window.open("https://dhanu-portfolio-app.vercel.app/", "_blank", "noopener,noreferrer");
//   };

//   const handleGithubClick = () => {
//     window.open("https://github.com/DHANUNJAY965/CryptoNest-Wallet", "_blank", "noopener,noreferrer");
//   };

//   return (
//     <footer className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
//       <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-secondary/80 backdrop-blur-sm border border-border/50">
//         <button
//           onClick={handlePortfolioClick}
//           className="p-2 rounded-full hover:bg-primary/10 transition-colors group"
//           aria-label="Visit Portfolio"
//         >
//           <IconUser className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
//         </button>
        
//         <div className="w-px h-6 bg-border"></div>
        
//         <button
//           onClick={handleGithubClick}
//           className="p-2 rounded-full hover:bg-primary/10 transition-colors group"
//           aria-label="View GitHub Repository"
//         >
//           <IconBrandGithub className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
//         </button>
//       </div>
//     </footer>
//   );
// }
"use client";

import { IconBrandGithub, IconUser } from "@tabler/icons-react";

export function Footer() {
  const handlePortfolioClick = () => {
    window.open("https://dhanu-portfolio-app.vercel.app/", "_blank", "noopener,noreferrer");
  };

  const handleGithubClick = () => {
    window.open("https://github.com/DHANUNJAY965/CryptoNest-Wallet", "_blank", "noopener,noreferrer");
  };

  return (
    <footer className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 dark:bg-black/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
        <button
          onClick={handlePortfolioClick}
          className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 transition-all duration-300 transform hover:scale-105 group"
          aria-label="Visit Portfolio"
        >
          <IconUser className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300" />
        </button>
        
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
        
        <button
          onClick={handleGithubClick}
          className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-gray-500/10 hover:to-black/10 dark:hover:from-gray-400/10 dark:hover:to-white/10 transition-all duration-300 transform hover:scale-105 group"
          aria-label="View GitHub Repository"
        >
          <IconBrandGithub className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-white transition-colors duration-300" />
        </button>
      </div>
    </footer>
  );
}