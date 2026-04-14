import Link from 'next/link';
import {
  ArrowRight,
  BellRing,
  Check,
  Clock3,
  CreditCard,
  FileCheck2,
  Gauge,
  GraduationCap,
  Package2,
  QrCode,
  ShieldCheck,
  Truck,
  University,
  Users,
} from 'lucide-react';

const platformHighlights = [
  {
    title: 'Campus-first architecture',
    description:
      'Built specifically for hostel parcel flow with block, room, student, and courier-aware records.',
    icon: University,
  },
  {
    title: 'Role-aware workflows',
    description:
      'Students, delivery staff, and admins each get a focused dashboard with only the actions they need.',
    icon: Users,
  },
  {
    title: 'Secure delivery handoff',
    description:
      'OTP and QR-assisted verification reduce wrong-delivery risk while preserving speed at peak hours.',
    icon: ShieldCheck,
  },
  {
    title: 'Operational visibility',
    description:
      'Track every parcel stage with timestamps, status history, and accountability from intake to delivery.',
    icon: Gauge,
  },
];

const roleBenefits = [
  {
    role: 'Students',
    icon: GraduationCap,
    points: [
      'Real-time notifications when parcels arrive on campus.',
      'Simple dashboard to track pending and delivered packages.',
      'Secure pickup with OTP-based confirmation.',
    ],
    cta: { label: 'Create Student Account', href: '/register' },
  },
  {
    role: 'Delivery Staff',
    icon: Truck,
    points: [
      'Fast parcel intake and assignment queue visibility.',
      'Guided delivery timeline with proof-of-delivery checkpoints.',
      'Reduced coordination overhead through centralized records.',
    ],
    cta: { label: 'Create Staff Account', href: '/register-staff' },
  },
  {
    role: 'Administrators',
    icon: FileCheck2,
    points: [
      'Review payments and screenshots in one place.',
      'Monitor delivery throughput, backlogs, and completion trends.',
      'Manage team access and maintain service quality controls.',
    ],
    cta: { label: 'Go To Admin Sign In', href: '/login' },
  },
];

const processSteps = [
  {
    title: 'Parcel Received',
    detail:
      'Staff logs incoming parcel details and maps it to the correct student and hostel context.',
    icon: Package2,
  },
  {
    title: 'Student Notified',
    detail:
      'The system triggers timely updates so students know exactly when to expect action.',
    icon: BellRing,
  },
  {
    title: 'Delivery Scheduled',
    detail:
      'Delivery personnel picks up assigned requests with a structured timeline to avoid confusion.',
    icon: Clock3,
  },
  {
    title: 'Secure Handoff',
    detail:
      'OTP/QR verification finalizes the handoff and updates records instantly for full traceability.',
    icon: QrCode,
  },
];

