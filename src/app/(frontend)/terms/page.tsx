"use client";

import React, { useEffect, useState } from "react";
import {
  BookOpen,
  CreditCard,
  Calendar,
  Clock,
  Leaf,
  Scale,
  Shield,
  Edit,
} from "lucide-react";
import { getTermsAndConditions } from "@/lib/data";
import { useSearchParams } from "next/navigation";

interface TermsSection {
  title: string;
  content: string;
}

interface TermsData {
  title: string;
  lastUpdated: string;
  content: {
    introduction: string;
    sections: TermsSection[];
  };
}

type Locale = 'es' | 'en'

const TermsConditionsPage: React.FC = () => {
  const searchParams = useSearchParams()
  const locale = (searchParams.get('locale') as Locale) || 'es'
  const [termsData, setTermsData] = useState<TermsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTermsData = async () => {
      try {
        const data = await getTermsAndConditions();
        setTermsData(data);
      } catch (error) {
        console.error("Error loading terms and conditions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTermsData();
  }, []);

  const getIconForSection = (title: string) => {
    if (title.includes("Reservas") || title.includes("Pagos"))
      return <CreditCard className="w-6 h-6" />;
    if (title.includes("Cancelación")) return <Calendar className="w-6 h-6" />;
    if (title.includes("Check-in") || title.includes("Check-out"))
      return <Clock className="w-6 h-6" />;
    if (title.includes("Políticas")) return <Shield className="w-6 h-6" />;
    if (title.includes("Sostenibilidad")) return <Leaf className="w-6 h-6" />;
    if (title.includes("Normatividad")) return <Scale className="w-6 h-6" />;
    if (title.includes("Modificaciones")) return <Edit className="w-6 h-6" />;
    return <BookOpen className="w-6 h-6" />;
  };

  const highlights = [
    {
      title: "Check-in",
      time: "3:00 PM",
      subtitle: "Hora de entrada",
    },
    {
      title: "Check-out",
      time: "1:00 PM",
      subtitle: "Hora de salida",
    },
    {
      title: "Cancelación",
      time: "24 Horas",
      subtitle: "Antes de llegada",
    },
  ];

  if (loading) {
    return (
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
    );
  }

  if (!termsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <BookOpen className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <p className="text-lg">Error al cargar los términos y condiciones</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Floating orbs background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-white/4 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-2/3 left-1/5 w-32 h-32 bg-white/6 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-white/3 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 pt-32">
        {/* Hero Section */}
        <div className="text-center mb-16 transform transition-all duration-1000 translate-y-0 opacity-100">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-xl mb-8 relative group">
            <BookOpen className="w-10 h-10 text-white" />
            {/* Shimmer effects */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute top-2 right-3 w-1 h-4 bg-gradient-to-b from-transparent via-white/30 to-transparent rotate-45 animate-pulse" />
              <div
                className="absolute bottom-2 left-3 w-2 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
                style={{ animationDelay: "0.3s" }}
              />
            </div>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            {termsData.title}
          </h1>
          <p className="font-sans text-lg md:text-xl font-light text-white/70 max-w-2xl mx-auto mb-8">
            {termsData.content.introduction}
          </p>

          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg px-4 py-2 text-white/80">
            <Clock className="w-4 h-4" />
            <span className="font-sans text-sm font-medium">
              Última actualización:{" "}
              {new Date(termsData.lastUpdated).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Quick Info Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {highlights.map((highlight, index) => (
            <div
              key={index}
              className="relative bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-xl overflow-hidden transition-all duration-700 hover:scale-105 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6 text-center">
                <h3 className="font-serif text-xl font-bold text-white mb-2">
                  {highlight.title}
                </h3>
                <div className="font-sans text-2xl font-bold text-white/90 mb-1">
                  {highlight.time}
                </div>
                <p className="font-sans text-sm text-white/70">
                  {highlight.subtitle}
                </p>
              </div>

              {/* Floating highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-700" />

              {/* Shimmer effects */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-3 right-4 w-1 h-4 bg-gradient-to-b from-transparent via-white/30 to-transparent rotate-45 animate-pulse" />
                <div
                  className="absolute bottom-3 left-4 w-3 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Sections Grid */}
        <div className="grid gap-8 mb-12">
          {termsData.content.sections.map((section, index) => (
            <div
              key={index}
              className="relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-700 hover:scale-105 hover:-translate-y-2 hover:shadow-3xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-lg flex items-center justify-center text-white">
                    {getIconForSection(section.title)}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {section.title}
                    </h2>
                  </div>
                </div>
                <p className="font-sans text-base text-gray-700 leading-relaxed">
                  {section.content}
                </p>
              </div>

              {/* Floating highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-700" />

              {/* Shimmer effects */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-4 right-6 w-1 h-6 bg-gradient-to-b from-transparent via-gray-300/50 to-transparent rotate-45 animate-pulse" />
                <div
                  className="absolute bottom-4 left-6 w-4 h-0.5 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Important Notice */}
        <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-700 hover:scale-105 hover:-translate-y-2 hover:shadow-3xl mb-8">
          <div className="p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-xl rounded-lg flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white mb-3">
                  Cumplimiento Normativo
                </h3>
                <p className="font-sans text-sm text-white/90 leading-relaxed">
                  Hotel Juan María opera bajo estricto cumplimiento de toda la
                  legislación colombiana vigente, incluyendo normas de
                  sostenibilidad turística, protección del menor, y normatividad
                  ambiental. Nuestro compromiso es brindar servicios seguros,
                  legales y responsables.
                </p>
              </div>
            </div>
          </div>

          {/* Floating highlight */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700" />

          {/* Shimmer effects */}
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700">
            <div className="absolute top-4 right-6 w-1 h-6 bg-gradient-to-b from-transparent via-white/30 to-transparent rotate-45 animate-pulse" />
            <div
              className="absolute bottom-4 left-6 w-4 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="relative font-semibold rounded-lg overflow-hidden transition-all duration-700 group px-8 py-4"
          >
            <span className="relative z-10 flex items-center justify-center text-white">
              Volver al inicio
              <div className="ml-2 w-2 h-2 bg-white/70 rounded-full group-hover:bg-white transition-colors duration-300" />
            </span>

            {/* Efectos de fondo obligatorios */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Shimmer effects */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute top-1 right-2 w-1 h-3 bg-gradient-to-b from-transparent via-white/30 to-transparent rotate-45 animate-pulse" />
              <div
                className="absolute bottom-1 left-3 w-2 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
                style={{ animationDelay: "0.3s" }}
              />
            </div>
          </button>

       
        </div>
      </div>
    </div>
  );
};

export default TermsConditionsPage;

