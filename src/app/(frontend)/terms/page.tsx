import React, { Suspense } from "react";
import { BookOpen } from "lucide-react";
import TermsConditionsContent from "./TermsConditionsContent"

const TermsConditionsPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
          <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-xl p-8">
            <div className="animate-pulse flex items-center gap-4">
              <BookOpen className="w-8 h-8 text-white/70" />
              <span className="text-white/70 font-sans text-lg">
                Cargando términos y condiciones...
              </span>
            </div>
          </div>
        </div>
      }
    >
      <TermsConditionsContent />
    </Suspense>
  );
};

export default TermsConditionsPage;