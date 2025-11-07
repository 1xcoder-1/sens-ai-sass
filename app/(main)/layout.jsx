import React from "react";
import Header from "@/components/header";
import ConditionalFooter from "@/components/conditional-footer";

const MainLayout = async ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto mt-16 sm:mt-20 md:mt-24 px-4 py-6">
        {children}
      </main>
      <ConditionalFooter />
    </div>
  );
};

export default MainLayout;