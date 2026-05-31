import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Azlaan',
  description: 'Terms of Service for Azlaan Premium — a Bangladeshi premium clothing brand. Governing law: Bangladesh.',
};

const sections = [
  {
    title: '1. Introduction & Acceptance',
    body: 'These Terms of Service ("Terms") govern your access to and use of the Azlaan website, products, and services. By accessing azlaan.com.bd, placing an order, or otherwise using our services, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree, please refrain from using our website or services.',
  },
  {
    title: '2. About Azlaan',
    body: 'Azlaan ("we", "us", "our") is a Bangladeshi premium clothing brand offering ready-made garments, fabric by meter, and gift cards for Men, Women, and Kids. Our registered business address is 123 Fashion Avenue, Dhaka, Bangladesh. All operations are conducted from Bangladesh, and these Terms are governed exclusively by the laws of the People\'s Republic of Bangladesh.',
  },
  {
    title: '3. Eligibility',
    body: 'You must be at least 18 years of age to place an order. By placing an order, you represent that you are legally capable of entering into binding contracts. If you are under 18, you may use the website only under the supervision of a parent or legal guardian.',
  },
  {
    title: '4. Products & Pricing',
    body: 'All product prices are listed in Bangladeshi Taka (BDT, ৳) inclusive of applicable VAT unless stated otherwise. Prices, descriptions, and availability are subject to change without prior notice. We make every effort to display accurate colours and details, but we cannot guarantee that your monitor\'s display is error-free. We reserve the right to refuse or cancel any order at our discretion, including orders with incorrect pricing or stock unavailability.',
  },
  {
    title: '5. Fabric by Meter',
    body: 'Fabric sold by the meter is cut to order and is non-returnable and non-refundable unless the fabric is defective on arrival. Please double-check your measurements before placing an order. Colour and texture may vary slightly between batches; we recommend ordering the full required quantity in a single transaction to ensure consistency.',
  },
  {
    title: '6. Orders & Payment',
    body: 'Orders are confirmed only after successful payment processing. We accept bKash, Nagad, Rocket, Cash on Delivery (COD), and Azlaan Gift Cards. All online payments are processed through secure, encrypted gateways. For COD orders, payment must be made in full at the time of delivery. We reserve the right to verify orders and request additional information before processing.',
  },
  {
    title: '7. Gift Cards',
    body: 'Azlaan Gift Cards are sold at a discounted price and credited with a higher balance (e.g., pay ৳900, receive ৳1,000). The full balance must be used in a single transaction and cannot be split across multiple bills. Gift cards are valid for 30 days from the date of purchase; unused credit expires and is forfeited. Gift card balance can be redeemed at our physical store and online at azlaan.com.bd. Balance cannot be used on discounted or promotional items — products purchased with gift card credit must be at regular price. Gift cards are non-refundable and cannot be exchanged for cash. Bonus credit is non-transferable.',
  },
  {
    title: '8. Shipping & Delivery',
    body: 'Orders are delivered within 2–3 business days inside Dhaka and 3–5 business days outside Dhaka. Delivery timelines are estimates and not guaranteed. Standard shipping charges apply; orders over ৳10,000 qualify for free shipping. Risk of loss and title for purchased items pass to you upon delivery. A signature may be required upon receipt.',
  },
  {
    title: '9. Returns & Exchanges',
    body: 'You may return eligible items within 7 calendar days of delivery, provided the item is unused and in its original condition with all tags intact. Exchanges are offered only for defective or damaged items and are limited to the same product. Fabric cut by the meter, gift cards, and final-sale items are not returnable. Please refer to our Returns Policy for detailed instructions.',
  },
  {
    title: '10. Intellectual Property',
    body: 'All content on azlaan.com.bd — including but not limited to trademarks, logos, product images, text, graphics, and software — is the exclusive property of Azlaan Premium or its licensors. You may not reproduce, distribute, modify, or commercially exploit any content without our prior written consent.',
  },
  {
    title: '11. User Conduct',
    body: 'You agree not to use the website for any unlawful purpose or in violation of any applicable Bangladeshi laws, including the Digital Security Act 2018 and the Consumer Rights Protection Act 2009. Prohibited activities include but are not limited to fraudulent orders, submitting false information, tampering with the website, and unauthorised access to other user accounts.',
  },
  {
    title: '12. Limitation of Liability',
    body: 'To the maximum extent permitted under Bangladeshi law, Azlaan Premium shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or services, including but not limited to loss of profits, data, or goodwill. Our total liability shall not exceed the amount paid by you for the product or service in question.',
  },
  {
    title: '13. Governing Law & Dispute Resolution',
    body: 'These Terms are governed by the laws of the People\'s Republic of Bangladesh. Any dispute arising out of or relating to these Terms or your use of our services shall first be attempted to be resolved through informal negotiation. If the dispute cannot be resolved within 30 days, it shall be submitted to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.',
  },
  {
    title: '14. Amendments',
    body: 'We may update these Terms from time to time. Changes will be posted on this page with an updated "Last updated" date. Continued use of our services after any modification constitutes your acceptance of the revised Terms. We encourage you to review this page periodically.',
  },
  {
    title: '15. Contact',
    body: 'If you have any questions, concerns, or requests regarding these Terms, please contact us at: Address: 123 Fashion Avenue, Dhaka, Bangladesh. Email: info@azlaan.com. Phone: +880 123-456-789. Hours: Saturday – Thursday, 10:00 AM – 8:00 PM (Friday closed).',
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#1D1D1F] py-20 md:py-28 px-4">
      <div className="max-w-[720px] mx-auto">
        <div className="mb-14 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C9A84C] mb-4">Legal</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm text-white/40 mt-4 font-medium">
            Last updated: May 2026
          </p>
        </div>
        <div className="space-y-5">
          {sections.map((s) => (
            <div
              key={s.title}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 md:p-6 hover:bg-white/[0.05] transition-colors"
            >
              <h2 className="text-sm md:text-base font-black text-white mb-2 tracking-tight">
                {s.title}
              </h2>
              <p className="text-[13px] md:text-sm text-white/50 leading-relaxed font-medium">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
