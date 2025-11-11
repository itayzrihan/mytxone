"use client";

export default function NewsletterSignup() {
  const handleWhatsAppClick = () => {
    const emailInput = document.getElementById('newsletter-email') as HTMLInputElement;
    const email = emailInput?.value || '';
    const message = `שלום, אני מעוניין להישאר מעודכן. כתובת האימייל שלי: ${email}`;
    const whatsappUrl = `https://wa.me/972515511581?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="backdrop-blur-md bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-8">
      <h3 className="text-xl font-bold text-white mb-2">
        הישארו מעודכנים
      </h3>
      <p className="text-zinc-400 mb-6">
        קבלו את התובנות החדשות ביותר על טרנספורמציה דיגיטלית, מגמות טכנולוגיות והצעות בלעדיות.
      </p>
      <div className="flex flex-col sm:flex-row-reverse gap-4 max-w-md mx-auto" dir="rtl">
        <input
          type="email"
          id="newsletter-email"
          placeholder="הזינו את כתובת האימייל שלכם"
          className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-400 transition-colors text-right"
        />
        <button
          onClick={handleWhatsAppClick}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
        >
          הרשמה
        </button>
      </div>
    </div>
  );
}
