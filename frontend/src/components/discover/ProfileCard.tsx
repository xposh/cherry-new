import { MapPin, Briefcase } from "lucide-react";
import { Link } from "react-router";
import type { TalentProfile } from "../../data/mockTalents";
import type { CompanyProfile } from "../../data/mockCompanies";

interface ProfileCardProps {
  profile: TalentProfile | CompanyProfile;
  type: "talent" | "company";
}

export function ProfileCard({ profile, type }: ProfileCardProps) {
  const isTalent = type === "talent";
  const linkTo = isTalent ? `/talent/${profile.id}` : `/company/${profile.id}`;

  return (
    <Link
      to={linkTo}
      className="block bg-white/5 border border-white/20 rounded-xl overflow-hidden hover:border-white/40 transition-all group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            isTalent
              ? (profile as TalentProfile).profileImage
              : (profile as CompanyProfile).companyLogo
          }
          alt={
            isTalent
              ? (profile as TalentProfile).name
              : (profile as CompanyProfile).companyName
          }
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-light text-lg">
            {isTalent
              ? (profile as TalentProfile).name
              : (profile as CompanyProfile).companyName}
          </h3>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <MapPin className="w-4 h-4" />
          <span>{profile.location}</span>
        </div>

        {isTalent ? (
          <>
            <p className="text-white/80 text-sm line-clamp-2">
              {(profile as TalentProfile).bio}
            </p>
            <div className="flex flex-wrap gap-2">
              {(profile as TalentProfile).skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Briefcase className="w-4 h-4" />
              <span>{(profile as CompanyProfile).industry}</span>
            </div>
            <p className="text-white/80 text-sm line-clamp-2">
              {(profile as CompanyProfile).claim}
            </p>
          </>
        )}
      </div>
    </Link>
  );
}
