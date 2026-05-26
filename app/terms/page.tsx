"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Introduction",
      content:
        "Welcome to our escrow-based intermediary payment platform. By accessing or using our services, you agree to comply with and be bound by these Terms of Service.",
    },
    {
      title: "2. Platform Purpose",
      content:
        "The platform acts as a trusted intermediary between Buyers and Sellers for commercial transactions. Funds are securely held until the Buyer confirms successful product receipt.",
    },
    {
      title: "3. User Accounts",
      content:
        "Users may register as Buyers or Sellers. You are responsible for maintaining the confidentiality of your account credentials and all activities performed through your account.",
    },
    {
      title: "4. Escrow Payment Workflow",
      list: [
        "Buyer submits payment through the platform.",
        "Funds are securely blocked and not immediately released to the Seller.",
        "Seller ships the product and submits proof of shipment.",
        "Buyer confirms product receipt.",
        "Upon confirmation, funds are released to the Seller.",
      ],
    },
    {
      title: "5. Seller Responsibilities",
      list: [
        "Provide accurate product descriptions.",
        "Ship products within the agreed timeline.",
        "Upload valid shipment proof or tracking details.",
        "Not engage in fraudulent activity.",
      ],
    },
    {
      title: "6. Buyer Responsibilities",
      list: [
        "Provide valid payment information.",
        "Confirm receipt honestly and promptly.",
        "Avoid fraudulent disputes or chargebacks.",
      ],
    },
    {
      title: "7. Proof Management",
      content:
        "The platform may require shipment proof, tracking numbers, photos, confirmation codes, or additional verification documents to validate transactions and resolve disputes.",
    },
    {
      title: "8. Dispute Resolution",
      content:
        "In the event of a dispute between Buyer and Seller, the platform reserves the right to review all submitted evidence and determine whether funds should be released, refunded, or temporarily held pending further investigation.",
    },
    {
      title: "9. Payments and Fees",
      content:
        "Payments are processed through third-party payment providers such as Stripe, PayPal, or other integrated processors. Transaction fees may apply and are displayed before payment confirmation.",
    },
    {
      title: "10. Limitation of Liability",
      content:
        "The platform serves solely as an intermediary payment service and is not responsible for product quality, legality, delivery delays, or actions of Buyers or Sellers.",
    },
    {
      title: "11. Fraud Prevention",
      content:
        "We reserve the right to suspend accounts, delay payments, request identity verification, or report suspicious activity to authorities where necessary.",
    },
    {
      title: "12. Privacy",
      content:
        "User information is processed in accordance with our Privacy Policy and applicable data protection laws.",
    },
    {
      title: "13. Changes to Terms",
      content:
        "We may update these Terms of Service at any time. Continued use of the platform after modifications constitutes acceptance of the revised terms.",
    },
    {
      title: "14. Contact Us",
      content:
        "For questions regarding these Terms, please contact us at support@yourdomain.com",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden">
      {/* Background Effects - Subtle matching your design */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-indigo-50/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-50/20 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #1e293b 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">
        {/* Back Button - Matching your design */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm mb-8"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* Main Card - Clean white card like in your screenshot */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/60">
          {/* Header */}
          <div className="border-b border-slate-100 px-10 py-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                SecurePay CH Policies
              </span>
            </div>

            <h1 className="text-5xl font-black text-slate-900 mb-5 tracking-tight">
              Terms & Conditions
            </h1>

            <p className="text-slate-500 text-lg leading-relaxed max-w-3xl">
              These terms govern the use of our escrow-based payment
              platform and ensure secure, transparent commercial
              exchanges between buyers and sellers.
            </p>

            <div className="flex items-center gap-4 mt-5">
              <p className="text-slate-400 text-sm">
                Last Updated: May 26, 2026
              </p>
            </div>
          </div>

          {/* Terms Sections */}
          <div className="p-8 md:p-10 space-y-6">
            {sections.map((section, index) => (
              <section
                key={index}
                className="bg-white border border-slate-100 rounded-2xl p-7 hover:border-slate-200 hover:shadow-md transition-all duration-300"
              >
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  {section.title}
                </h2>

                {section.content && (
                  <p className="text-slate-600 leading-7 text-[15px]">
                    {section.content}
                  </p>
                )}

                {section.list && (
                  <ul className="space-y-2.5">
                    {section.list.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-slate-600"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5" />
                        <span className="leading-7">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Footer note - matching your design's subtle text */}
          <div className="border-t border-slate-100 px-10 py-6 bg-slate-50/30">
            <p className="text-slate-400 text-sm text-center">
              By using SecurePay CH, you agree to these Terms & Conditions.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}