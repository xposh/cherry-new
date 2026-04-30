import {
  Cherry,
  X,
  Check,
  MapPin,
  Building2,
  Calendar,
  Globe,
  Phone,
  Mail,
} from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { BottomNavigation } from "../../components/navigation/BottomNavigation";
import { mockCompanies } from "../../data/mockCompanies";
import { useMatch } from "../../context/MatchContext";

export function CompanyProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { likeProfile, skipProfile } = useMatch();

  const company = mockCompanies.find((c) => c.id === id);

  if (!company) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">Company not found</p>
      </div>
    );
  }

  const handleSkip = () => {
    skipProfile(company.id, "company");
    navigate("/discover");
  };

  const handleLike = () => {
    likeProfile(company.id, "company");
    navigate("/discover");
  };

  return (
    <div className="relative min-h-screen w-full bg-black pb-32">
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
      <div className="relative h-[500px] overflow-hidden">
        <img
          src={company.galleryImages[0]?.url || company.companyLogo}
          alt={company.companyName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Company Logo */}
        <div className="absolute top-8 right-8">
          <img
            src={company.companyLogo}
            alt={`${company.companyName} Logo`}
            className="w-24 h-24 border-2 border-white/20 object-cover bg-white"
          />
        </div>

        <div className="absolute bottom-8 left-8 right-8">
          <h1 className="text-5xl font-light text-white mb-3">
            {company.companyName}
          </h1>
          <p className="text-2xl text-white/90 font-light italic mb-4">
            "{company.claim}"
          </p>
          <div className="flex items-center gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              <span>{company.companySize}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{company.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12 space-y-12">
        {/* About */}
        <section>
          <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider border-b border-white/30 pb-2">
            About Us
          </h2>
          <p className="text-white/80 text-lg font-light leading-relaxed mb-3">
            {company.description}
          </p>
          <p className="text-gray-400">
            <span className="font-light">Industry:</span> {company.industry}
          </p>
        </section>

        {/* Gallery */}
        {company.galleryImages.length > 0 && (
          <section>
            <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider border-b border-white/30 pb-2">
              Insights
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {company.galleryImages.map((img, index) => (
                <div key={index} className="space-y-2">
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-64 object-cover border border-white/30"
                  />
                  <p className="text-gray-400 text-sm">{img.caption}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Values */}
        <section>
          <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider border-b border-white/30 pb-2">
            Our Values
          </h2>
          <div className="flex flex-wrap gap-3">
            {company.cultureValues.map((value) => (
              <span
                key={value}
                className="px-4 py-2 border border-white/30 text-white text-sm"
              >
                {value}
              </span>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section>
          <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider border-b border-white/30 pb-2">
            Benefits
          </h2>
          <div className="space-y-4">
            {Object.entries(company.benefits).map(([category, items]) => (
              <div key={category} className="border border-white/30 p-4">
                <h3 className="text-gray-400 text-sm mb-2 uppercase tracking-wider">
                  {category === "arbeitsmodell"
                    ? "Work Model"
                    : category === "finanziell"
                      ? "Financial"
                      : category === "lifestyle"
                        ? "Lifestyle"
                        : category === "mobilitat"
                          ? "Mobility"
                          : "Development"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 bg-white/5 text-white/80 text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Job Opening */}
        <section className="border border-white/30 p-6">
          <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider">
            Open Position
          </h2>
          <h3 className="text-white text-3xl font-light mb-4">
            {company.jobTitle}
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-white/80">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{company.jobLocation}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Start: {company.startDate}</span>
            </div>
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
          </div>
        </section>

        {/* Contact Person */}
        <section className="border border-white/30 p-6">
          <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider">
            Your Contact Person
          </h2>
          <div className="flex gap-6 items-start">
            <img
              src={company.contactPerson.photo}
              alt={company.contactPerson.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-white/20"
            />
            <div className="flex-1">
              <h3 className="text-white text-2xl font-light">
                {company.contactPerson.name}
              </h3>
              <p className="text-gray-400 mb-3">{company.contactPerson.role}</p>
              <p className="text-white/80 italic mb-4">
                "{company.contactPerson.message}"
              </p>
              <div className="space-y-2">
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

      {/* Action Buttons */}
      <div className="fixed bottom-24 left-0 right-0 px-8 pb-6">
        <div className="max-w-md mx-auto flex gap-6">
          <button
            onClick={handleSkip}
            className="flex-1 h-16 border-2 border-white/30 flex items-center justify-center hover:border-white/60 transition-all"
            style={{ backgroundColor: "transparent" }}
          >
            <X className="w-10 h-10 text-white" strokeWidth={1} />
          </button>
          <button
            onClick={handleLike}
            className="flex-1 h-16 border-2 border-white flex items-center justify-center hover:bg-white/10 transition-all"
            style={{ backgroundColor: "transparent" }}
          >
            <Check className="w-10 h-10 text-white" strokeWidth={1} />
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
