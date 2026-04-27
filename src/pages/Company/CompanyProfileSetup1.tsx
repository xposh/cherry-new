import { Upload, X, Building2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Logo } from "../../components/Logo";
import { useCompanyProfile } from "../../context/CompanyProfileContext";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  category: string;
  caption: string;
}

interface CompanyLogo {
  file: File | null;
  preview: string;
}

export function CompanyProfileSetup1() {
  const navigate = useNavigate();
  const { updateCompanyProfile } = useCompanyProfile();

  const [companyLogo, setCompanyLogo] = useState<CompanyLogo>({
    file: null,
    preview: "",
  });
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("Räume & Locations");

  const categories = [
    "Räume & Locations",
    "Team & Kultur",
    "Projekte",
    "Arbeitsplätze",
    "Extras",
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompanyLogo({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: UploadedImage[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      category: selectedCategory,
      caption: "",
    }));

    setUploadedImages([...uploadedImages, ...newImages]);
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

  const handleNext = () => {
    const imagesToSave = uploadedImages.map((img) => ({
      id: img.id,
      preview: img.preview,
      category: img.category,
      caption: img.caption,
    }));

    updateCompanyProfile({
      companyLogo: companyLogo.preview,
      companyImages: imagesToSave,
    });

    navigate("/company-profile-setup-2");
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-auto pb-20">
      <Link to="/">
        <Logo />
      </Link>

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
          {!companyLogo.preview ? (
            <div className="border-2 border-dashed border-white/30 rounded-xl p-12 text-center hover:border-white/60 transition-colors cursor-pointer max-w-md mx-auto">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <label htmlFor="logo-upload" className="cursor-pointer">
                <Building2 className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <p className="text-white font-light mb-2">
                  Upload your company logo
                </p>
                <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
              </label>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="relative group">
                <img
                  src={companyLogo.preview}
                  alt="Company Logo"
                  className="w-full h-80 object-cover rounded-xl"
                />
                <button
                  onClick={() => setCompanyLogo({ file: null, preview: "" })}
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
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-white font-light mb-2">
                Click to upload or drag and drop
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
            className="px-8 py-3 bg-white text-black hover:bg-gray-200 transition-all uppercase tracking-[0.2em] text-sm font-light rounded-lg"
          >
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
}
