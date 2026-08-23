/**
 * WhatsApp message templates for StayVilla.
 * As per specification, all generated WhatsApp messages (both for villa owner direct bookings
 * and for platform admin villa owner registrations) are STRICTLY and CONSISTENTLY in English,
 * regardless of the user's active UI locale (ID, EN, FR, ZH, JA, KO).
 */

export interface BookingWhatsAppParams {
  villaName: string;
  villaLocation: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalPriceFormatted: string;
  ownerWhatsAppNumber: string;
}

export interface OwnerRegistrationWhatsAppParams {
  namaVilla: string;
  namaPemilik: string;
  nomorWA: string;
  lokasi: string;
  jumlahKamar: string | number;
  rentangHarga: string;
  deskripsi: string;
  socialLink?: string;
  adminWhatsAppNumber?: string;
}

/**
 * Generates an English pre-filled WhatsApp message and deep-link for direct booking with a villa owner.
 */
export function generateBookingWhatsAppUrl({
  villaName,
  villaLocation,
  checkIn,
  checkOut,
  nights,
  guests,
  totalPriceFormatted,
  ownerWhatsAppNumber,
}: BookingWhatsAppParams): { text: string; url: string } {
  // Clean phone number (remove +, spaces, dashes)
  const cleanPhone = (ownerWhatsAppNumber || "6282163240141").replace(/\D/g, "");

  const text = `*VILLA RESERVATION INQUIRY — STAYVILLA* 🌴✨

Hello Management of *${villaName}*, I would like to inquire about booking a stay at your villa:

📋 *Reservation Details:*
• *Villa:* ${villaName} (${villaLocation})
• *Check-in:* ${checkIn}
• *Check-out:* ${checkOut}
• *Duration:* ${nights} Night${nights > 1 ? "s" : ""}
• *Guests:* ${guests} Guest${guests > 1 ? "s" : ""}
• *Estimated Total:* ${totalPriceFormatted} (including taxes & 10% service fee)

Please confirm unit availability and payment/deposit procedures. Thank you!`;

  const encoded = encodeURIComponent(text);
  const url = `https://wa.me/${cleanPhone}?text=${encoded}`;

  return { text, url };
}

/**
 * Generates an English pre-filled WhatsApp message and deep-link for B2B villa owner onboarding to platform admin.
 */
export function generateOwnerRegistrationWhatsAppUrl({
  namaVilla,
  namaPemilik,
  nomorWA,
  lokasi,
  jumlahKamar,
  rentangHarga,
  deskripsi,
  socialLink,
  adminWhatsAppNumber = "6282163240141",
}: OwnerRegistrationWhatsAppParams): { text: string; url: string } {
  const cleanPhone = adminWhatsAppNumber.replace(/\D/g, "");

  const text = `*NEW VILLA REGISTRATION — STAYVILLA* 🌴✨

Hello StayVilla Admin, I would like to register my villa property on the StayVilla platform:

📋 *Property Profile:*
• *Villa Name:* ${namaVilla}
• *Owner / Manager Name:* ${namaPemilik}
• *Owner WhatsApp:* ${nomorWA}
• *Location in Bali:* ${lokasi}
• *Bedrooms:* ${jumlahKamar} Bedroom(s)
• *Nightly Rate Range:* ${rentangHarga}

📝 *Description & Key Amenities:*
${deskripsi}

🌐 *Social Media / Website:*
${socialLink?.trim() ? socialLink.trim() : "-"}

Please review my registration and contact me regarding the listing setup. Thank you!`;

  const encoded = encodeURIComponent(text);
  const url = `https://wa.me/${cleanPhone}?text=${encoded}`;

  return { text, url };
}
