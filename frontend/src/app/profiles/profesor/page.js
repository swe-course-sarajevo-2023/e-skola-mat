"use client";
import { useProtectedRoute } from "@/hooks";
import ProfesorHomepageView from "@/views/profesor-homepage-view";

const ProfesorHomepage = () => {
  return <ProfesorHomepageView />;
};

export default useProtectedRoute(ProfesorHomepage);
