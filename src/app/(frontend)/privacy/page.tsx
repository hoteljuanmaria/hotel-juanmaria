"use client";

import React, { useEffect, useState } from "react";
import { Shield, Lock, Eye, FileText, Mail, Phone, Clock } from "lucide-react";
import { getPrivacyPolicy } from "@/lib/data";

interface PolicySection {
  title: string;
  content: string;
}

interface PolicyData {
  title: string;
  lastUpdated: string;
  content: {
    introduction: string;
    sections: PolicySection[];
  };
}

const PrivacyPolicyPage: React.FC = () => {
  const [policyData, setPolicyData] = useState<PolicyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPolicyData = async () => {
      try {
        const data = await getPrivacyPolicy();
        setPolicyData(data);
      } catch (error) {
        console.error("Error loading privacy policy:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPolicyData();
  }, []);

  const getIconForSection = (title: string) => {
    if (title.includes("Información") || title.includes("Recopilamos"))
      return <FileText className="w-6 h-6" />;
    if (title.includes("Finalidad") || title.includes("Tratamiento"))
      return <Eye className="w-6 h-6" />;
    if (title.includes("Principios")) return <Shield className="w-6 h-6" />;
    if (title.includes("Protección") || title.includes("Seguridad"))
      return <Lock className="w-6 h-6" />;
    return <Shield className="w-6 h-6" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-xl p-8">
          <div className="animate-pulse flex items-center gap-4">
            <Shield className="w-8 h-8 text-white/70" />
            <span className="text-white/70 font-sans text-lg">
              Cargando política de privacidad...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!policyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <Shield className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <p className="text-lg">Error al cargar la política de privacidad</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Floating orbs background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-3/4 right-1/4 w-48 h-48 bg-white/3 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-white/4 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 pt-32">
        {/* Hero Section */}
        <div className="text-center mb-16 transform transition-all duration-1000 translate-y-0 opacity-100">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-xl mb-8 relative group">
            <Shield className="w-10 h-10 text-white" />
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
            {policyData.title}
          </h1>
          <p className="font-sans text-lg md:text-xl font-light text-white/70 max-w-2xl mx-auto mb-8">
            {policyData.content.introduction}
          </p>

          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg px-4 py-2 text-white/80">
            <Clock className="w-4 h-4" />
            <span className="font-sans text-sm font-medium">
              Última actualización:{" "}
              {new Date(policyData.lastUpdated).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="grid gap-8 mb-12">
          {policyData.content.sections.map((section, index) => (
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

        {/* Contact Section */}
        <div className="relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-700 hover:scale-105 hover:-translate-y-2 hover:shadow-3xl">
          <div className="p-8">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Contacto para Datos Personales
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-sans text-sm font-medium text-gray-600">
                    Email
                  </p>
                  <p className="font-sans text-base text-gray-900">
                    datos@hoteljuanmaria.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-sans text-sm font-medium text-gray-600">
                    Teléfono
                  </p>
                  <p className="font-sans text-base text-gray-900">
                    (2) 224-4562
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50/60 rounded-lg">
              <p className="font-sans text-sm text-gray-600">
                <strong>Horario de Atención:</strong> Lunes a viernes 8:00 AM -
                6:00 PM, Sábados 8:00 AM - 12:00 PM
              </p>
            </div>
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

        {/* Back to Top Button */}
        <div className="text-center mt-12">
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

export default PrivacyPolicyPage;

