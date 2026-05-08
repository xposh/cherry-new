import {
  Cherry,
  MapPin,
  Building2,
  MessageCircle,
  Mail,
  Phone,
  Globe,
} from "lucide-react";
import { useParams } from "react-router";
import { BottomNavigation } from "../../components/navigation/BottomNavigation";
import { mockCompanies } from "../../data/mockCompanies";

export function CompanyMatchDetailsPage() {
  const { id } = useParams();
  const company = mockCompanies.find((c) => c.id === id);

  if (!company) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">Match not found</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-black pb-24">
      {/* Logo */}
      <div className="fixed top-8 left-8 z-50">
        <h2
          className="text-2xl tracking-[0.3em] uppercase flex items-center gap-1"
          style={{ color: "#2A6087" }}
        >
          CHE
          <Cherry className="w-6 h-6" style={{ color: "#2A6087" }} />Y
        </h2>
      </div>

      {/* Hero */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={company.galleryImages[0]?.url || company.companyLogo}
          alt={company.companyName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute top-8 right-8">
          <img
            src={company.companyLogo}
            alt={`${company.companyName} Logo`}
            className="w-20 h-20 border-2 border-white/20 object-cover bg-white"
          />
        </div>
        <div className="absolute bottom-8 left-8 right-8">
          <div
            className="inline-block px-4 py-1 border mb-3"
            style={{
              backgroundColor: "rgba(42, 96, 135, 0.2)",
              borderColor: "rgba(42, 96, 135, 0.4)",
            }}
          >
            <span
              className="text-sm uppercase tracking-wider"
              style={{ color: "#2A6087" }}
            >
              ✓ It's a Match
            </span>
          </div>
          <h1 className="text-5xl font-light text-white mb-2">
            {company.companyName}
          </h1>
          <div className="flex items-center gap-6 text-white/80">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              <span>{company.industry}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{company.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12 space-y-8">
        {/* Contact CTA */}
        <div className="border border-white/30 p-6">
          <h2 className="text-white text-2xl font-light mb-4">
            Start the Conversation
          </h2>
          <button className="w-full flex items-center justify-center gap-3 p-4 bg-white text-black hover:bg-white/90 transition-all">
            <MessageCircle className="w-5 h-5" />
            <span className="uppercase tracking-wider">Send Message</span>
          </button>
        </div>

        {/* Job Details */}
        <section className="border border-white/30 p-6">
          <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider">
            Open Position
          </h2>
          <h3 className="text-white text-3xl font-light mb-4">
            {company.jobTitle}
          </h3>
          <p className="text-white/80 mb-4">{company.description}</p>
          <div className="flex gap-2">
            {company.workModel.map((model) => (
              <span
                key={model}
                className="px-3 py-1 bg-white/10 text-white text-sm"
              >
                {model}
              </span>
            ))}
          </div>
        </section>

        {/* Contact Person */}
        <section className="border border-white/30 p-6">
          <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider">
            Your Contact Person
          </h2>
          <div className="flex gap-4 items-start">
            <img
              src={company.contactPerson.photo}
              alt={company.contactPerson.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
            />
            <div className="flex-1">
              <h3 className="text-white text-xl font-light">
                {company.contactPerson.name}
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                {company.contactPerson.role}
              </p>
              <div className="space-y-2 text-sm">
                <a
                  href={`mailto:${company.contactPerson.email}`}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {company.contactPerson.email}
                </a>
                {company.contactPerson.phone && (
                  <a
                    href={`tel:${company.contactPerson.phone}`}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {company.contactPerson.phone}
                  </a>
                )}
                {company.contactPerson.website && (
                  <a
                    href={`https://${company.contactPerson.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    {company.contactPerson.website}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <BottomNavigation />
    </div>
  );
}
