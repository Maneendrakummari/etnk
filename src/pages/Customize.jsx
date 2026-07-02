import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, Ruler, DollarSign, Calendar, FileText, Check, ArrowRight, ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { userService } from '../services/userService';

const STEPS = [
  { id: 1, label: "Silhouettes", icon: Scissors },
  { id: 2, label: "Measurements", icon: Ruler },
  { id: 3, label: "Budget & Dates", icon: Calendar },
  { id: 4, label: "Review & Submit", icon: Check }
];

export default function Customize() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [requestId, setRequestId] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    category: "WOMEN",
    garmentType: "Saree",
    fabric: "Chanderi Silk",
    color: "Gold",
    measurements: {
      bust: "",
      waist: "",
      hips: "",
      height: "",
      shoulder: "",
      custom: ""
    },
    specialRequests: "",
    budget: "₹10,000 – ₹20,000",
    preferredDate: "",
    referenceImage: null
  });

  const handleNext = () => {
    if (step < 4) setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Structure request matching schema payload
    const requestPayload = {
      productId: "custom-design",
      productName: `Bespoke Custom ${formData.color} ${formData.fabric} ${formData.garmentType}`,
      productSku: `ETK-CUSTOM-${formData.garmentType.toUpperCase()}`,
      productImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80",
      measurements: formData.measurements,
      specialRequests: `${formData.specialRequests} | Budget: ${formData.budget} | Delivery Target: ${formData.preferredDate}`,
      referenceImageUrl: formData.referenceImage ? "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80" : ""
    };

    try {
      const res = await userService.submitCustomizationRequest(requestPayload);
      setRequestId(res.id);
      setSuccess(true);
    } catch (err) {
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMockUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, referenceImage: e.target.files[0].name });
    }
  };

  return (
    <div
      className="text-[#181818] min-h-screen bg-fixed bg-no-repeat bg-cover"
      style={{ background: "linear-gradient(180deg, #FBE7C6 0%, #F6EFE3 40%, #E9DCC4 100%)" }}
    >
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">

      {success ? (
        /* Success Screen */
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-neutral-900 border border-[#D9C7A3] p-12 text-center space-y-6"
        >
          <div className="w-16 h-16 bg-[#3E7C59]/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-[#3E7C59]" />
          </div>
          <h3 className="font-serif text-2xl text-text-custom dark:text-primary tracking-wider">REQUEST SUBMITTED</h3>
          <p className="text-xs text-neutral-500 uppercase tracking-widest max-w-md mx-auto leading-relaxed">
            Your customized tailoring dossier has been registered at the ETNIKO Atelier under reference:
          </p>
          <span className="font-mono text-sm font-semibold text-[#B68D40] tracking-widest bg-white dark:bg-neutral-800 px-6 py-2.5 border border-[#D9C7A3] inline-block">
            {requestId}
          </span>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Our atelier stylist will contact you on WhatsApp within 12 hours to verify measurements and review color swatches.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setSuccess(false);
                setStep(1);
                navigate('/profile');
              }}
              className="btn-luxury-solid"
            >
              View Styling Requests
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="btn-luxury"
            >
              Browse Collections
            </button>
          </div>
        </motion.div>
      ) : (
        /* Form Wizard */
        <div className="space-y-10">
          
          {/* Progress Indicator line */}
          <div className="relative flex justify-between items-center max-w-2xl mx-auto">
            <div className="absolute inset-x-0 h-0.5 bg-neutral-200 dark:bg-neutral-850 -z-10" />
            <div
              style={{ width: `${((step - 1) / 3) * 100}%` }}
              className="absolute h-0.5 bg-[#B68D40] transition-all duration-500 -z-10"
            />
            {STEPS.map((s) => {
              const active = step === s.id;
              const done = step > s.id;
              const Icon = s.icon;
              return (
                <div key={s.id} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center border text-xs font-semibold font-sans transition-all duration-500 ${
                      done
                        ? 'bg-[#B68D40] border-[#B68D40] text-white shadow-sm'
                        : active
                        ? 'bg-white border-[#B68D40] text-[#B68D40] shadow-md ring-4 ring-[#F3E9D8]'
                        : 'bg-white dark:bg-neutral-850 border-neutral-200 text-neutral-400'
                    }`}
                  >
                    {done ? "✓" : s.id}
                  </div>
                  <span className={`text-[8px] uppercase tracking-widest font-sans font-bold ${
                    active ? 'text-[#B68D40]' : 'text-neutral-400'
                  }`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Form Step Components */}
          <div className="bg-[#FFFDFC] dark:bg-[#181818] border border-[#E6DCCF] dark:border-neutral-800 p-8 shadow-[0_4px_16px_-10px_rgba(24,24,24,0.12)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* STEP 1: SILHOUETTES & COLOR SELECTIONS */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h3 className="font-serif text-lg tracking-wider border-b border-neutral-100 pb-3 uppercase text-[#B68D40]">
                      Garment & Swatch Options
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans block">Client Segment</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 px-3 py-2.5 text-xs font-sans text-text-custom dark:text-white focus:outline-none focus:border-[#B68D40] uppercase"
                        >
                          <option value="WOMEN">Women's Couture</option>
                          <option value="MEN">Men's Couture</option>
                          <option value="KIDS">Kids Couture</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans block">Garment Silhouette</label>
                        <select
                          value={formData.garmentType}
                          onChange={(e) => setFormData({ ...formData, garmentType: e.target.value })}
                          className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 px-3 py-2.5 text-xs font-sans text-text-custom dark:text-white focus:outline-none focus:border-[#B68D40]"
                        >
                          {formData.category === "WOMEN" ? (
                            <>
                              <option value="Saree">Pre-Draped Saree</option>
                              <option value="Lehenga">Zardozi Lehenga</option>
                              <option value="Blouse">Tailored Saree Blouse</option>
                              <option value="Anarkali">Organza Anarkali</option>
                            </>
                          ) : formData.category === "MEN" ? (
                            <>
                              <option value="Kurta">Tussar Silk Kurta Set</option>
                              <option value="Sherwani">Brocade Wedding Sherwani</option>
                            </>
                          ) : (
                            <>
                              <option value="Lehenga Frock">Girls Lehenga Frock</option>
                              <option value="Sherwani Boy">Boys Brocade Sherwani</option>
                            </>
                          )}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans block">Base Fabric Swatch</label>
                        <select
                          value={formData.fabric}
                          onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                          className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 px-3 py-2.5 text-xs font-sans text-text-custom dark:text-white focus:outline-none focus:border-[#B68D40]"
                        >
                          <option value="Chanderi Silk">Chanderi Silk</option>
                          <option value="Mulberry Silk">Mulberry Silk</option>
                          <option value="Banarasi Brocade">Banarasi Brocade</option>
                          <option value="Pure Organza">Pure Organza</option>
                          <option value="Raw Silk">Raw Silk</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans block">Color Preference</label>
                        <select
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 px-3 py-2.5 text-xs font-sans text-text-custom dark:text-white focus:outline-none focus:border-[#B68D40]"
                        >
                          <option value="Ivory & Gold">Ivory & Gold</option>
                          <option value="Terracotta Rust">Terracotta Rust</option>
                          <option value="Emerald Green">Emerald Green</option>
                          <option value="Crimson Red">Crimson Red</option>
                          <option value="Champagne Gold">Champagne Gold</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: MEASUREMENTS INPUT */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h3 className="font-serif text-lg tracking-wider border-b border-neutral-100 pb-3 uppercase text-[#B68D40]">
                      Tailoring Sizing Measurements
                    </h3>
                    
                    <div className="bg-[#FAF3E7] dark:bg-neutral-900 border border-[#E6DCCF] p-4 text-[11px] font-sans text-neutral-500 leading-relaxed text-justify">
                      <span className="font-bold text-[#B68D40] uppercase tracking-widest block mb-1">Tailoring Note:</span>
                      For a perfect draping silhouette, we recommend using a standard tailor tape. Wrap the tape comfortably (not too tight) around the bust, natural waist, and hips. If unsure, you may submit approximations; our stylist will finalize sizing with you.
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans">Bust (inches)</label>
                        <input
                          type="text"
                          placeholder="e.g. 34"
                          value={formData.measurements.bust}
                          onChange={(e) => setFormData({
                            ...formData,
                            measurements: { ...formData.measurements, bust: e.target.value }
                          })}
                          className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs font-sans text-text-custom dark:text-white focus:outline-none focus:border-[#B68D40]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans">Waist (inches)</label>
                        <input
                          type="text"
                          placeholder="e.g. 28"
                          value={formData.measurements.waist}
                          onChange={(e) => setFormData({
                            ...formData,
                            measurements: { ...formData.measurements, waist: e.target.value }
                          })}
                          className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs font-sans text-text-custom dark:text-white focus:outline-none focus:border-[#B68D40]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans">Hips (inches)</label>
                        <input
                          type="text"
                          placeholder="e.g. 38"
                          value={formData.measurements.hips}
                          onChange={(e) => setFormData({
                            ...formData,
                            measurements: { ...formData.measurements, hips: e.target.value }
                          })}
                          className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs font-sans text-text-custom dark:text-white focus:outline-none focus:border-[#B68D40]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans">Shoulders (inches)</label>
                        <input
                          type="text"
                          placeholder="e.g. 14.5"
                          value={formData.measurements.shoulder}
                          onChange={(e) => setFormData({
                            ...formData,
                            measurements: { ...formData.measurements, shoulder: e.target.value }
                          })}
                          className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs font-sans text-text-custom dark:text-white focus:outline-none focus:border-[#B68D40]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans">Height (ft/in)</label>
                        <input
                          type="text"
                          placeholder="e.g. 5ft 6in"
                          value={formData.measurements.height}
                          onChange={(e) => setFormData({
                            ...formData,
                            measurements: { ...formData.measurements, height: e.target.value }
                          })}
                          className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs font-sans text-text-custom dark:text-white focus:outline-none focus:border-[#B68D40]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans block">Custom fit preferences / Special sizing notes</label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Blouse neck cuts, specific sleeve lengths, drape tightness preference..."
                        value={formData.measurements.custom}
                        onChange={(e) => setFormData({
                          ...formData,
                          measurements: { ...formData.measurements, custom: e.target.value }
                        })}
                        className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs font-sans text-text-custom dark:text-white focus:outline-none focus:border-[#B68D40]"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3: BUDGET & DELIVERIES */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h3 className="font-serif text-lg tracking-wider border-b border-neutral-100 pb-3 uppercase text-[#B68D40]">
                      Budget & Timeline Guidelines
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans block">Estimated Budget Range</label>
                        <select
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 px-3 py-2.5 text-xs font-sans text-text-custom dark:text-white focus:outline-none focus:border-[#B68D40]"
                        >
                          <option value="₹5,000 – ₹10,000">₹5,000 – ₹10,000</option>
                          <option value="₹10,000 – ₹20,000">₹10,000 – ₹20,000</option>
                          <option value="₹20,000 – ₹35,000">₹20,000 – ₹35,000</option>
                          <option value="Above ₹35,000">Above ₹35,000 (Luxury couture)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans block">Target Delivery Date</label>
                        <input
                          type="date"
                          value={formData.preferredDate}
                          onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                          className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs font-sans text-neutral-500 focus:outline-none focus:border-[#B68D40]"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans block">References & Sketch Uploads</label>
                        
                        <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-750 p-6 flex flex-col items-center justify-center space-y-2 bg-[#FAF3E7]/50">
                          <Upload className="w-8 h-8 text-[#B68D40] opacity-80" />
                          <div className="text-center">
                            <label className="cursor-pointer text-[10px] tracking-widest text-[#B68D40] uppercase font-bold hover:text-black">
                              Select Image File
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleMockUpload}
                              />
                            </label>
                            <span className="text-[9px] font-sans text-neutral-400 block mt-1">PNG, JPG up to 10MB</span>
                          </div>
                        </div>

                        {formData.referenceImage && (
                          <p className="text-[10px] uppercase tracking-widest text-[#3E7C59] font-bold text-center">
                            ✓ Reference Selected: {formData.referenceImage}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans block">Styling / Embroidery Guidelines</label>
                        <textarea
                          rows={3}
                          placeholder="Describe your design vision: Gota work density, motif choices, dupatta lengths, or embroidery wishes..."
                          value={formData.specialRequests}
                          onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                          className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs font-sans text-text-custom dark:text-white focus:outline-none focus:border-[#B68D40]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: REVIEW & CONFIRM */}
                {step === 4 && (
                  <div className="space-y-6">
                    <h3 className="font-serif text-lg tracking-wider border-b border-neutral-100 pb-3 uppercase text-[#B68D40]">
                      Review Dossier Submission
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-sans leading-relaxed text-neutral-600 dark:text-neutral-300">
                      
                      <div className="space-y-4">
                        <h4 className="text-[9px] tracking-widest text-[#B68D40] font-sans font-bold uppercase border-b pb-1">
                          Silhouette Selections
                        </h4>
                        <div className="space-y-1">
                          <p><span className="text-neutral-400">Garment Type:</span> <span className="font-bold text-text-custom dark:text-primary">{formData.garmentType} ({formData.category})</span></p>
                          <p><span className="text-neutral-400">Fabric Swatch:</span> <span className="font-bold text-text-custom dark:text-primary">{formData.fabric}</span></p>
                          <p><span className="text-neutral-400">Color Choice:</span> <span className="font-bold text-text-custom dark:text-primary">{formData.color}</span></p>
                        </div>

                        <h4 className="text-[9px] tracking-widest text-[#B68D40] font-sans font-bold uppercase border-b pb-1 pt-2">
                          Budget & Schedule
                        </h4>
                        <div className="space-y-1">
                          <p><span className="text-neutral-400">Estimate Budget:</span> <span className="font-bold text-text-custom dark:text-primary">{formData.budget}</span></p>
                          <p><span className="text-neutral-400">Delivery Date:</span> <span className="font-bold text-text-custom dark:text-primary">{formData.preferredDate || "Open Timeline"}</span></p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-[9px] tracking-widest text-[#B68D40] font-sans font-bold uppercase border-b pb-1">
                          Measurements dossier
                        </h4>
                        <div className="grid grid-cols-3 gap-2 text-center bg-[#FAF3E7] dark:bg-neutral-900 p-3.5 border border-neutral-200">
                          <div>
                            <span className="text-neutral-400 text-[8px] uppercase block">Bust</span>
                            <span className="font-bold text-text-custom dark:text-primary">{formData.measurements.bust || "—"}</span>
                          </div>
                          <div>
                            <span className="text-neutral-400 text-[8px] uppercase block">Waist</span>
                            <span className="font-bold text-text-custom dark:text-primary">{formData.measurements.waist || "—"}</span>
                          </div>
                          <div>
                            <span className="text-neutral-400 text-[8px] uppercase block">Hips</span>
                            <span className="font-bold text-text-custom dark:text-primary">{formData.measurements.hips || "—"}</span>
                          </div>
                        </div>
                        {formData.measurements.custom && (
                          <p className="text-[10px] text-neutral-500 italic mt-1">"{formData.measurements.custom}"</p>
                        )}
                        {formData.specialRequests && (
                          <div className="pt-2">
                            <span className="text-neutral-400 text-[9px] uppercase tracking-wider block">Design guidelines:</span>
                            <p className="italic text-neutral-500">"{formData.specialRequests}"</p>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls bottom */}
          <div className="flex justify-between items-center pt-4">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-sans font-bold text-neutral-400 hover:text-black disabled:opacity-30 focus:outline-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>

            {step < 4 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 btn-luxury-solid"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-luxury-solid flex items-center gap-2"
              >
                <span>{loading ? "REGISTERING DESIGN WIZARD..." : "FINALIZE ATELIER Dossier"}</span>
              </button>
            )}
          </div>

        </div>
      )}

      </div>
    </div>
  );
}