const faqItems = [
  {
    q: 'Who can use ParcelPort?',
    a: 'ParcelPort is designed for university parcel ecosystems and supports students, delivery staff, and admin teams with role-specific experiences.',
  },
  {
    q: 'How is delivery security handled?',
    a: 'The platform includes OTP and QR-enabled checkpoints, plus status timelines and role-based access control to prevent unauthorized actions.',
  },
  {
    q: 'Can admins monitor performance?',
    a: 'Yes. Admin modules provide dashboard-level visibility into parcel movement, pending queues, delivery completion, and payment review states.',
  },
  {
    q: 'Does it support payment proof workflows?',
    a: 'Yes. Payment screenshot uploads and review flows are integrated for transparent verification and streamlined approval handling.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f6fafe] text-[#04122e]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-20 h-96 w-96 rounded-full bg-[#fea619]/20 blur-3xl" />
        <div className="absolute top-[30%] -right-20 h-[28rem] w-[28rem] rounded-full bg-[#04122e]/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-[#c5c6ce]/60 bg-[#f6fafe]/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#04122e] shadow-md">
              <Package2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-heading text-xl font-extrabold tracking-tight">ParcelPort</p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#45464d]">Campus Delivery Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-[#04122e]/20 px-4 py-2 text-sm font-bold text-[#04122e] transition hover:bg-[#04122e]/5"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-[#04122e] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#1a2744]"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-7xl gap-10 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:pt-20">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#fea619]/40 bg-[#fea619]/15 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#855300]">
              University Logistics, Reimagined
            </p>
            <h1 className="max-w-3xl font-heading text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              One platform for every parcel that enters, moves, and completes delivery on campus.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#45464d] sm:text-lg">
              ParcelPort centralizes intake, assignment, student communication, payment proof, and final handoff into a single reliable flow. It is built to reduce manual confusion, improve delivery speed, and give every stakeholder clear visibility.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#04122e] to-[#1a2744] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01]"
              >
                Create Student Account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register-staff"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#c5c6ce] bg-white px-6 py-3.5 text-sm font-bold text-[#04122e] transition hover:border-[#04122e]/30 hover:bg-[#f0f4f8]"
              >
                Register Delivery Staff
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {['Role-Based Access', 'OTP/QR Validation', 'Real-Time Tracking'].map((pill) => (
                <div key={pill} className="rounded-xl border border-[#c5c6ce]/80 bg-white px-4 py-3 text-sm font-semibold text-[#45464d]">
                  {pill}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#c5c6ce] bg-white p-6 shadow-xl shadow-[#04122e]/5 sm:p-8">
            <h2 className="font-heading text-2xl font-bold tracking-tight">Why campus teams choose ParcelPort</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#45464d]">
              The platform combines practical workflows with strict handoff controls so high-volume delivery windows stay reliable and auditable.
            </p>

            <div className="mt-6 space-y-4">
              {[
                'Centralized parcel lifecycle from arrival to completion',
                'Reduced missed pickups through clear student communication',
                'Cleaner staff coordination with fewer manual follow-ups',
                'Admin confidence through transparent operational records',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-[#f0f4f8] bg-[#f8fbff] p-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#fea619] text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-sm font-medium text-[#04122e]">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-[#04122e] p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b8c7ef]">Designed for scale</p>
              <p className="mt-2 text-sm leading-relaxed text-[#d7def3]">
                Whether your campus handles dozens or hundreds of deliveries daily, ParcelPort keeps operations structured and student experience consistent.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#855300]">Core Capabilities</p>
              <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">Everything needed to run parcel delivery operations</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {platformHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="group rounded-2xl border border-[#c5c6ce] bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#04122e]/10"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#04122e] text-white transition group-hover:bg-[#1a2744]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-xl font-bold tracking-tight">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#45464d]">{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="bg-[#04122e] py-16 text-white">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
            <div className="mb-10 max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#fea619]">Process Clarity</p>
              <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">A clear, trackable journey for every parcel</h2>
              <p className="mt-4 text-sm leading-relaxed text-[#d7def3] sm:text-base">
                ParcelPort enforces a structured lifecycle to remove ambiguity and help teams handle high volumes without losing reliability.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {processSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <article key={step.title} className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#fea619] text-[#04122e]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-xs font-bold text-[#b8c7ef]">Step {index + 1}</span>
                    </div>
                    <h3 className="font-heading text-xl font-bold tracking-tight">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#d7def3]">{step.detail}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8">
          <div className="mb-8 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#855300]">Role Experiences</p>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">Built for students, staff, and admins from day one</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#45464d] sm:text-base">
              Every role gets focused screens and actions, so users complete tasks faster with less training and fewer errors.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {roleBenefits.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.role} className="flex h-full flex-col rounded-2xl border border-[#c5c6ce] bg-white p-6">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0f4f8] text-[#04122e]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold tracking-tight">{item.role}</h3>
                  <ul className="mt-4 space-y-3">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-sm text-[#45464d]">
                        <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#fea619] text-white">
                          <Check className="h-3 w-3" />
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Link
                      href={item.cta.href}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#04122e] transition hover:text-[#855300]"
                    >
                      {item.cta.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <article className="rounded-3xl border border-[#c5c6ce] bg-white p-7 sm:p-8">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#04122e] text-white">
                <CreditCard className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-2xl font-bold tracking-tight">Payment and Proof Management</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#45464d] sm:text-base">
                Built-in payment workflow support with screenshot upload and review panels helps teams maintain transparent, auditable transaction handling.
              </p>
            </article>

            <article className="rounded-3xl border border-[#c5c6ce] bg-white p-7 sm:p-8">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#04122e] text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-2xl font-bold tracking-tight">Security and Accountability</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#45464d] sm:text-base">
                Role checks, secure auth, delivery confirmation steps, and lifecycle records keep operations accountable while protecting user-level access boundaries.
              </p>
            </article>
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-5 pb-20 sm:px-8">
          <div className="rounded-3xl border border-[#c5c6ce] bg-white p-6 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#855300]">FAQ</p>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">Questions teams ask before deployment</h2>

            <div className="mt-8 space-y-4">
              {faqItems.map((item) => (
                <article key={item.q} className="rounded-2xl border border-[#f0f4f8] bg-[#f8fbff] p-5">
                  <h3 className="font-heading text-lg font-bold tracking-tight">{item.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#45464d] sm:text-base">{item.a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#c5c6ce] bg-[#f0f4f8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-4 px-5 py-8 sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="font-heading text-lg font-extrabold tracking-tight">ParcelPort</p>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#45464d]">
              University Parcel Delivery Management
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.12em] text-[#45464d]">
            <Link href="/login" className="transition hover:text-[#855300]">
              Sign In
            </Link>
            <span className="text-[#c5c6ce]">|</span>
            <Link href="/register" className="transition hover:text-[#855300]">
              Student Register
            </Link>
            <span className="text-[#c5c6ce]">|</span>
            <Link href="/register-staff" className="transition hover:text-[#855300]">
              Staff Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
