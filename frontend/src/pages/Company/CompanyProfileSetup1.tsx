import { Upload, X, Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Logo } from "../../components/Logo";
import { supabase } from "../../util/supabase";
import { useCompanyProfile } from "../../context/CompanyProfileContext";
import { useAuth } from "../../context/useAuth";
import { getSetupDraft, setSetupDraft } from "../../util/draftStorage";
import { mapCompanyProfileToSetup1 } from "../../util/profileMapping";

interface UploadedImage {
  id: string;
  preview: string; // Supabase Public URL
  category: string;
  caption: string;
}

export function CompanyProfileSetup1() {
  const navigate = useNavigate();
  const { updateCompanyProfile } = useCompanyProfile();
  const { user, authFetch } = useAuth();

  // LocalStorage laden beim Start
  const getSavedData = () => {
    try {
      return getSetupDraft("companySetup1", user?.id);
    } catch (e) {
      console.error("Fehler beim Parsen von companySetup1:", e);
      return null;
    }
  };

  const savedData = getSavedData();

  const [companyLogoUrl, setCompanyLogoUrl] = useState<string>(
    savedData?.companyLogoUrl || "",
  );
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(
    savedData?.uploadedImages || [],
  );
  const [selectedCategory, setSelectedCategory] =
    useState<string>("Räume & Locations");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function hydrateFromBackend() {
      if (!user?.id) return;
      if (getSetupDraft("companySetup1", user.id)) return;

      try {
        const res = await authFetch("http://localhost:3000/profile");
        if (!res.ok) return;
        const data = await res.json();
        if (!data?.profile) return;

        const mapped = mapCompanyProfileToSetup1(data.profile);
        setCompanyLogoUrl(mapped.companyLogoUrl || "");
        setUploadedImages(mapped.uploadedImages as UploadedImage[]);
        updateCompanyProfile({
          companyLogo: mapped.companyLogoUrl || "",
          companyImages: mapped.uploadedImages as UploadedImage[],
        });
      } catch (err) {
        console.error("Failed to hydrate company setup step 1 from backend:", err);
      }
    }

    hydrateFromBackend();
  }, [authFetch, updateCompanyProfile, user?.id]);

  const categories = [
    "Räume & Locations",
    "Team & Kultur",
    "Projekte",
    "Arbeitsplätze",
    "Extras",
  ];

  // ✅ Logo Upload zu Supabase
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const fileExtension = file.name.split(".").pop();
      const uniqueFileName = `logo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;

      const uploadResponse = await supabase.storage
        .from("companies")
        .upload(uniqueFileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadResponse.error) {
        throw uploadResponse.error;
      }

      const { data: publicUrlData } = supabase.storage
        .from("companies")
        .getPublicUrl(uniqueFileName);

      setCompanyLogoUrl(publicUrlData.publicUrl);
      console.log("Logo hochgeladen:", publicUrlData.publicUrl);
    } catch (err) {
      console.error("Logo-Upload fehlgeschlagen:", err);
      alert("Upload fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setIsUploading(false);
    }
  };

  // ✅ Gallery Images Upload zu Supabase
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      setIsUploading(true);

      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExtension = file.name.split(".").pop();
        const uniqueFileName = `gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;

        const uploadResponse = await supabase.storage
          .from("companies")
          .upload(uniqueFileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadResponse.error) {
          throw uploadResponse.error;
        }

        const { data: publicUrlData } = supabase.storage
          .from("companies")
          .getPublicUrl(uniqueFileName);

        return {
          id: Math.random().toString(36).substr(2, 9),
          preview: publicUrlData.publicUrl,
          category: selectedCategory,
          caption: "",
        };
      });

      const newImages = await Promise.all(uploadPromises);
      setUploadedImages([...uploadedImages, ...newImages]);
      console.log("Bilder hochgeladen:", newImages);
    } catch (err) {
      console.error("Bild-Upload fehlgeschlagen:", err);
      alert("Upload fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (id: string) => {
    setUploadedImages(uploadedImages.filter((img) => img.id !== id));
  };

  const updateCategory = (id: string, category: string) => {
    setUploadedImages(
      uploadedImages.map((img) => (img.id === id ? { ...img, category } : img)),
    );
  };

  const updateCaption = (id: string, caption: string) => {
    setUploadedImages(
      uploadedImages.map((img) => (img.id === id ? { ...img, caption } : img)),
    );
  };

  // ✅ Speichere im LocalStorage beim Next
  const handleNext = () => {
    const setup1Data = {
      companyLogoUrl,
      uploadedImages,
    };
    setSetupDraft("companySetup1", user?.id, setup1Data);
    updateCompanyProfile({
      companyLogo: companyLogoUrl,
      companyImages: uploadedImages,
    });
    navigate("/company-profile-setup-2");
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-auto pb-20">
      <Logo to="/" />

      <div className="fixed top-8 right-8 z-50 flex gap-2">
        <div className="w-12 h-1 bg-white rounded-full"></div>
        <div className="w-12 h-1 bg-white/30 rounded-full"></div>
        <div className="w-12 h-1 bg-white/30 rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-8 pt-32 pb-32">
        <div className="mb-12">
          <h1 className="text-4xl font-light text-white mb-4">
            Visuelles Profil
          </h1>
          <p className="text-gray-400 text-lg font-light">
            Zeigt eure Räume, euer Team und was euch besonders macht.
          </p>
        </div>

        {/* Company Logo Upload */}
        <section className="mb-12">
          <h2 className="text-white font-light mb-6 uppercase tracking-[0.2em] text-sm">
            Company Logo
          </h2>
          {!companyLogoUrl ? (
            <div className="border-2 border-dashed border-white/30 rounded-xl p-12 text-center hover:border-white/60 transition-colors cursor-pointer max-w-md mx-auto">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
                disabled={isUploading}
              />
              <label htmlFor="logo-upload" className="cursor-pointer">
                <Building2 className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <p className="text-white font-light mb-2">
                  {isUploading ? "Uploading..." : "Upload your company logo"}
                </p>
                <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
              </label>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="relative group">
                <img
                  src={companyLogoUrl}
                  alt="Company Logo"
                  className="w-full h-80 object-cover rounded-xl"
                />
                <button
                  onClick={() => setCompanyLogoUrl("")}
                  className="absolute top-4 right-4 p-2 bg-black/80 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Category Selection */}
        <div className="mb-8">
          <label className="block text-white font-light mb-4 uppercase tracking-[0.2em] text-sm">
            Select Category for Gallery Images
          </label>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 border rounded-lg transition-all uppercase tracking-[0.2em] text-sm font-light ${
                  selectedCategory === category
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white border-white/30 hover:border-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Area */}
        <div className="mb-12">
          <label className="block text-white font-light mb-4 uppercase tracking-[0.2em] text-sm">
            Upload Gallery Images
          </label>
          <div className="border-2 border-dashed border-white/30 rounded-xl p-12 text-center hover:border-white/60 transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
              disabled={isUploading}
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-white font-light mb-2">
                {isUploading
                  ? "Uploading..."
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-gray-500 text-sm">PNG, JPG, GIF up to 10MB</p>
            </label>
          </div>
        </div>

        {/* Uploaded Images Grid */}
        {uploadedImages.length > 0 && (
          <div className="mb-12">
            <h3 className="text-white font-light mb-6 uppercase tracking-[0.2em] text-sm">
              Uploaded Images ({uploadedImages.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {uploadedImages.map((img) => (
                <div
                  key={img.id}
                  className="relative group border border-white/30 rounded-xl overflow-hidden"
                >
                  <img
                    src={img.preview}
                    alt="Upload preview"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => removeImage(img.id)}
                      className="p-2 bg-black/80 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  <div className="p-4 bg-black/60 backdrop-blur-sm space-y-3">
                    <select
                      value={img.category}
                      onChange={(e) => updateCategory(img.id, e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/30 text-white focus:border-white focus:outline-none transition-colors font-light text-sm rounded-lg appearance-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-black">
                          {cat}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={img.caption}
                      onChange={(e) => updateCaption(img.id, e.target.value)}
                      placeholder="Bildunterschrift (optional)"
                      className="w-full px-3 py-2 bg-white/10 border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light text-sm rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-white/20">
          <Link
            to="/signup"
            className="px-8 py-3 border border-white/30 text-white hover:border-white transition-all uppercase tracking-[0.2em] text-sm font-light rounded-lg"
          >
            Back
          </Link>
          <button
            onClick={handleNext}
            disabled={isUploading}
            className="px-8 py-3 bg-white text-black hover:bg-gray-200 transition-all uppercase tracking-[0.2em] text-sm font-light rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
}
