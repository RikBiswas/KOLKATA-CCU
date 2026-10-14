import React, { useState } from 'react';
import { ArrowUpRight, Check, Copy, Download, MapPin, Clock, Award, GraduationCap, Briefcase } from 'lucide-react';
import { siteConfig } from '../../config/site.config';
import { MediaFrame } from '../common/MediaFrame';

interface AboutPageProps {
  onOpenContact: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenContact }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(siteConfig.profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Intro & Bio Section */}
      <section className="space-y-8">
        <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-2">
            <span>Biography</span>
            <span aria-hidden="true">&middot;</span>
            <span>Profile</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
            About &amp; Experience
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-8 space-y-5 text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
            {siteConfig.profile.fullBio.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Email Copied' : 'Copy Email Address'}</span>
              </button>

              <button
                onClick={onOpenContact}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                <span>Get in touch</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="md:col-span-4 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] space-y-4">
            <div className="w-full aspect-square rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
              <MediaFrame
                title={siteConfig.profile.name}
                aspectRatio="1:1"
                variant="portrait"
                className="w-full h-full"
              />
            </div>

            <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>{siteConfig.profile.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>{siteConfig.profile.timezone}</span>
              </div>
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                {siteConfig.profile.availability}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Experience Timeline */}
      <section className="space-y-8">
        <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-neutral-400" />
            <h2 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
              Career Experience
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-500">2018 &mdash; Present</span>
        </div>

        <div className="space-y-10">
          {siteConfig.experience.map((exp, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                    {exp.role}
                  </h3>
                  <div className="text-xs font-medium text-neutral-500 mt-0.5">
                    {exp.company} &middot; {exp.location}
                  </div>
                </div>
                <div className="text-xs font-mono text-neutral-500">{exp.period}</div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {exp.description}
              </p>

              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Key Deliverables
                </div>
                <ul className="space-y-1.5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                  {exp.highlights.map((highlight, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2">
                      <span className="text-neutral-400 select-none">&bull;</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono text-neutral-500">
                {exp.technologies.map((tech, tIdx) => (
                  <React.Fragment key={tech}>
                    <span>{tech}</span>
                    {tIdx < exp.technologies.length - 1 && (
                      <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">
                        &middot;
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Domain Skills Grid */}
      <section className="space-y-8">
        <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
            Technical Competencies &amp; Skills Matrix
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {siteConfig.skills.map((group, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] space-y-4"
            >
              <h3 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                {group.category}
              </h3>
              <div className="space-y-2.5">
                {group.skills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex items-center justify-between text-xs py-1 border-b border-neutral-100/60 dark:border-neutral-900/60 last:border-0"
                  >
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      {skill.name}
                    </span>
                    <span className="font-mono text-neutral-500">{skill.level}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education & Qualifications */}
      <section className="space-y-6">
        <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-neutral-400" />
          <h2 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
            Education &amp; Credentials
          </h2>
        </div>

        <div className="space-y-4">
          {siteConfig.education.map((edu, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <h3 className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                  {edu.degree}
                </h3>
                <span className="text-xs font-mono text-neutral-500">{edu.period}</span>
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                {edu.institution} &middot; {edu.location}
              </div>
              {edu.honors && (
                <div className="text-xs font-mono text-neutral-500">Honors: {edu.honors}</div>
              )}
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
                Focus Areas: {edu.focus}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Selected Achievements */}
      <section className="space-y-6">
        <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-neutral-400" />
          <h2 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
            Selected Honors &amp; Keynotes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {siteConfig.achievements.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] space-y-2"
            >
              <div className="text-xs font-mono text-neutral-400">{item.year}</div>
              <h3 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                {item.title}
              </h3>
              <div className="text-xs font-medium text-neutral-500">{item.issuer}</div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pt-1">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
